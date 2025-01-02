import { Component } from '@angular/core';
import { BannerComponent } from "../banner/banner.component";
import { ProductsHightlightComponent } from "../products-hightlight/products-hightlight.component";
import { ProductListComponent } from "../product-list/product-list.component";
import { CategoriesListComponent } from "../categories-list/categories-list.component";
import { PaginatorComponent } from "../paginator/paginator.component";
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { Subscription } from 'rxjs';
import { HomeService } from '../../../services/guest/home.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [BannerComponent, ProductsHightlightComponent, ProductListComponent, CategoriesListComponent, PaginatorComponent, HeaderComponent, FooterComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  numbers: number[] = [1, 2, 3, 4, 2, 3, 4, 5];

  productLIst : Subscription | null = null;
  products : Array<any> | null = null;
  categories : Array<any> = []


  constructor(private homeServ : HomeService){}

  ngOnInit(){
    this.iniComponent()
  }

  iniComponent(){
    
  }
}
