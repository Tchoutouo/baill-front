import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { HomeService } from '../../../services/guest/home.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-products-hightlight',
  standalone: true,
  imports: [CommonModule],
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

    apiRessources : string = environment.apiUrlRessources;
    annoucesList : Subscription | undefined;
    annouces_high : any ;

    constructor ( private homeServ : HomeService ) { }

    ngOnInit(){
      this.initComponent()
    }

    initComponent(){
      this.annoucesList = this.homeServ.getAllAnnoucesPublished().subscribe({
        next: (result_request: any) => { 
          console.log({hightlight : result_request});
          if (result_request.success == true)  {
            this.annouces_high = result_request.data_annonce_une ;
          }else{
            this.annouces_high = null ;
          }
        },

        error: (erreur : any) => {
          console.log(erreur);
        }
      })
    }
}
