import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ICity, ICountry } from 'country-state-city';
import { User } from '../../../../models/user';
import { EntityServiceService } from '../../../../services/admin/entity-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NoficationsService } from '../../../../services/nofications.service';
import { GetContryByCodePipe } from "../../../../pipes/get-contry-by-code.pipe";
import { AlertConfirmComponent } from "../../../alert-confirm/alert-confirm.component";
import { Alert } from '../../../../models/alert';
import { AlertConfirmService } from '../../../../services/alert-confirm.service';
import { Notification } from '../../../../models/notification';
import { AlertComponent } from "../../alert/alert.component";


@Component({
  selector: 'app-user-show',
  standalone: true,
  imports: [CommonModule, TranslateModule, GetContryByCodePipe, AlertConfirmComponent, AlertComponent],
  templateUrl: './user-show.component.html',
  styleUrl: './user-show.component.css'
})
export class UserShowComponent implements OnInit{
  countries!: ICountry[] | undefined;  
  cities!: ICity[] | undefined;  
  selectedCountry!: any;  
  selectedCity!: any;  
  picture: any = false;
  advertiser: any;
  user_id: any;
  showAlert : any;
  display_message: boolean = false;
  message_alert : any  = null;

  
  constructor(private entityService: EntityServiceService,  
              private router: Router,  
              private notification: NoficationsService,
              private route : ActivatedRoute,
              private alertConfirm : AlertConfirmService 
  ){}

  ngOnInit(): void {
    if (this.message_alert) {
      this.display_message = true;
    }
    this.ShowAdvertiser();
  }

  ShowAdvertiser() {
    try {
      this.user_id = this.route.snapshot.paramMap ? this.route.snapshot.paramMap.get('id') : null;
      const entity ='users_back/show/';

      this.entityService.getAdvertiser(this.user_id , entity).subscribe({
        next : (data : any) =>{
          this.advertiser = data.data;
        },
        error: (error : any) => {
          console.log("changement utilisateur", error);
        }
      });
    } catch (error) {
      console.log("catch changement utilisateur", error);
    }      
  }

  closeAlert(event : any){
    event ? this.display_message = false : this.display_message = false ;
  }

  handleConfirm(value : boolean){
    let alert = new Alert();
    this.showAlert = true;
    alert.message = "Est-vous sûr de vouloir poursuivre cette action ?"
    alert.cancel_label = "Annuler"
    alert.success_label =  "Oui"
    alert.display =  value;
    this.alertConfirm.emitAlert(alert);
    
  }
  
  disabledAdvertiser(event : any , advertiser: any){
    console.log("disabled user", advertiser, event);
    let alert = new Alert();
    alert.message = "";
    alert.cancel_label = "";
    this.showAlert = false;
    alert.success_label = "";
    alert.display = false;
    this.alertConfirm.emitAlert(alert);

    if(advertiser && event){
      this.entityService.disabledAdvertiser(advertiser.id).subscribe({
        next: (data: any) => {
          const notif = new Notification();
          console.log(data);
          
          if(data.success === true){
            if(advertiser.status == 1){
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

        },
        error: (error: any) => {
          console.log("Activation & Désactivation utilisateur: ",error);
        }
      });
    }
  }
}
