import { Component } from '@angular/core';
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
  imports: [BannerComponent, ProductsHightlightComponent, ProductListComponent, CategoriesListComponent, PaginatorComponent, HeaderComponent, FooterComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
