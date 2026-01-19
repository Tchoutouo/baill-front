import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductComponent } from "../product/product.component";
import { ImageListComponent } from "../image-list/image-list.component";
import { FooterComponent } from "../footer/footer.component";

import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../../../services/guest/home.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { TranslateModule } from '@ngx-translate/core';
import { ListStateServiceService } from '../../../services/guest/list-state-service.service';
import { Location } from '@angular/common';
import { AuthenticatorService } from '../../../services/admin/authenticator.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, ProductComponent, ImageListComponent, HeaderComponent,FooterComponent, TranslateModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
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
    public returnIndex: number = -1;

    constructor(private route : ActivatedRoute, private homeServ : HomeService,  
      private navigationService: ListStateServiceService,
      private location: Location, private router : Router,
      private auth: AuthenticatorService){
    }

    ngOnInit() {
      //window.scroll(0, 0)
    
      this.initComponent();
        
      this.navigationService.setShowBackButton(true);

      this.route.queryParams.subscribe(params => {
        if (params['returnIndex']) {
          this.returnIndex = parseInt(params['returnIndex'], 10);
        }
      });
    }

    initComponent(){
      try {
        const annouce_id = this.route.snapshot.paramMap ? this.route.snapshot.paramMap.get('id') : null;
        try {
          if (annouce_id) {
        //console.log("annonce_id",annouce_id);

            this.annouceSub = this.homeServ.getAnnouceByID(annouce_id).subscribe({
              next: (datas: any) => {
                console.log("details",datas);
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
                      console.log("annonces de la meme categorie", datas);
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

    ngOnDestroy() {
      // Cacher le bouton retour quand le composant est détruit
      this.navigationService.setShowBackButton(false);
      if (this.annouceSub) {
        this.annouceSub.unsubscribe();
      }
      if (this.announcesSub) {
        this.announcesSub.unsubscribe();
      }
    }

    goBack() {
      this.router.navigate(['/'], {
        queryParams: { 
          restored: 'true',
          lastViewed: this.returnIndex 
        }
      });
    }
}
