import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { LocalStorageService } from '../../../services/admin/local-storage.service';
import { AuthenticatorService } from '../../../services/admin/authenticator.service';
import { NoficationsService } from '../../../services/nofications.service';
import { Notification } from '../../../models/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, RouterLink],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {

  lang = 'fr';
  userName = '';
  email = '';

  notifEmail = true;
  notifPlatform = true;
  notifNewsletter = false;

  showDeleteConfirm = false;
  deleteConfirmText = '';
  isSaving = false;
  isDeleting = false;

  readonly DELETE_PHRASE = 'SUPPRIMER';

  constructor(
    private readonly localStorage: LocalStorageService,
    private readonly authent: AuthenticatorService,
    private readonly notifService: NoficationsService,
    private readonly translate: TranslateService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const user = this.localStorage.getItem('user');
    this.userName = user ? (user.first_name || user.username || '') : '';
    this.email = user ? user.email : '';
    this.lang = localStorage.getItem('lang') || 'fr';

    const prefs = this.localStorage.getItem('notif_prefs');
    if (prefs) {
      this.notifEmail = prefs.email ?? true;
      this.notifPlatform = prefs.platform ?? true;
      this.notifNewsletter = prefs.newsletter ?? false;
    }
  }

  saveNotifPrefs(): void {
    this.isSaving = true;
    const prefs = {
      email: this.notifEmail,
      platform: this.notifPlatform,
      newsletter: this.notifNewsletter,
    };
    this.localStorage.setItem('notif_prefs', prefs);

    setTimeout(() => {
      this.isSaving = false;
      const notif = new Notification();
      notif.message = this.translate.instant('settings.notifications.saved');
      notif.status = 'success';
      this.notifService.emitNotification(notif);
    }, 400);
  }

  changeLanguage(lang: string): void {
    this.lang = lang;
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }

  get canDelete(): boolean {
    return this.deleteConfirmText.trim().toUpperCase() === this.DELETE_PHRASE;
  }

  deleteAccount(): void {
    if (!this.canDelete) return;
    this.isDeleting = true;
    this.authent.logOut().subscribe({
      error: () => this.router.navigate(['/signin']),
      complete: () => this.router.navigate(['/signin']),
    });
  }
}
