import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../../../services/guest/home.service';
import { CommonModule } from '@angular/common';
import {Notification} from '../../../models/notification';
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import { LocalStorageService } from '../../../services/admin/local-storage.service';
import { NoficationsService } from '../../../services/nofications.service';
import { Router } from '@angular/router';
import { ForfaitListComponent } from '../forfait-list/forfait-list.component';
import { GetContryByCodePipe } from "../../../pipes/get-contry-by-code.pipe";



@Component({
  selector: 'app-annouce-details',
  standalone: true,
  imports: [CommonModule, ForfaitListComponent, GetContryByCodePipe],
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
  data_annouce : any[] = [];

  poperty_names : string[] = ['title','price', 'country', 'location', 'neighborhood', 'description']
   
  constructor(private route : ActivatedRoute, private homeServ : HomeService, private entytServ : EntityServiceService,
    private localStorage : LocalStorageService, private notification : NoficationsService, private router: Router
  ){
      
  }

  ngOnInit(){
    this.initComponent();
  }

  initComponent(){
    try {
      const annouce_id = this.route.snapshot.paramMap ? this.route.snapshot.paramMap.get('id') : null;
      console.log(annouce_id);
      
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


  setAnnouceStatus(ann_id : any, newStatus :any){
    try {
      if (!isNaN(ann_id)) {
        const user = this.localStorage.getItem('user')
        
        const user_id = user?.id;
        
        console.log({test : ann_id})
        let resul = this.entytServ.changeAnnouceStatus(user_id, ann_id, newStatus).subscribe({
          next: (datas: any) => { 
            
            const notif = new Notification();
            if (datas.success) {
              notif.message = "Annonce crée avec success !"
              notif.status = "success";
            }else{
              notif.message = "Erreur lors de l'enregistrement contacter l'administrateur !"
              notif.status = "warning";
            }
            this.router.navigate(['/admin']);   
            
            this.notification.emitNotification(notif);
            
          },
  
          error: (erreur: any) => { 
            console.log(erreur);
            
          }
        })
      }
    } catch (erreur) {
      console.log('capture erreur ' , erreur);
    }
  }

  handleSubmit(event : any , id : any){
    console.log(event, id);
  } 
}
