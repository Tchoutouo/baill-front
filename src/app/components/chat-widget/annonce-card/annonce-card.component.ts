import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnnonceCard } from '../../../services/agent.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-agent-annonce-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './annonce-card.component.html',
  styleUrl: './annonce-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentAnnonceCardComponent {
  @Input({ required: true }) annonce!: AnnonceCard;

  get photoUrl(): string | null {
    if (!this.annonce.photo) return null;
    return `${environment.apiUrlRessources}/${this.annonce.photo}`;
  }

  get primaryCategory(): string {
    return this.annonce.categories?.[0]?.title ?? '';
  }

  get formattedPrice(): string {
    return new Intl.NumberFormat('fr-CM').format(this.annonce.price) + ' FCFA';
  }
}
