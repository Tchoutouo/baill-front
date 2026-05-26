import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription, filter } from 'rxjs';
import { AgentService, AgentData, DraftStatus, StreamEvent } from '../../services/agent.service';
import { AgentSessionService } from '../../services/agent-session.service';
import { LocalStorageService } from '../../services/admin/local-storage.service';
import { AgentAnnonceCardComponent } from './annonce-card/annonce-card.component';
import { AnnonceDraftCardComponent } from './annonce-draft-card/annonce-draft-card.component';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  data?: AgentData | null;
  isStreaming?: boolean;
  toolInProgress?: string | null;
}

const TOOL_LABELS: Record<string, string> = {
  search_annonces:        'Recherche d\'annonces…',
  get_annonce_details:    'Chargement des détails…',
  get_categories:         'Chargement des catégories…',
  get_abonnements:        'Chargement des forfaits…',
  create_annonce_step:    'Vérification du brouillon…',
  validate_annonce_draft: 'Validation du brouillon…',
  submit_annonce:         'Création de l\'annonce…',
  get_my_annonces:        'Chargement de vos annonces…',
  list_pending_annonces:  'Chargement des annonces en attente…',
  approve_annonce:        'Approbation en cours…',
  reject_annonce:         'Rejet en cours…',
  get_platform_stats:     'Calcul des statistiques…',
  search_users_admin:     'Recherche d\'utilisateurs…',
};

const HIDDEN_ROUTES = ['/signin', '/signup'];

const SUGGESTIONS_VISITOR: string[] = [
  'Trouver un appartement',
  'Voir les catégories',
  'Tarifs de publication',
  'Comment publier une annonce ?',
];

const SUGGESTIONS_ADVERTISER: string[] = [
  'Publier une annonce',
  'Voir mes annonces',
  'Trouver un bien',
  'Tarifs de publication',
];

const SUGGESTIONS_ADMIN: string[] = [
  'Annonces en attente',
  'Statistiques plateforme',
  'Chercher un utilisateur',
  'Approuver une annonce',
];

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule, AgentAnnonceCardComponent, AnnonceDraftCardComponent],
  templateUrl: './chat-widget.component.html',
  styleUrl: './chat-widget.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWidgetComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('messagesContainer') private messagesRef!: ElementRef<HTMLElement>;

  isOpen     = false;
  isLoading  = false;
  isVisible  = true;
  inputText  = '';
  unread     = 0;
  messages: ChatMessage[] = [];

  private sessionId    = '';
  private currentUrl   = '';
  private sub          = new Subscription();
  private shouldScroll = false;

  constructor(
    private readonly agent:     AgentService,
    private readonly session:   AgentSessionService,
    private readonly router:    Router,
    private readonly sanitizer: DomSanitizer,
    private readonly cdr:       ChangeDetectorRef,
    private readonly storage:   LocalStorageService,
  ) {}

  get isLoggedIn(): boolean {
    return !!this.storage.currentUser;
  }

  get isAdminMode(): boolean {
    return this.currentUrl.startsWith('/admin');
  }

  get suggestions(): string[] {
    if (this.isAdminMode) return SUGGESTIONS_ADMIN;
    return this.isLoggedIn ? SUGGESTIONS_ADVERTISER : SUGGESTIONS_VISITOR;
  }

  ngOnInit(): void {
    this.sessionId = this.session.getSessionId();
    this.updateVisibility(this.router.url);

    this.sub.add(
      this.router.events.pipe(filter(e => e instanceof NavigationEnd))
        .subscribe((e) => {
          this.updateVisibility((e as NavigationEnd).urlAfterRedirects);
          this.cdr.markForCheck();
        })
    );

    // Reset conversation when switching between admin and public context
    this.sub.add(
      this.storage.user$.subscribe(() => this.cdr.markForCheck())
    );
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollBottom();
      this.shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // ── Interactions ──────────────────────────────────────────────────────────

  toggle(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.unread = 0;
      this.shouldScroll = true;
    }
    this.cdr.markForCheck();
  }

  send(): void {
    const text = this.inputText.trim();
    if (!text || this.isLoading) return;

    this.messages.push({ role: 'user', content: text });
    this.inputText    = '';
    this.isLoading    = true;
    this.shouldScroll = true;
    this.cdr.markForCheck();

    // Placeholder de la réponse en cours de streaming
    const assistantIdx = this.messages.length;
    this.messages.push({ role: 'assistant', content: '', data: null, isStreaming: true });

    this.sub.add(
      this.agent.chatStream(text, this.sessionId).subscribe({
        next: (event: StreamEvent) => {
          const msg = this.messages[assistantIdx];
          switch (event.event) {
            case 'token':
              msg.content += (event.data as { text: string }).text;
              msg.toolInProgress = null;
              this.shouldScroll = true;
              break;
            case 'tool':
              msg.toolInProgress = (event.data as { name: string }).name;
              break;
            case 'data':
              msg.data = event.data as AgentData;
              break;
            case 'error':
              msg.content    = (event.data as { message: string }).message ?? 'Une erreur est survenue.';
              msg.isStreaming = false;
              this.isLoading  = false;
              break;
            case 'done':
              msg.isStreaming    = false;
              msg.toolInProgress = null;
              this.isLoading     = false;
              this.shouldScroll  = true;
              if (!this.isOpen) this.unread++;
              break;
          }
          this.cdr.markForCheck();
        },
        error: () => {
          const msg = this.messages[assistantIdx];
          if (msg) {
            msg.content    = 'Une erreur est survenue. Veuillez réessayer.';
            msg.isStreaming = false;
          }
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      })
    );
  }

  getToolLabel(name: string): string {
    return TOOL_LABELS[name] ?? `${name}…`;
  }

  sendSuggestion(text: string): void {
    this.inputText = text;
    this.send();
  }

  confirmDraft(): void {
    this.inputText = 'Je confirme, veuillez soumettre mon annonce.';
    this.send();
  }

  asDraft(data: AgentData | null | undefined): DraftStatus | null {
    return data?.draft ?? null;
  }

  onEnterKey(event: Event): void {
    if (!(event as KeyboardEvent).shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) this.toggle();
  }

  clearConversation(): void {
    this.messages = [];
    this.agent.clearSession(this.sessionId).subscribe();
    this.session.clear();
    this.sessionId = this.session.getSessionId();
    this.cdr.markForCheck();
  }

  // ── Formatage ─────────────────────────────────────────────────────────────

  formatMessage(text: string): SafeHtml {
    const safe = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const html = safe
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  trackMessage(_: number, msg: ChatMessage): string {
    return msg.role + msg.content.slice(0, 20);
  }

  trackAnnonce(_: number, a: any): number { return a.id; }

  private updateVisibility(url: string): void {
    this.currentUrl = url;
    this.isVisible  = !HIDDEN_ROUTES.some(r => url.startsWith(r));
  }

  private scrollBottom(): void {
    const el = this.messagesRef?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
