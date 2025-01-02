import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductComponent } from "../product/product.component";
import { ImageListComponent } from "../image-list/image-list.component";
import { FooterComponent } from "../footer/footer.component";

import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../../../services/guest/home.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, ProductComponent, ImageListComponent, HeaderComponent,FooterComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
    imagesList : Array<string> = ['']; 
    number_limit : Array<number> = [1, 3, 4, 5] ;
    fisrtImage : string = '';
    displayButtonMore : boolean = false ;
    differenceLimit : number = 1 ;
    imageLimit : number = 4;
    ImagesSrcs :  any = null;
    displayModal : boolean = false;
    srcArray: Array<any> = [""];
    carateristiques: Array<string> = [""];
    phone_number: string = "237694798186";
    whatsapp_number: string = "237694798186";
    emailUser: string = "contact@gmail.com";
    subject: string = "Annonce sur bailleurnet";
    body: string =  "";
    siteUser: string = "www.bailleurnet.com";
    apiRessources : string = environment.apiUrlRessources;
    annouce_id  : number = 0 ; 
    categoriesList : any[] = [];
    catgories_id_array : number[] = [];
    other_announces : any = [];
    announcesSub : Subscription | undefined
    annouce : any ;
    annouceSub : Subscription | undefined;

    constructor(private route : ActivatedRoute, private homeServ : HomeService){
      
    }

    ngOnInit() {
      window.scroll(0, 0)
    
      this.initComponent();
        
      
    }

    initComponent(){
      try {
        const annouce_id = this.route.snapshot.paramMap ? this.route.snapshot.paramMap.get('id') : null;
        try {
          if (annouce_id) {
            this.annouceSub = this.homeServ.getAnnouceByID(annouce_id).subscribe({
              next: (datas: any) => {
                console.log(datas);
                if (datas.success == true && datas.data) {
                  this.annouce  = datas.data ;
                  this.imagesList = this.annouce.url_image;
                  this.annouce_id = this.annouce.id ;
                  this.categoriesList = this.annouce.categories ;
                  this.reChangeImage();
                  if (this.imagesList.length > 4) {
                    this.displayButtonMore = true;
                    this.differenceLimit = this.imagesList.length - this.imageLimit;
                  }
                }else{
                  this.annouce = null ;

                }
                
              },
    
              error: (erreur: any) => {
                console.log(erreur);
              },

              complete : () => {
                if (this.categoriesList.length >= 1) {
                  this.categoriesList.forEach((item)=>{
                    this.catgories_id_array.push(item.id)
                  });
                  
                  this.announcesSub = this.homeServ.getAnnoucesOfSameCategoyByIds(JSON.stringify(this.catgories_id_array)).subscribe({
                    next: (datas: any) => {
                      if (datas.success = true && datas.data.length >= 1) {
                        this.other_announces = datas.data;
                      } else {
                        this.other_announces = false;
                      }
                    },

                    error: (erreur : any) => {
                      console.log(erreur)
                    }
                    ,
                    complete: () => {
                      console.log('finish')
                    }
                  })
                }
              }
            })
          }
        } catch (erreur ) {
          console.log(erreur);
          
        }
        
        
      } catch (error) {
        console.log(error);
      }

    }

    changeFirstImage(event : any){
      this.fisrtImage = event;
    }

    reChangeImage(){
      this.fisrtImage = this.imagesList[0]
    }
  

    showMoreImage(event : any){
      this.ImagesSrcs = this.imagesList ;
      this.srcArray[0] = this.imagesList[3];
      this.srcArray[1] = this.ImagesSrcs.filter((item : string) => item !== this.imagesList[3]) ;
      this.displayModal = true;
    }


    closeModal(){
      this.ImagesSrcs = false;
      this.displayModal = false;
      console.log(this.ImagesSrcs, this.displayModal);
    }


}
