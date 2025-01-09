import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AlertComponent } from "../alert/alert.component";
import { LocalStorageService } from '../../../services/admin/local-storage.service';
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import { Subscription } from 'rxjs';
import {  isAdmin } from '../../../helpers/helper'; 
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
    dashboardSub : Subscription |undefined

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
      this.anounceList = ['mvks', "sf", "ksjdf", "skjfd", "dkhfj"];
      this.getDashboardData();
      // this.isAdmin = isAdmin();
      this.isAdmin = this.checkProfil.isAdmin();

    }


    getDashboardData(){
      const user = this.locaStorage.getItem('user')
      // const user_id = 6;
      const user_id = user?.id;
      if (user_id) {
        this.dashboardSub = this.entityService.getDashoardDatas(user_id).subscribe({
          next : (datas : any) =>{
            console.log(datas);
            
            if (datas.success) {
              this.totalEncours = datas.annonce_qte_inprogress;
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
