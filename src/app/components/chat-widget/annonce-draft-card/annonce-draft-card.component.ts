import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraftStatus } from '../../../services/agent.service';

interface FieldDef {
  key: string;
  label: string;
  required: boolean;
}

const FIELD_DEFS: FieldDef[] = [
  { key: 'title',        label: 'Titre',         required: true  },
  { key: 'price',        label: 'Prix (FCFA)',    required: true  },
  { key: 'location',     label: 'Localisation',  required: true  },
  { key: 'neighborhood', label: 'Quartier',       required: false },
  { key: 'contact',      label: 'Contact',        required: true  },
  { key: 'description',  label: 'Description',   required: false },
  { key: 'categories',   label: 'Catégories',    required: true  },
  { key: 'abonnement_id',label: 'Forfait',        required: true  },
];

@Component({
  selector: 'app-annonce-draft-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './annonce-draft-card.component.html',
  styleUrl: './annonce-draft-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnonceDraftCardComponent {
  @Input({ required: true }) draft!: DraftStatus;
  @Output() confirm = new EventEmitter<void>();

  get visibleFields(): FieldDef[] {
    return FIELD_DEFS.filter(
      f => f.required || (this.draft.fields[f.key] !== undefined && this.draft.fields[f.key] !== null && this.draft.fields[f.key] !== '')
    );
  }

  get completedCount(): number {
    return this.visibleFields.filter(f => !this.isMissing(f.key) && this.isFilled(f.key)).length;
  }

  get totalRequired(): number {
    return FIELD_DEFS.filter(f => f.required).length;
  }

  get progressPercent(): number {
    const required = FIELD_DEFS.filter(f => f.required);
    const done     = required.filter(f => this.isFilled(f.key)).length;
    return Math.round((done / required.length) * 100);
  }

  isFilled(key: string): boolean {
    const v = this.draft.fields[key];
    if (v === undefined || v === null || v === '') return false;
    if (Array.isArray(v)) return v.length > 0;
    return true;
  }

  isMissing(key: string): boolean {
    return this.draft.missing_fields.includes(key);
  }

  formatValue(key: string): string {
    const v = this.draft.fields[key];
    if (v === undefined || v === null) return '';
    if (Array.isArray(v)) return v.join(', ');
    if (key === 'price') return new Intl.NumberFormat('fr-CM').format(Number(v)) + ' FCFA';
    return String(v);
  }
}
