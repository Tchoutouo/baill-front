import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NoficationsService } from '../../../../services/nofications.service';
import { LocalStorageService } from '../../../../services/admin/local-storage.service';
import { EntityServiceService } from '../../../../services/admin/entity-service.service';
import { User } from '../../../../models/user';
import { Subscription } from 'rxjs';
import { Country } from 'country-state-city';
import { GetContryByCodePipe } from "../../../../pipes/get-contry-by-code.pipe";
import { AlertConfirmService } from '../../../../services/alert-confirm.service';
import { Alert } from '../../../../models/alert';
import { AlertConfirmComponent } from "../../../alert-confirm/alert-confirm.component";
import { Notification } from '../../../../models/notification';
import { AlertComponent } from '../../alert/alert.component';

@Component({
  selector: 'app-user-index',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule, GetContryByCodePipe, AlertConfirmComponent,AlertComponent],
  templateUrl: './user-index.component.html',
  styleUrl: './user-index.component.css'
})
export class UserIndexComponent implements OnInit{
  
  user!: User;  
  userSub?: Subscription; 
  errorMessage : string = '';
  rangeList: any[] = [5, 10, 15, 20, 25, 30] ;
  userList: any[] = [];
  showAlert : any;
  display_message: boolean = false;
  message_alert : any  = null;



  constructor(  
    private localStorage: LocalStorageService,  
    private entityService: EntityServiceService,  
    private router: Router,  
    private notification: NoficationsService,
    private alertConfirm : AlertConfirmService  
  ){}
  
  ngOnInit(): void {
    if (this.message_alert) {
      this.display_message = true;
    }
    this.getAllAdvertisers();
    
  }

  getAllAdvertisers(){
    const entity = "advertiser_back/5";

    this.userSub = this.entityService.getAll(entity).subscribe({
      next: (data: any) => { 
        console.log("data-set",data.data.data);

        if (data.success) {
          this.userList = data.data.data;
        }
      },

      error: (error: any) => {  
        console.log("error", error);
      }
    })
  }

  closeAlert(event : any){
    event ? this.display_message = false : this.display_message = false ;
  }

  handleConfirmDisabled(value : boolean){
    let alert = new Alert();
    this.showAlert = true;
    alert.message = "Est-vous sûr de vouloir poursuivre cette action ?"
    alert.cancel_label = "Annuler"
    alert.success_label =  "Oui"
    alert.display =  value;
    this.alertConfirm.emitAlert(alert);

  }

  disabledUser(event : any , user: any){
    let alert = new Alert();
    alert.message = "";
    alert.cancel_label = "";
    this.showAlert = false;
    alert.success_label = "";
    alert.display = false;
    this.alertConfirm.emitAlert(alert);

    if(user && event){
      this.entityService.disabledAdvertiser(user.id).subscribe({
        next: (data: any) => {
          const notif = new Notification();
          if(data.success === true){
            if(user.status == 1){
              notif.message = "Utilisateur bloqué avec success!";
            }else{
              notif.message = "Utilisateur débloqué avec success!";
            }
            notif.status = "success";
          }else{
            notif.message = "Echèc de l'opération!";
            notif.status = "warning";
          }
          this.notification.emitNotification(notif);
          this.getAllAdvertisers();

        },
        error: (error: any) => {
          console.log("Activation & Désactivation utilisateur: ",error);
        }
      });
    }
  }
}
