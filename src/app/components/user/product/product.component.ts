import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { CommonModule, ViewportScroller } from '@angular/common';
import { HomeService } from '../../../services/guest/home.service';
import { TranslateModule } from '@ngx-translate/core';


export interface ProductClickEvent {
  product: any;
  index: number;
  action: string;
}
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule, TranslateModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})

export class ProductComponent implements OnInit{
  siteUser: string = "www.bailleurnet.com";
  phone_number: string = "237694798186";
  whatsapp_number: string = "237694798186";
  emailUser: string = "contact@gmail.com";
  subject: string = "Annonce sur bailleurnet";
  body: string =  "";
  @Input() productItem : any ;
  @Input() productIndex: number = 0;


  @Output() productClick = new EventEmitter<ProductClickEvent>();
  product : any ;
  imagesPath : string[] = [''];
  imageUrl : string = ''
  apiRessources : string = environment.apiUrlRessources;

  constructor(private viewportScroller: ViewportScroller, private router : Router, private homeServ : HomeService) {}

  ngOnInit(): void {
    //console.log(`Produit ${this.productIndex} initialisé:`, this.productItem);
    this.initComponent()
  }
  
  initComponent(){
    this.product = this.productItem;
    this.imagesPath =this.productItem.url_image;
    if (this.productItem.url_image) {
      // this.imageUrl = this.apiRessources+'/'+this.productItem.url_image[0];
      this.imageUrl = this.productItem.url_image[0];
    }
  };

  onProductClick() {
    this.productClick.emit({
      product: this.productItem,
      index: this.productIndex,
      action: 'view_details'
    });
  }

  // Surligner l'annonce dernièrement vue
  isRecentlyViewed(index: number): boolean {
    return index === this.homeServ.getLastViewedIndex();
  }
}
