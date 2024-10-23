import { Component } from '@angular/core';

@Component({
  selector: 'app-products-hightlight',
  standalone: true,
  imports: [],
  templateUrl: './products-hightlight.component.html',
  styleUrl: './products-hightlight.component.css'
})
export class ProductsHightlightComponent {
    phone_number: string = "237694798186";
    whatsapp_number: string = "237694798186";
    emailUser: string = "contact@gmail.com";
    subject: string = "Annonce sur bailleurnet";
    body: string =  "";
    siteUser: string = "www.bailleurnet.com";
}
