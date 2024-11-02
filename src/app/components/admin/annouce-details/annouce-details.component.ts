import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../../../services/guest/home.service';

@Component({
  selector: 'app-annouce-details',
  standalone: true,
  imports: [],
  templateUrl: './annouce-details.component.html',
  styleUrl: './annouce-details.component.css'
})
export class AnnouceDetailsComponent {

  apiRessources : string = environment.apiUrlRessources;
  annouce_id  : number = 0 ; 
  categoriesList : any[] = [];
  catgories_id_array : number[] = [];
  other_announces : any = [];
  announcesSub : Subscription | undefined
  annouce : any ;
  annouceSub : Subscription | undefined;
  imagesList : Array<string> = ['']; 
   
  constructor(private route : ActivatedRoute, private homeServ : HomeService){
      
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
              }else{
                this.annouce = null ;

              }
              
            },
  
            error: (erreur: any) => {
              console.log(erreur);
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
}
