import { Component, EventEmitter, Output } from '@angular/core';
import { PaginatorComponent } from "../../admin/paginator/paginator.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertComponent } from "../alert/alert.component";
import {Notification} from '../../../models/notification';
import { AnounceEntity } from '../../../models/admin/nounceEntity';
import { getEntityPoperties, isAdmin } from '../../../helpers/helper';
import { FormatEntityNamePipe } from "../../../pipes/format-entity-name.pipe";
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import { AuthenticatorService } from '../../../services/admin/authenticator.service';
import { LocalStorageService } from '../../../services/admin/local-storage.service';
import { NoficationsService } from '../../../services/nofications.service';
import { ForfaitListComponent } from '../forfait-list/forfait-list.component';
import { Subscription } from 'rxjs';
import { AlertConfirmComponent } from '../../alert-confirm/alert-confirm.component';
import { Alert } from '../../../models/alert';
import { AlertConfirmService } from '../../../services/alert-confirm.service';
import { FormCategoryComponent } from "../form-category/form-category.component";

// import { FormatEntityNamePipe } from '../../../helpers/helper';

@Component({
  selector: 'app-announces',
  standalone: true,
  imports: [PaginatorComponent, RouterModule, CommonModule, AlertComponent, FormatEntityNamePipe, ForfaitListComponent, AlertConfirmComponent, FormCategoryComponent],
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
  query: string = "";
  resulMessage : string  = '';
  updateSub : Subscription | undefined;
  data_to_update : any
  confirm : any
  deleteSub : Subscription | undefined
  deleteResult : any;
  showAlert : any;
  headLinesAdmin : any[] = [];
  categoriesSub : Subscription | undefined
  allCcategories : any;
  catQuery : string = '';
  category_pageLimit : number = 5;
  category_pageNumber : number = 1;
  isAdmin : boolean = false;

  constructor(private entytServ : EntityServiceService, private auth : AuthenticatorService, 
    private notification : NoficationsService, private localStorage : LocalStorageService, 
    private alertConfirm : AlertConfirmService){

  }

  ngOnInit(){
    if (this.message_alert) {
      this.display_message = true;
    }

    this.isAdmin = isAdmin();
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
      console.log(this.query.length);
      
      if (this.query.length >= 2) {
        this.result_data = this.entytServ.searchDatasByPage(user_id, this.pageNumber, 
          this.pageLImit, this.query).subscribe({
          next: (result_search: any) => { 
            console.log({result : result_search});
            
            if (result_search.success == true)  {
              
                this.annouces = result_search.annonces.data;
                this.paginationDAtas = {
                  current : result_search.annonces?.current_page ,
                  next : result_search.annonces?.current_page + 1 ,
                  paginateLength : result_search.annonces?.last_page ,
                  previous : result_search.annonces?.current_page - 1 ,
                  allcount : result_search.annonces?.total ,
                }
             
            }else{
              this.annouces = null;
              
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
    this.getAllCategories();
  }

  getAllCategories(){
      try {
        if (this.catQuery.length >= 2) {
          this.categoriesSub = this.entytServ.getAllCategories(this.category_pageNumber ,this.category_pageLimit, this.catQuery).subscribe({
            next: (datas: any) => {
              console.log({categorie : datas});
            },
            error: (error: any) => { 
              console.log('error went get all categories', error);
            }
          })
        }else{
          this.categoriesSub = this.entytServ.getAllCategories(this.category_pageNumber ,this.category_pageLimit).subscribe({
            next: (datas: any) => {
              console.log({categorie : datas});
            },
            error: (error: any) => { 
              console.log('error went get all categories', error);
            }
          })
        }
      } catch (error) {
        
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
              notif.message = "Annonce mise à jour avec success !"
              notif.status = "success";
            }else{
              notif.message = "Erreur lors de la mise à jour contacter l'administrateur !"
              notif.status = "warning";
            }
  
            this.notification.emitNotification(notif);
            this.getDatasByPage();
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

  searchValue(event : any){
    event.preventDefault()

    this.query = "";
    this.querySearch = "";
    this.entityName = "search"
    if (event) {
      const {name, value} = event.target;
      this.querySearch +=  this.entityName + "=" + value;
      this.query = value;
      console.log(this.querySearch);
    }else{

    }
    this.getDatasByPage();
  }

  handleSubmit(event : any , announce : any){
    this.data_to_update  = announce ;
    const entity = 'annonce_back/update';
    if(event && announce){
      this.data_to_update.abonnement_id= event
      this.data_to_update.status= '3'

      this.updateSub = this.entytServ.update(this.data_to_update.id, this.data_to_update, entity).subscribe({
        next: (datas: any) => { 
          console.log({next : datas});
        },
        error: (error: any) => {
          console.log(error);
        }
      })
    }
  } 

  handleConfirmDelete(value : boolean){
    let alert = new Alert();
    this.showAlert = true;
    alert.message = "Voulez vous vraiment supprimer cette annonce ?"
    alert.cancel_label = "annuler"
    alert.success_label =  "okay"
    alert.display =  value;
    console.log(alert.display);
    this.alertConfirm.emitAlert(alert);

  }

  deleteAnnouce(event : any , data: any){
    let alert = new Alert();
    console.log(event);
    
    alert.message = " "
    alert.cancel_label = " "
    this.showAlert = false;
    alert.success_label =  " "
    alert.display =  false; 
    console.log({ferme:this.showAlert});
    this.alertConfirm.emitAlert(alert);
    let categories_ann : any = []
    data?.categories.map((item : any) =>{
      categories_ann.push(item.id)
    })
    
    if (data?.id && event) {
      this.deleteResult = this.entytServ.deleteAnnouce(data?.id, JSON.stringify(categories_ann)).subscribe({
        next: (datas: any) => {
          // console.log(datas);
            const notif = new Notification();
              if (datas.success === true) {
                notif.message = "Annonce supprimée avec success !"
                notif.status = "success";
              }else{
                notif.message = "Erreur lors suppression de cet annonce veuillez contacter l'administrateur svp !"
                notif.status = "warning";
              }
              this.notification.emitNotification(notif);
              this.getDatasByPage();
            // }
         },

        error: (error: any) => { 
          console.log(error);
        }
      })
    }
  }
  
}
