import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AlertComponent } from "../alert/alert.component";
import { LocalStorageService } from '../../../services/admin/local-storage.service';
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import { Subscription } from 'rxjs';
import { CheckProfilService } from '../../../services/check-profil.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AlertComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

    anounceList : Array<any> = [];
    dashboardSub : Subscription |undefined;
    total_users: number = 0;
    total_annonces : number = 0;
    total_montant: number = 0;
    progress_abonnement : any ;
    progress_status: any;
    tab_user_lock: Array<any> = [];
    popular_categories : Array<any> = [];


    totalEncours : number = 0;
    totalEnvoiDExp : number = 0;
    totalExpired : number = 0;
    isAdmin : boolean = false;

    constructor(private locaStorage : LocalStorageService, private entityService : EntityServiceService,
                private checkProfil: CheckProfilService
    ){

    }

    ngOnInit(){
      window.scroll(0, 5)
      this.isAdmin = this.checkProfil.isAdmin();
      this.getDashboardData();

    }


    getDashboardData(){
      const user = this.locaStorage.getItem('user')
      const user_id = user?.id;
      if (user_id) {
        if(this.isAdmin){
          this.dashboardSub = this.entityService.getDashoardDatasAdmin().subscribe({
            next : (datas : any) =>{
              console.log("all data",datas);
              
              if (datas.success) {
                this.total_users = datas.total_users;
                this.total_annonces = datas.total_annonces;
                this.total_montant = datas.total_montant;
                this.progress_abonnement = datas.progress_abonnement;
                this.progress_status = datas.progress_status;
                this.tab_user_lock = datas.tab_user_lock;
                this.popular_categories = datas.tab_categ_popular;
              }
            },
  
            error : (error : any) =>{
              console.log('error occur : ', error);
            },
  
            complete : ( ) =>{},
          })
          
        }else{
          this.dashboardSub = this.entityService.getDashoardDatas(user_id).subscribe({
            next : (datas : any) =>{
              
              if (datas.success) {
                this.totalEncours = datas.annonce_qte_inprogress;
                // this.totalEncours = datas.annonce_qte_publisher;
                this.totalEnvoiDExp = datas.annonce_qte_pause;
                this.totalExpired = datas.annonce_qte_expired;
              }
            },
  
            error : (error : any) =>{
              console.log('error occur : ', error);
              
            },
  
            complete : ( ) =>{},
          })

        }
        
      }
    }

    getDashboardDataAdmin(){
      const user = this.locaStorage.getItem('user')
      const user_id = user?.id;
      if (user_id) {
        this.dashboardSub = this.entityService.getDashoardDatas(user_id).subscribe({
          next : (datas : any) =>{
            console.log("all data",datas);
            
            if (datas.success) {
              // this.totalEncours = datas.annonce_qte_inprogress;
              this.totalEncours = datas.annonce_qte_publisher;
              this.totalEnvoiDExp = datas.annonce_qte_pause;
              this.totalExpired = datas.annonce_qte_expired;
            }
          },

          error : (error : any) =>{
            console.log('error occur : ', error);
            
          },

          complete : ( ) =>{},
        })
      }
    }

}
