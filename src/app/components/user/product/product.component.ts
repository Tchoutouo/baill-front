import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule],
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
  product : any ;
  imagesPath : string[] = [''];
  imageUrl : string = ''
  apiRessources : string = environment.apiUrlRessources;

  ngOnInit(): void {
    this.initComponent()
  }
  
  initComponent(){
    console.log("annonce",this.productItem)
    this.product = this.productItem;
    this.imagesPath =this.productItem.url_image;
    if (this.productItem.url_image) {
      // this.imageUrl = this.apiRessources+'/'+this.productItem.url_image[0];
      this.imageUrl = this.productItem.url_image[0];
    }
  };
}
