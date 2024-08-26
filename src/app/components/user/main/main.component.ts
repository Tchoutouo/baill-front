import { Component } from '@angular/core';
import { BannerComponent } from "../banner/banner.component";
import { ProductsHightlightComponent } from "../products-hightlight/products-hightlight.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [BannerComponent, ProductsHightlightComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
