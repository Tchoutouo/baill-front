import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ProductComponent } from '../product/product.component';
import { TagsListComponent } from '../tags-list/tags-list.component';
import { PaginatorComponent } from '../paginator/paginator.component';
import { TranslateModule } from '@ngx-translate/core';
import { HomeService } from '../../../services/guest/home.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductComponent, CommonModule, TagsListComponent, PaginatorComponent, TranslateModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnChanges {
  @Input() initialProducts: any[] = [];

  products: any[] = [];

  private readonly cdr        = inject(ChangeDetectorRef);
  private readonly homeServ   = inject(HomeService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnChanges(changes: SimpleChanges): void {
    const next = changes['initialProducts']?.currentValue;
    if (next?.length) {
      this.products = next;
    }
  }

  filterDatas(event: any): void {
    if (!event) return;
    this.homeServ.filterDataBy(event)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (datas: any) => {
          this.products = (datas.success && datas.annonces) ? datas.annonces : [];
          this.cdr.markForCheck();
        },
        error: (err: any) => console.error('Erreur filtre', err)
      });
  }

  trackByAnnounce(_index: number, item: any): number {
    return item?.id ?? _index;
  }
}
