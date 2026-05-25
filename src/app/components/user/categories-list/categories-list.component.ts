import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EntityServiceService } from '../../../services/admin/entity-service.service';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslateModule],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css'
})
export class CategoriesListComponent {
  categories: any[] = [];

  private readonly cdr       = inject(ChangeDetectorRef);
  private readonly entitServ = inject(EntityServiceService);

  constructor() {
    this.entitServ.getAllAnnoucesCategories()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data: any) => {
          if (data.success) {
            this.categories = data.data;
            this.cdr.markForCheck();
          }
        },
        error: (err: any) => console.error('Erreur catégories', err)
      });
  }

  trackByCategory(_index: number, item: any): number {
    return item?.id ?? _index;
  }
}
