import { Component } from '@angular/core';
import { BannerComponent } from "../banner/banner.component";
import { ProductsHightlightComponent } from "../products-hightlight/products-hightlight.component";
import { ProductListComponent } from "../product-list/product-list.component";
import { CategoriesListComponent } from "../categories-list/categories-list.component";
import { PaginatorComponent } from "../paginator/paginator.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [BannerComponent, ProductsHightlightComponent, ProductListComponent, CategoriesListComponent, PaginatorComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
