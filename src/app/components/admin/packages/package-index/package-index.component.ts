import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EntityServiceService } from '../../../../services/admin/entity-service.service';
import { Subscription } from 'rxjs';
import { PackageEditComponent } from "../package-edit/package-edit.component";
import { AlertComponent } from '../../alert/alert.component';
import { AlertConfirmComponent } from '../../../alert-confirm/alert-confirm.component';
import { Alert } from '../../../../models/alert';
import { NoficationsService } from '../../../../services/nofications.service';
import { AlertConfirmService } from '../../../../services/alert-confirm.service';

@Component({
  selector: 'app-package-index',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule, PackageEditComponent, AlertComponent, AlertConfirmComponent],
  templateUrl: './package-index.component.html',
  styleUrl: './package-index.component.css'
})
export class PackageIndexComponent implements OnInit{
  
  entServiceSub : Subscription | undefined
  abonment_list : Array<any> = [];
  rangeList: any[] = [5, 10, 15, 20, 25, 30] ;
  showAlert : any;
  display_message: boolean = false;
  message_alert : any  = null;

  constructor(private entityService : EntityServiceService,
              private notification: NoficationsService,
              private alertConfirm : AlertConfirmService 
  ){

  }

  ngOnInit(): void {
    if (this.message_alert) {
      this.display_message = true;
    }
    this.getAbonnement();
  }
  
  getAbonnement(){
    this.entServiceSub = this.entityService.getAllAbonnements().subscribe({
      next: (data: any) => { 
        if (data.success) {
          console.log('data', data);
          this.abonment_list = data.data
        }
      },

      error: (error: any) => {  }
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

  disabledAbonnement(event: any, abonnement: any){

  }

  handleConfirmDelete(value : boolean){
    let alert = new Alert();
    this.showAlert = true;
    alert.message = "Est-vous sûr de vouloir supprimer ce forfait?"
    alert.cancel_label = "Annuler"
    alert.success_label =  "Oui"
    alert.display =  value;
    this.alertConfirm.emitAlert(alert);
  }
}
