import { Component, SimpleChanges } from '@angular/core';
import { ForfaitListComponent } from "../forfait-list/forfait-list.component";
import { ImageViewComponent } from "../image-view/image-view.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import {Notification} from '../../../models/notification';
import { NoficationsService } from '../../../services/nofications.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Country, State, City ,ICountry, IState, ICity}  from 'country-state-city';
import { LocalStorageService } from '../../../services/admin/local-storage.service';
import { PaymentsServiceService } from '../../../services/payments-service.service';
import { PaymentItemComponent } from "../payment-item/payment-item.component";
import { TranslateModule } from '@ngx-translate/core';



@Component({
  selector: 'app-form-create',
  standalone: true,
  imports: [ForfaitListComponent, ImageViewComponent, CommonModule, ReactiveFormsModule, FormsModule, PaymentItemComponent, TranslateModule],
  templateUrl: './form-create.component.html',
  styleUrl: './form-create.component.css'
})
export class FormCreateComponent {

  categoriesList :  Array<any> = [];
  entServiceSub : Subscription  | undefined;
  getPaySub :  Subscription  | undefined;
  confirmPaySub :  Subscription  | undefined;
  images_annouces_list : Array<any> = [];
  images_list : Array<any> = [];
  errorMessages : any = null;
  countries : any;
  selectedCountry:any = "CM";
  selectedCity:any;
  cities : any;
  valiData : boolean = false ;
  country_sel : any = {};
  showStripeForm : boolean = false;
  showOmForm : boolean = false;
  showMomoForm: boolean = false;
  showPayForm : boolean = false ;

  cardDetails = {
    number: '',
    exp_month: '',
    exp_year: '',
    cvc: ''
  };

  paymentList : any ;
  

  first_name : string = ""
    names : string[] = []
    anounces_form_datas : FormGroup
    title : FormControl
    description : FormControl
    price : FormControl
    contact : FormControl
    country : FormControl
    neighborhood : FormControl
    is_published : FormControl
    status : FormControl
    is_forward : FormControl
    categorie : FormControl
    location : FormControl

    announce : any = {
      title: '',
      description: '',
      price: 0,
      contact: '',
      country: '',
      neighborhood:  null ,
      is_published: false,
      status: '',
      categorie: [],
      is_forward: false,
      imageList: [''],
      location : '',
    };
  currentAnnounce: any = {};

  constructor(private form_b : FormBuilder, private entityService : EntityServiceService, private paymentService : PaymentsServiceService,
              private notification : NoficationsService, private router: Router, private locaStorage  : LocalStorageService,
            )
  {
    this.selectedCountry = "CM";
    this.title = this.form_b.control('', [Validators.required, Validators.maxLength(256)])
    this.description = this.form_b.control('', [Validators.required, Validators.maxLength(256)])
    this.price = this.form_b.control('', [ Validators.required])
    this.contact = this.form_b.control('', [] );
    this.neighborhood = this.form_b.control('', [] );
    this.country = this.form_b.control('',  [ Validators.required, Validators.maxLength(256)]);
    this.is_published = this.form_b.control('', [] );
    this.status = this.form_b.control('',  );
    this.is_forward = this.form_b.control('', [] );
    this.categorie = this.form_b.control('', [] );
    this.location = this.form_b.control('', [] );
    
    this.anounces_form_datas = this.form_b.group({
      title : this.title,
      description : this.description,
      price : this.price,
      contact : this.contact,
      country : this.country,
      neighborhood : this.neighborhood,
      is_published : this.is_published,
      status : this.status,
      categorie : this.categorie,
      location : this.location,
    })
  }

  ngOnInit(){
    window.scroll(0,0);   
    this.getAllCategories() ;
    this.countries = Country.getAllCountries();
    this.getPaymentMethod();
    this.onCountryChange({ target: { value: this.selectedCountry } });
  } 


  /////////////////////////////////// PREMIERE METHODE /////////////////////////////////////

//   handleSubmit(event: any = null) {  
    
//     if (!this.anounces_form_datas.valid || this.images_annouces_list.length < 1) {  
//       if (this.images_annouces_list.length < 1) {  
//         this.errorMessages = 'Veuillez ajouter au moins une image.';  
//       }  

//       // // Collecter les messages d'erreur pour chaque contrôle  
//       // Object.keys(this.anounces_form_datas.controls).forEach(key => {  
//       //   const control = this.anounces_form_datas.controls[key];  
//       //   if (control.invalid && (control.dirty || control.touched)) {  
//       //     if (control.errors) {  
//       //       if (control.errors.required) {  
//       //         this.errorMessages.push(`Le champ ${key} est requis.`);  
//       //       }  
//       //       // Vous pouvez ajouter d'autres vérifications d'erreurs ici  
//       //     }  
//       //   }  
//       // });  
//     } else {  
      
//         const entity = "annonce_back/store";  
//         let formData: FormData = new FormData();  

//         // Collecte des données du formulaire  
//         let datas = this.anounces_form_datas.value;  
        
//         // Ajout des données du formulaire dans FormData  
//         Object.keys(datas).forEach((key) => {  
//           if (Array.isArray(datas[key])) {  
//             // Si la valeur est un tableau, itérer à travers chaque élément  
//             datas[key].forEach((item) => {  
//               formData.append(key + '[]', item); // Append le tableau avec une notation '[]' pour indiquer que c'est un tableau  
//             });  
//           } else if (typeof datas[key] === 'object' && datas[key] !== null) {  
//             // Si c'est un objet (mais pas null), vous pouvez également itérer à travers ses propriétés  
//             formData.append(key, JSON.stringify(datas[key])); // Convertir l'objet en JSON  
//           } else {  
//             // Pour d'autres types de valeurs (string, number, etc.)  
//             formData.append(key, datas[key]);  
//           }  
//         });

//         // Mise à jour de is_published selon l'événement  
//         // console.log({country : this.selectedCountry} );
        
//         formData.append('is_published', event ? '1' : '0');  
//         formData.append('country', this.selectedCountry ? this.selectedCountry : 'CM');  
//         formData.append('status', event ? '3' : '1');  
//         formData.append('abonnement_id', event ? event : 1);  
//         let user = this.locaStorage.getItem('user');
//         formData.append('user_id', user ? user.id : 1);  
        
//         // Ajout des images  
//         this.images_annouces_list.forEach((file) => {  
//             formData.append('images[]', file);  // Utiliser append au lieu de set  
//         });
        
//         // Stockage de l'entité  
//         this.entityService.store(entity, formData).subscribe({  
//             next: (data: any) => {  
              
//               const notif = new Notification();
//                 if (data.success) {
//                   notif.message = "Annonce crée avec success !"
//                   notif.status = "success"
//                   this.router.navigate(['/admin']);   
//                 }else{
//                   notif.message = "erreur lors de l'enregistrement contacter l'administrateur !"
//                   notif.status = "warning"
//                 }
              
//                 this.notification.emitNotification(notif)
//                 // Vous pouvez envisager de réinitialiser le formulaire ou d'afficher un message de succès ici  
//             },  
//             error: (error: any) => {  
//                 console.log("Creation d'annonce",error);  
//                 const notif_error = new Notification();
//                 notif_error.message = "erreur lors de l'enregistrement contacter l'administrateur !";
//                 notif_error.status = "warning";
//             }  
//         });  
//     }  
// }

/////////////////////////////////// DEUXIEME METHODE /////////////////////////////////////

  // async handleSubmit(event: any = null) {
  //   if (!this.isFormValid()) {
  //     return;
  //   }

  //   const formData = this.createFormData(event);

  //   try {
  //     const response = await this.entityService.store("annonce_back/store", formData).toPromise();
  //     this.handleResponse(response);
  //   } catch (error) {
  //     this.handleError(error);
  //   }
  // }

  // private isFormValid(): boolean {
  //   if (!this.anounces_form_datas.valid || this.images_annouces_list.length < 1) {
  //     if (this.images_annouces_list.length < 1) {
  //       this.errorMessages = 'Veuillez ajouter au moins une image.';
  //     }
  //     return false;
  //   }
  //   return true;
  // }

  // private createFormData(event: any): FormData {
  //   const formData = new FormData();
  //   const datas = this.anounces_form_datas.value;

  //   Object.keys(datas).forEach((key) => {
  //     const value = datas[key];
  //     if (Array.isArray(value)) {
  //       value.forEach(item => formData.append(`${key}[]`, item));
  //     } else if (typeof value === 'object' && value !== null) {
  //       formData.append(key, JSON.stringify(value));
  //     } else {
  //       formData.append(key, value);
  //     }
  //   });

  //   formData.append('is_published', event ? '1' : '0');
  //   formData.append('country', this.selectedCountry || 'CM');
  //   formData.append('status', event ? '3' : '1');
  //   formData.append('abonnement_id', event || 1);

  //   const user = this.locaStorage.getItem('user');
  //   formData.append('user_id', user ? user.id : 1);

  //   this.images_annouces_list.forEach(file => formData.append('images[]', file));

  //   return formData;
  // }

  // private handleResponse(data: any) {
  //   const notif = new Notification();
  //   if (data.success) {
  //     notif.message = "Annonce créée avec succès !";
  //     notif.status = "success";
  //     this.router.navigate(['/admin']);
  //   } else {
  //     notif.message = "Erreur lors de l'enregistrement, contacter l'administrateur !";
  //     notif.status = "warning";
  //   }
  //   this.notification.emitNotification(notif);
  // }

  // private handleError(error: any) {
  //   console.log("Création d'annonce", error);
  //   const notif_error = new Notification();
  //   notif_error.message = "Erreur lors de l'enregistrement, contacter l'administrateur !";
  //   notif_error.status = "warning";
  //   this.notification.emitNotification(notif_error);
  // }

  /////////////////////////////////// TROISIEME METHODE /////////////////////////////////////

  async handleSubmit(event: any = null) {
    // Vérification rapide de la validité du formulaire
    if (!this.anounces_form_datas.valid || this.images_annouces_list.length < 1) {
      this.errorMessages = this.images_annouces_list.length < 1
        ? 'Veuillez ajouter au moins une image.'
        : 'Le formulaire contient des erreurs.';
      return;
    }

    if (event) {      
      if (event.name != 'Free') {
        return this.handlePayment(event); 
      }
    }

    try {
      // Création de FormData de manière optimisée
      const formData = this.createFormData(event);
  
      // Envoi des données
      const response = await this.entityService.store("annonce_back/store", formData).toPromise();
  
      // Gestion de la réponse
      this.handleResponse(response);
    } catch (error) {
      // Gestion des erreurs
      this.handleError(error);
    }
  }
  
  private createFormData(event: any): FormData {
    const formData = new FormData();
    const datas = this.anounces_form_datas.value;
  
    // Ajout des données du formulaire
    for (const key in datas) {
      if (datas.hasOwnProperty(key)) {
        const value = datas[key];
        if (Array.isArray(value)) {
          value.forEach(item => formData.append(`${key}[]`, item));
        } else if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    }
  
    // Ajout des champs supplémentaires
    formData.append('is_published', event ? '1' : '0');
    formData.append('country', this.selectedCountry || 'CM');
    formData.append('status', event ? '3' : '1');
    formData.append('abonnement_id', event ? event.id : 1 );
  
    // Ajout de l'ID utilisateur
    const user = this.locaStorage.getItem('user');
    formData.append('user_id', user?.id || 1);
  
    // Ajout des images
    for (const file of this.images_annouces_list) {
      formData.append('images[]', file);
    }
  
    return formData;
  }
  
  private handleResponse(data: any, message : any = null) {    
    const notif = new Notification();
    if (message) {
      notif.message = message;
    }else{
      notif.message = data.success
        ? "Annonce créée avec succès !"
        : "Erreur lors de l'enregistrement, contacter l'administrateur !";
    }
      notif.status = data.success ? "success" : "warning";
  
    this.notification.emitNotification(notif);
  
    if (data.success) {
      this.router.navigate(['/admin']);
    }
  }
  
  private handleError(error: any) {
    // console.error("Création d'annonce", error);
    const notif = new Notification();
    notif.message = "Erreur lors de l'enregistrement, contacter l'administrateur !";
    notif.status = "warning";
    this.notification.emitNotification(notif);
  }


  getImagesList(event : any){
    this.images_annouces_list = event;
  }

  get formControls(){
    return this.anounces_form_datas.controls
  }

  getAllCategories(){
    this.entServiceSub = this.entityService.getAllAnnoucesCategories().subscribe({
      next: (data: any) => {
        if (data.success) {
          const result = data.data
          this.categoriesList = result  ;
        }
      },

      error: (erreur: any) => { 
        // console.log({error_when_get_gategory : erreur});
       }
    })
  }

  onCountryChange(event : any){
    try{
      var countryCode = event.target.value;
      this.cities = City.getCitiesOfCountry(countryCode);
      this.country_sel= Country.getCountryByCode(countryCode);
      this.selectedCountry  = countryCode;

    } catch (error) {
      console.error('Erreur lors de la récupération des villes:', error);
    }
  }

  async storeAndPayAnnouce(payment : any){
    try {
      
      this.showPayForm = false;
      if (payment.type === 'stripe') {
        // console.log({hello : this.currentAnnounce});
        
        // recuperation des données de l'annonce:

        // Création de FormData de manière optimisée
        if (this.currentAnnounce.announce) {
          let annDatas = this.createFormData(this.currentAnnounce?.announce);    
          annDatas.append('status', '1') ;

          let payment_datas: any = {}; // Utilisation correcte d'un objet

          // Ajout des données
          payment_datas['amount'] = this.currentAnnounce?.announce.price;
          // payment_datas['quantity_selected'] = this.currentAnnounce?.announce.selectedQuantity;
          payment_datas['payment_method'] = payment.id;
          payment_datas['mode_paiement'] = 'Stripe';
          
          // Ajout des données à formData
          annDatas.append('status', '1');
            
          annDatas.append('payment_datas', JSON.stringify(payment_datas)); // Convertir en JSON
          
          // Envoi des données
          const response = await this.entityService.store("annonce_back/store", annDatas).toPromise();
          
          // Gestion de la réponse
          this.handleResponse(response);

          // this.confirmPaySub = this.paymentService.paymentConfirm(JSON.stringify(confirmDatas)).subscribe({
          //   next :(result : any) => {
          //     console.log({sucess : result});
          //   },
          //   error :(error : any) => {
          //     console.log({error : error});
              
          //   },
          //   complete :() => {

          //   }
          // })
          
        }
  
      }else if (payment.type === 'mobile_money') {
        let payment_datas: any = {}; // Utilisation correcte d'un objet
        const annData = this.createFormData(this.currentAnnounce?.announce);    
        annData.append('status', '1') ;

          // Ajout des données
          payment_datas['amount'] = this.currentAnnounce?.announce.price;
          payment_datas['payment_method'] = payment.type;
          payment_datas['mode_paiement'] = 'Mobile money';
          //  payment_datas['quantity_selected'] = this.currentAnnounce?.announce.selectedQuantity;
          payment_datas['payer'] = '237'+payment.datas.numero;
          // payment_datas['mode_paiement'] = payment.datas?.operateur;
          
          // Ajout des données à formData
          annData.append('status', '1');
          annData.append('validity_period', this.currentAnnounce?.announce.selectedQuantity);
          annData.append('payment_datas', JSON.stringify(payment_datas)); // Convertir en JSON
          
          // Envoi des données
          const response : any = await this.entityService.store("annonce_back/store", annData).toPromise();
          
          if (response.success) {
            const messg = 'Votre annonce a été enregistrée et est en attente de validation. Veuillez la confirmer pour qu\'elle soit publiée sur la plateforme';
            this.handleResponse(response,messg);
          }else{
            const messg = 'Une erreur est survenue lors de l\enregistrement de votre annonce veuillez contacter l\'administrateur.';
            this.handleResponse(response,messg);
          }
          // Gestion de la réponse

      }
      
    } catch (error) {
        console.log("Erreur de la sauvegarde et du paiement methode storeAndPayAnnonce",error);
        this.handleError(error);
    }
  }

  getPaymentMethod(){
    this.getPaySub = this.entityService.getPaymentMethd().subscribe({
      next: (res_data: any) => {
        // console.log({cedric:res_data});
        if (res_data.success) {
          this.paymentList = res_data.data
        }
      },

      error: (error: any) => { },
      complete: () => { },
    })
  }

  handlePayment(data:any){
    try {
      if (data) {
        this.showPayForm = true;
        this.currentAnnounce['announce'] = data ;
      }
    } catch (error) {
      console.log("Erreur methode handlePayment",error);
  
    }

  }


  closePopUp(){
    this.showPayForm = false;
  }
}
