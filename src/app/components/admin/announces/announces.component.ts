import { Component, EventEmitter, Output } from '@angular/core';
import { PaginatorComponent } from "../../admin/paginator/paginator.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertComponent } from "../alert/alert.component";
import {Notification} from '../../../models/notification';
import { AnounceEntity } from '../../../models/admin/nounceEntity';
import { getEntityPoperties } from '../../../helpers/helper';
import { FormatEntityNamePipe } from "../../../pipes/format-entity-name.pipe";
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import { AuthenticatorService } from '../../../services/admin/authenticator.service';
import { LocalStorageService } from '../../../services/admin/local-storage.service';
import { NoficationsService } from '../../../services/nofications.service';
// import { FormatEntityNamePipe } from '../../../helpers/helper';

@Component({
  selector: 'app-announces',
  standalone: true,
  imports: [PaginatorComponent, RouterModule, CommonModule, AlertComponent, FormatEntityNamePipe],
  templateUrl: './announces.component.html',
  styleUrl: './announces.component.css'
})
export class AnnouncesComponent {

  message_alert : any  = null;
  head_anounces_lines : string[] = [];
  headLines : any 
  display_message: boolean = false;
  pageNumber : number = 1;
  pageLImit : number = 5;
  rangeList : any = [5, 10, 15, 25, 30, 35, 40];
  paginationDAtas : any;
  result_data : any;
  annouces : any;
  loged : boolean = false;
  querySearch : string = "";
  entityName : string = ""

  constructor(private entytServ : EntityServiceService, private auth : AuthenticatorService, 
    private notification : NoficationsService, private localStorage : LocalStorageService){

  }

  ngOnInit(){
    if (this.message_alert) {
      this.display_message = true;
    }

    this.head_anounces_lines = getEntityPoperties('anouces');
    this.headLines = Object.keys(this.head_anounces_lines);
    console.log(this.headLines);

    this.initComponent();
    
  }

  closeAlert(event : any){
    event ? this.display_message = false : this.display_message = false ;
  }

  setPage(page : number){
    this.pageNumber = page ;
    this.getDatasByPage();
  }
  
  setPageLimit(event : any){
    const {name, value} = event.target;
    const pageRange = parseInt(value);
    if (!isNaN(pageRange)) {
      this.pageNumber=1;
      this.pageLImit = pageRange;
      this.getDatasByPage();
    }
  }


  getDatasByPage(){
    this.loged = this.auth.isAuthenticated();
    // if (this.loged) {
      const user = this.localStorage.getItem('user')
      // const user_id = 6;
      const user_id = user?.id;
      console.log({oetit : this.pageLImit});
      if (this.querySearch.length >= 2) {
        this.result_data = this.entytServ.searchDatasByPage(user_id, this.pageNumber, 
          this.pageLImit, this.querySearch).subscribe({
          next: (datas: any) => { 
            this.annouces = datas.annonces.data;
            if (datas.success) {
              this.paginationDAtas = {
                current : datas.annonces.current_page ,
                next : datas.annonces.current_page + 1 ,
                paginateLength : datas.annonces.last_page ,
                previous : datas.annonces.current_page - 1 ,
                allcount : datas.annonces.total ,
              }
            }
          },

          error: (error: any) => {

           }
        })
      }else{
        this.result_data = this.entytServ.getUserAnoucesByPages(user_id, this.pageNumber ,this.pageLImit).subscribe({
          next: (datas: any) => { 
            console.log(datas);
            this.annouces = datas.annonces.data;
            if (datas.success) {
              this.paginationDAtas = {
                current : datas.annonces.current_page ,
                next : datas.annonces.current_page + 1 ,
                paginateLength : datas.annonces.last_page ,
                previous : datas.annonces.current_page - 1 ,
                allcount : datas.annonces.total ,
              }
            }
  
            console.log(this.paginationDAtas);
            
          },
  
          error: (error: any) => { 
            console.log(error);
          }
        })
      }
    // }
    // this.result_data = this.entytServ.getAll()
  }

  initComponent(){
    this.getDatasByPage();
  }

  publishAnnounce(ann_id : any){
    if (!isNaN(ann_id)) {
      const user = this.localStorage.getItem('user')
      const user_id = user?.id;
      const newStatus = '3';
      
      let resul = this.entytServ.changeAnnouceStatus(user_id, ann_id, newStatus).subscribe({
        next: (datas: any) => { 
          const notif = new Notification();
          if (datas.success) {
            notif.message = "Annonce crée avec success !"
            notif.status = "success"
          }else{
            notif.message = "erreur lors de l'enregistrement contacter l'administrateur !"
            notif.status = "error"
          }

          this.notification.emitNotification(notif)
        },

        error: (erreur: any) => { 
          console.log(erreur);
          
        }
      })
    }
  }

  searchValue(event : any){
    event.preventDefault()

    this.querySearch = "";
    this.entityName = "annouces"
    if (event) {
      const {name, value} = event.target;
      this.querySearch +=  this.entityName + "=" + value;
      console.log(this.querySearch);
    }else{

    }

    this.getDatasByPage();
  }
  
}
