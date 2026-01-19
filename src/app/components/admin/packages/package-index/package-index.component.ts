import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EntityServiceService } from '../../../../services/admin/entity-service.service';
import { Subscription } from 'rxjs';
import { Modal } from 'bootstrap';
import { PackageEditComponent } from "../package-edit/package-edit.component";
import { AlertComponent } from '../../alert/alert.component';
import { AlertConfirmComponent } from '../../../alert-confirm/alert-confirm.component';
import { Alert } from '../../../../models/alert';
import { NoficationsService } from '../../../../services/nofications.service';
import { AlertConfirmService } from '../../../../services/alert-confirm.service';
import { Notification } from '../../../../models/notification';
import { PaginatorComponent } from "../../../admin/paginator/paginator.component";
import { CurrencyFormatterPipe } from "../../../../pipes/currency-formatter.pipe";
import { FormatTimePipe } from "../../../../pipes/format-time.pipe";



@Component({
  selector: 'app-package-index',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule, PackageEditComponent, AlertComponent, AlertConfirmComponent, PaginatorComponent, CurrencyFormatterPipe, FormatTimePipe],
  templateUrl: './package-index.component.html',
  styleUrl: './package-index.component.css'
})
export class PackageIndexComponent implements OnInit{
  
  entServiceSub : Subscription | undefined
  abonment_list : any = [];
  abonnementItem : any = [];
  rangeList: any[] = [5, 10, 15, 20, 25, 30] ;
  showAlert : any;
  display_message: boolean = false;
  message_alert : any  = null;
  pageNumber : number = 1;
  pageLImit : number = 5;
  querySearch : string = "";
  query: string = "";
  paginationDAtas : any;
  result_data : any;
  entityName : string = "";
  isModalOpen = false;
  // currencyCode = 'XAF';


  constructor(private entityService : EntityServiceService,
              private notification: NoficationsService,
              private alertConfirm : AlertConfirmService 
  ){

  }

  ngOnInit(): void {
    window.scroll(0, 0);
    if (this.message_alert) {
      this.display_message = true;
    }
    this.getAbonnement();
  }

  setPage(page : number){
    this.pageNumber = page ;
    this.getAbonnement();
  }
  
  setPageLimit(event : any){
    const {name, value} = event.target;
    const pageRange = parseInt(value);
    if (!isNaN(pageRange)) {
      this.pageNumber=1;
      this.pageLImit = pageRange;
      this.getAbonnement();
    }
  }

  searchValue(event : any){
    event.preventDefault()
    this.query = "";
    this.querySearch = "";
    this.entityName = "search"
    if (event) {
      const {name, value} = event.target;
      this.querySearch +=  this.entityName + "=" + value;
      this.query = value;
    }else{

    }
    this.getAbonnement();
  }
  
  getAbonnement(){
    if (this.query.length >= 2){
      this.entServiceSub = this.entityService.searchAbonnementsByPage(this.pageNumber, this.pageLImit, this.query).subscribe({
        next: (result_search: any) => { 
          if (result_search.success) {
            this.abonment_list = result_search.data.data;
            console.log("liste des abonnements:", this.abonment_list);
            this.paginationDAtas = {
              current : result_search.data?.current_page ,
              next : result_search.data?.current_page + 1 ,
              paginateLength : result_search.data?.last_page ,
              previous : result_search.data?.current_page - 1 ,
              allcount : result_search.data?.total ,
            }
          }else{
            this.abonment_list = null;
          }
        },
  
        error: (error: any) => {  
          console.log("error recherche", error);
        }
      })

    }else{
      // this.entityService.getCsrfCookie().subscribe({
      //   next: () => {
      //     console.log('CSRF cookie retrieved successfully');
      this.entServiceSub = this.entityService.getAllPackages(this.pageLImit).subscribe({
        next: (data: any) => { 
          if (data.success) {
            this.abonment_list = data.data.data;
            console.log("liste des abonnements 2:", this.abonment_list);
            this.paginationDAtas = {
              current : data.data?.current_page ,
              next : data.data?.current_page + 1 ,
              paginateLength : data.data?.last_page ,
              previous : data.data?.current_page - 1 ,
              allcount : data.data?.total ,
            }
            // console.log("abonment_list", this.abonment_list)
          }
        },
  
        error: (error: any) => {  
          console.log("Affichage des abonnements:", error);
        }
      });
      // 
    //   },
  
    //   error: (error: any) => {  
    //     console.log("testette:", error);
    //   }
    // });

    }

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

  changeStatusAbonnement(event: any, abonnement: any){
    let alert = new Alert();
        alert.message = "";
        alert.cancel_label = "";
        this.showAlert = false;
        alert.success_label = "";
        alert.display = false;
        this.alertConfirm.emitAlert(alert);
    
    if(abonnement && event){
      this.entityService.changeStatusAbonnements(abonnement.id).subscribe({
        next: (data: any) => {
          const notif = new Notification();
          if(data.success === true){
            if(abonnement.is_actived == 1){
              notif.message = "Forfait bloqué avec success!";
            }else{
              notif.message = "Forfait débloqué avec success!";
            }
            notif.status = "success";
          }else{
            notif.message = "Echèc de l'opération!";
            notif.status = "warning";
          }
          this.notification.emitNotification(notif);
          this.getAbonnement();

        },
        error: (error: any) => {
          console.log("Activation & Désactivation d'un abonnement: ",error);
        }
      });
    }
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

  deleteAbonnement(event: any, abonnement_id: any){
    let alert = new Alert();
    alert.message = "";
    alert.cancel_label = "";
    this.showAlert = false;
    alert.success_label = "";
    alert.display = false;
    this.alertConfirm.emitAlert(alert);

    if(abonnement_id && event){
      this.entityService.deleteAbonnement(abonnement_id).subscribe({
        next: (data: any) => {
          const notif = new Notification();
          if(data.success === true){
            notif.message = "Forfait supprimé avec success!";
            notif.status = "success";
          }else{
            notif.message = data.message;
            notif.status = "warning";
          }
          this.notification.emitNotification(notif);
          this.getAbonnement();
        },
        error: (error: any) => {
          console.log("Suppression d'un abonnement: ",error);
        }
      });
    }
  }

  updateModal_old(abonnement: any){
    this.isModalOpen = true;

    if(abonnement){
      let time;
      // switch (abonnement.type_time) {
      //   case 'S':
      //       time = abonnement.time/7;
      //       break;
      //   case 'M':
      //       time = abonnement.time/30;
      //       break;
      //   case 'A':
      //       time = abonnement.time/360;
      //       break;
      //   default:
      //       console.log("Periode invalide");
      // }
      abonnement.time = time;
      this.abonnementItem = abonnement;
    }
  }

  closeModal_old(event: any){
    this.isModalOpen = false;
    window.location.reload();
    this.getAbonnement();

  }

  updateModal(abonnement: any): void {
    // Prépare les données de l'abonnement pour le formulaire
      if(abonnement){
      let time;
      // switch (abonnement.type_time) {
      //   case 'S':
      //       time = abonnement.time/7;
      //       break;
      //   case 'M':
      //       time = abonnement.time/30;
      //       break;
      //   case 'A':
      //       time = abonnement.time/360;
      //       break;
      //   default:
      //       console.log("Periode invalide");
      // }
      // abonnement.time = time;
      this.abonnementItem = abonnement;
    }

    // Ouvre le modal Bootstrap si l'élément existe
    const modalEl = document.getElementById('package');
    if (modalEl) {
      const bsModal = Modal.getOrCreateInstance(modalEl);
      bsModal.show();
    } else {
      console.error('Modal #package introuvable dans le DOM.');
    }
  }

  closeModal(event: any): void {
    // Ferme le modal Bootstrap si l'élément existe
    const modalEl = document.getElementById('package');
    if (modalEl) {
      const bsModal = Modal.getOrCreateInstance(modalEl);
      bsModal.hide();
    } else {
      console.error('Modal #package introuvable dans le DOM.');
    }

    // Nettoyage avant ouverture
    this.clearBackdrops();

    // Recharge la liste sans recharger toute la page
    this.getAbonnement();
  }

  private clearBackdrops(): void {
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open');
    location.reload();
  }
}
