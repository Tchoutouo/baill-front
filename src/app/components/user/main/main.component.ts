import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { HomeService } from '../../../services/guest/home.service';

// Components
import { BannerComponent } from "../banner/banner.component";
import { ProductsHightlightComponent } from "../products-hightlight/products-hightlight.component";
import { ProductListComponent } from "../product-list/product-list.component";
import { CategoriesListComponent } from "../categories-list/categories-list.component";
import { PaginatorComponent } from "../paginator/paginator.component";
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-main',
  standalone: true,
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
export class MainComponent {

  // Liste des produits & catégories
  productListSub: Subscription | null = null;
  products: Array<any> | null = null;
  categories: Array<any> = [];

  // Filtres envoyés à <app-product-list>
  productFilters = {
    categ: null,
    lang: 'fr ',
    amount_min: null,
    amount_max: null,
    asc: null,
    user_id: null,
    country: null,
    city: null
  };

  constructor(private homeServ: HomeService) {}

  ngOnInit() {
    this.initComponent();
  }

  initComponent() {
   
  }

  // Reçoit les données depuis <app-categories-list>
  onFilterChanged(data: any) {
    this.productFilters = {
      ...this.productFilters,
      categ: data.categ ?? this.productFilters.categ,
      amount_min: data.amount_min ?? null,
      amount_max: data.amount_max ?? null,
      asc: data.asc ?? null
    };
  }
}
