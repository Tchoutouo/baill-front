import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BannerComponent } from '../banner/banner.component';
import { ProductsHightlightComponent } from '../products-hightlight/products-hightlight.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { CategoriesListComponent } from '../categories-list/categories-list.component';
import { PaginatorComponent } from '../paginator/paginator.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { HomeService } from '../../../services/guest/home.service';
import { AuthenticatorService } from '../../../services/admin/authenticator.service';

@Component({
  selector: 'app-main',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BannerComponent,
    ProductsHightlightComponent,
    ProductListComponent,
    CategoriesListComponent,
    PaginatorComponent,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  products: any[] = [];
  highlights: any[] = [];

  private readonly cdr        = inject(ChangeDetectorRef);
  private readonly homeServ   = inject(HomeService);
  private readonly auth       = inject(AuthenticatorService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const user    = this.auth.isLoggedIn();
    const user_id = user?.id ?? null;

    this.homeServ.getAllAnnoucesPublished(user_id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (datas: any) => {
          if (datas.success) {
            this.products   = datas.data_annonce      ?? [];
            this.highlights = datas.data_annonce_une  ?? [];
            this.cdr.markForCheck();
          }
        },
        error: (err: any) => console.error('Erreur chargement accueil', err)
      });
  }
}
