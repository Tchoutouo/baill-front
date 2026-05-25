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
import { PaginatorComponent } from "../../../admin/paginator/paginator.component";
import { LoaderComponent } from '../../loader/loader.component';

const AVATAR_COLORS = [
  '#5EB21E','#4C9813','#24583F','#1797FF',
  '#FAC84E','#EE6666','#8F8F8F','#232323',
];

@Component({
  selector: 'app-user-index',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule, GetContryByCodePipe, AlertConfirmComponent, AlertComponent, PaginatorComponent, LoaderComponent],
  templateUrl: './user-index.component.html',
  styleUrl: './user-index.component.css'
})
export class UserIndexComponent implements OnInit{
  
  user!: User;  
  userSub?: Subscription; 
  errorMessage : string = '';
  rangeList: any[] = [10, 15, 20, 25, 30] ;
  userList: any = [];
  showAlert : any;
  display_message: boolean = false;
  message_alert : any  = null;
  pageNumber : number = 1;
  pageLImit : number = 10;
  querySearch : string = "";
  query: string = "";
  paginationDAtas : any;
  result_data : any;
  loged : boolean = false;
  entityName : string = "";
  resulMessage : string  = '';
  advertises: any;


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
    this.getAllAdvertisers();
  }

  setPage(page : number){
    this.pageNumber = page ;
    this.getAllAdvertisers();
  }
  
  setPageLimit(event : any){
    const {name, value} = event.target;
    const pageRange = parseInt(value);
    if (!isNaN(pageRange)) {
      this.pageNumber=1;
      this.pageLImit = pageRange;
      this.getAllAdvertisers();
    }
  }

  getAllAdvertisers(){

    if (this.query.length >= 2){
      this.userSub = this.entityService.searchAdvertiserByPage(this.pageNumber, this.pageLImit, this.query).subscribe({
        next: (result_search: any) => { 

          if (result_search.success) {
            this.userList = result_search.data.data;

            this.paginationDAtas = {
              current : result_search.data?.current_page ,
              next : result_search.data?.current_page + 1 ,
              paginateLength : result_search.data?.last_page ,
              previous : result_search.data?.current_page - 1 ,
              allcount : result_search.data?.total ,
            }
          }else{
            this.userList = null;
          }
        },
  
        error: (error: any) => {  
          console.log("error", error);
        }
      })

    }else{
      this.userSub = this.entityService.getAllAdvertisers(this.pageLImit).subscribe({
        next: (data: any) => { 
          if (data.success) {
            
            this.userList = data.data.data;
            this.paginationDAtas = {
              current : data.data?.current_page ,
              next : data.data?.current_page + 1 ,
              paginateLength : data.data?.last_page ,
              previous : data.data?.current_page - 1 ,
              allcount : data.data?.total ,
            }
          }
        },
  
        error: (error: any) => {  
          console.log("error", error);
        }
      })
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

  clearSearch(): void {
    this.query = '';
    this.querySearch = '';
    this.getAllAdvertisers();
  }

  initials(username: string): string {
    if (!username) return '?';
    const parts = username.trim().split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : username.slice(0, 2).toUpperCase();
  }

  avatarColor(username: string): string {
    if (!username) return AVATAR_COLORS[0];
    const idx = username.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[idx];
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
