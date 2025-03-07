import { Component, EventEmitter, Output } from '@angular/core';
import { PaginatorComponent } from "../../admin/paginator/paginator.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertComponent } from "../alert/alert.component";
import {Notification} from '../../../models/notification';
import * as bootstrap from 'bootstrap'
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
import { CheckProfilService } from '../../../services/check-profil.service';
import { EditCategoryComponent } from "../edit-category/edit-category.component";
import { Router } from '@angular/router';
import { PaymentItemComponent } from "../payment-item/payment-item.component";

// import { FormatEntityNamePipe } from '../../../helpers/helper';

@Component({
  selector: 'app-announces',
  standalone: true,
  imports: [PaginatorComponent, RouterModule, CommonModule, AlertComponent, FormatEntityNamePipe, ForfaitListComponent, AlertConfirmComponent, FormCategoryComponent, EditCategoryComponent, PaymentItemComponent],
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
  closeFormCategory : boolean = false;
  rangeList : any = [5, 10, 15, 25, 30, 35, 40];
  paginationDAtas : any;
  categories_list : any;
  categories_poperties : any;
  datas_paginate : any;
  result_data : any;
  annouces : any;
  paymentList : any;
  showPayForm : boolean = false ;
  loged : boolean = false;
  querySearch : string = "";
  entityName : string = ""
  query: string = "";
  resulMessage : string  = '';
  updateSub : Subscription | undefined;
  getPaySub : Subscription | undefined;
  data_to_update : any
  confirm : any
  headLinesCat : any
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
  selectedCat : any
  selectedCatDelet : any
  deleteCatSub : Subscription | undefined
  currentAnnounce: any = {};

  constructor(private entytServ : EntityServiceService, private auth : AuthenticatorService, 
    private notification : NoficationsService, private localStorage : LocalStorageService, 
    private alertConfirm : AlertConfirmService, private checkProfil: CheckProfilService, private router : Router){

  }

  ngOnInit(){
    if (this.message_alert) {
      this.display_message = true;
    }

    // this.isAdmin = isAdmin();
    this.isAdmin = this.checkProfil.isAdmin();

    this.head_anounces_lines = getEntityPoperties('anouces');
    this.headLines = Object.keys(this.head_anounces_lines);
    
    this.categories_poperties = getEntityPoperties('categories');
    this.headLinesCat = Object.keys(this.categories_poperties);

    this.initComponent();
    this.getPaymentMethod();
  }

  closeAlert(event : any){
    event ? this.display_message = false : this.display_message = false ;
  }

  setPage(page : number){
    this.pageNumber = page ;
    this.getDatasByPage();
  }

  setPageCategories(page : number){
    this.category_pageNumber = page ;
    this.getAllCategories();
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
      
      if (this.query.length >= 2) {
        this.result_data = this.entytServ.searchDatasByPage(user_id, this.pageNumber, 
          this.pageLImit, this.query).subscribe({
          next: (result_search: any) => { 
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
          this.categoriesSub = this.entytServ.searchCatByPage(this.category_pageNumber, 
            this.category_pageLimit, this.catQuery).subscribe({
              next: (datas: any) => {
                if(datas.success){
                  this.categories_list = datas.data;
                 
                  this.datas_paginate = {
                    current : datas.data?.current_page ,
                    next : datas.data?.current_page + 1 ,
                    paginateLength : datas.data?.last_page,
                    previous : datas.data?.current_page - 1,
                    allcount : datas.data?.total,
                  }
                }else{
                  this.categories_list = {
                    data : [],
                  } 
                }
              },
              error: (error: any) => { 
                console.log('error went get all categories', error);
              }
          })
        }else{
          this.categoriesSub = this.entytServ.getAllCategories(this.category_pageNumber ,this.category_pageLimit).subscribe({
            next: (datas: any) => {
              if(datas.success){
                this.categories_list = datas.data;
               
                this.datas_paginate = {
                  current : datas.data?.current_page ,
                  next : datas.data?.current_page + 1 ,
                  paginateLength : datas.data?.last_page,
                  previous : datas.data?.current_page - 1,
                  allcount : datas.data?.total,
                }
              }else{
                this.categories_list = {
                  data : [],
                } 
              }
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

        if (newStatus.key) {
          let alert = new Alert();
          alert.message = "";
          alert.cancel_label = "";
          this.showAlert = false;
          alert.success_label = "";
          alert.display = false;
          this.alertConfirm.emitAlert(alert);
          if (newStatus.key?.status !== -1) {
            newStatus = 1 ;
          }else{
            newStatus = -1;
          }
        } 
        
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
    }else{

    }
    this.getDatasByPage();
  }

  handleSubmit(event : any , announce : any){
    this.data_to_update  = announce ;
    const entity = 'annonce_back/update';
    if(event && announce){
      if (event.type === 'Standard' || event.type === 'Premium') {
     
        return this.handlePayment(event); 
      }
      this.data_to_update.abonnement_id= event
      this.data_to_update.status= '3'

      this.updateSub = this.entytServ.update(this.data_to_update.id, this.data_to_update, entity).subscribe({
        next: (datas: any) => { 
          
        },
        error: (error: any) => {
          
        }
      })
    }
  } 

  handlePayment(data:any){
    try {
      if (data) {
        this.showPayForm = true;
        this.currentAnnounce['announce'] = data ;
      }
    } catch (error) {
      
    }

  }
  handleConfirmDelete(value : any){
    let alert = new Alert();
    this.showAlert = true;
   
    alert.message = "Voulez vous vraiment supprimer cette annonce ?"
    alert.cancel_label = "annuler"
    alert.success_label =  "okay"
    
    alert.display =  value[0];
    
    this.alertConfirm.emitAlert(alert);

  }

  handleConfirmDeleteCat(value : any){
    let alert = new Alert();
    this.showAlert = true;
    this.selectedCatDelet = value[2];
    if (value[1] == 'category') {
      alert.message = "Voulez vous vraiment supprimer cette catégorie ?"
      alert.cancel_label = "Non"
      alert.success_label =  "Oui"
    }
    alert.display =  value[0];
    
    this.alertConfirm.emitAlert(alert);
  }

  resetAlert(){
    let alert = new Alert();
    
    alert.message = " "
    alert.cancel_label = " "
    this.showAlert = false;
    alert.success_label =  " "
    alert.display =  false; 
    this.alertConfirm.emitAlert(alert);
    
  }

  deleteAnnouce(event : any , data: any){
    
    this.resetAlert();

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


  CloseFormCategoryModal(id : any){
    const modalElement = document.getElementById(id);  
    const modal = bootstrap.Modal.getInstance(modalElement ? modalElement : ' ');  
    modal?.hide(); 
    let backdropElements = document.getElementsByClassName('modal-backdrop');  
    if(backdropElements.length) {  
      Array.from(backdropElements).forEach(element => {  
        element.classList.remove('show'); // Supprime la classe 'show'  
        element.classList.add('d-none'); // Supprime la classe 'show'  
      });  
    }   
  }
  
  getCategory(categorie : any){
    if (categorie) {
      this.selectedCat = categorie
    }
  }

  deleteCategory(event : any , data: any){
    this.resetAlert();
    
    
    if (data?.id && event) {
      this.deleteCatSub = this.entytServ.deleteCat(this.selectedCatDelet?.id).subscribe({
        next: (response: any) => {
          // console.log(response);
            const notif = new Notification();
              if (response.success === true) {
                notif.message = "Catégorie supprimée avec success !"
                notif.status = "success";
              }else{
                notif.message = "Erreur lors suppression de cet catégorie veuillez contacter l'administrateur svp !"
                notif.status = "warning";
              }
              this.notification.emitNotification(notif);
              this.getAllCategories();
            // }
         },
  
        error: (error: any) => { 
          const notif_ = new Notification();
          notif_.message = "Erreur lors suppression de cet catégorie veuillez contacter l'administrateur svp !"
          notif_.status = "warning";
          this.notification.emitNotification(notif_);
  
          console.log('error when delete category', error);
        }
      })
  
    }
    }

    setCatPageLimit(event : any){
      const {name, value} = event.target;
      const pageRange = parseInt(value);
      
      if (!isNaN(pageRange)) {
        this.category_pageLimit=1;
        this.category_pageLimit = pageRange;
        this.getAllCategories();
      }
    }

    searchValueCat(event: any){
      event.preventDefault()

    this.catQuery = "";
    this.querySearch = "";
    this.entityName = "search"
    if (event) {
      const {name, value} = event.target;
      this.querySearch +=  this.entityName + "=" + value;
      this.catQuery = value;

    }else{

    }
      this.getAllCategories();
    }

    handleConfirmDisabled(value : boolean, type : string){
      let alert = new Alert();
      this.showAlert = true;
      if (type == '-1') {
        alert.message = "Est-vous sûr de vouloir débloquer cette annonce ?"
      }else{
        alert.message = "Est-vous sûr de vouloir bloquer cette annonce ?"
      }
      alert.cancel_label = "Annuler"
      alert.success_label =  "Oui"
      alert.display =  value;
      this.alertConfirm.emitAlert(alert);
    }

    async storeAndPayAnnouce(payment : any, value_datas : any){
      try {
          this.showPayForm = false;
          const user_id = this.localStorage.getItem('user').id;
          const newStatus = '3';
          const response = await this.entytServ.changeAnnouceStatus(user_id, value_datas.id ,newStatus, payment).toPromise();

          // Gestion de la réponse
          this.handleResponse(response);
        }catch (error) {
          this.handleError(error);
      }
    }

    private handleResponse(data: any) {
      const notif = new Notification();
      notif.message = data.success
        ? "Annonce créée avec succès !"
        : "Erreur lors de l'enregistrement, contacter l'administrateur !";
      notif.status = data.success ? "success" : "warning";
    
      this.notification.emitNotification(notif);
    
      // if (data.success) {
      //   this.router.navigate(['/admin']);
      // }
    }
    
    private handleError(error: any) {
      console.error("Création d'annonce", error);
      const notif = new Notification();
      notif.message = "Erreur lors de l'enregistrement, contacter l'administrateur !";
      notif.status = "warning";
      this.notification.emitNotification(notif);
    }

    getPaymentMethod(){
      this.getPaySub = this.entytServ.getPaymentMethd().subscribe({
        next: (res_data: any) => {
          if (res_data.success) {
            this.paymentList = res_data.data
          }
        },
  
        error: (error: any) => { },
        complete: () => { },
      })
    }
}
