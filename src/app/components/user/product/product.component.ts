import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterModule, RouterLink],
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

  ngOnInit(): void {
    
  }
  
}
