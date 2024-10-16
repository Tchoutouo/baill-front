import { Component, SimpleChanges } from '@angular/core';
import { ForfaitListComponent } from "../forfait-list/forfait-list.component";
import { ImageViewComponent } from "../image-view/image-view.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import {Notification} from '../../../models/notification'
import { NoficationsService } from '../../../services/nofications.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-form-create',
  standalone: true,
  imports: [ForfaitListComponent, ImageViewComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './form-create.component.html',
  styleUrl: './form-create.component.css'
})
export class FormCreateComponent {

  categoriesList : Array<any>  = [] ;
  images_annouces_list : Array<any> = [];
  images_list : Array<any> = [];
  errorMessages : any = null;
  valiData : boolean = false ;
  

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
    };

  constructor(private form_b : FormBuilder, private entityService : EntityServiceService,
              private notification : NoficationsService, private router: Router
          )
  {

    this.title = this.form_b.control('', [Validators.required, Validators.maxLength(256)])
    this.description = this.form_b.control('', [Validators.required])
    this.price = this.form_b.control('', [ Validators.required])
    this.contact = this.form_b.control('', [] );
    this.neighborhood = this.form_b.control('', [] );
    this.country = this.form_b.control('',  [ Validators.required, Validators.maxLength(256)]);
    this.is_published = this.form_b.control('', [] );
    this.status = this.form_b.control('',  );
    this.is_forward = this.form_b.control('', [] );
    this.categorie = this.form_b.control('', [] );
    
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
    })
  }

  ngOnInit(){
    window.scroll(0,0);    
  }



  handleSubmit(event: any = null) {  
    
    if (!this.anounces_form_datas.valid || this.images_annouces_list.length < 1) {  
      if (this.images_annouces_list.length < 1) {  
        this.errorMessages = 'Veuillez ajouter au moins une image.';  
      }  

      // // Collecter les messages d'erreur pour chaque contrôle  
      // Object.keys(this.anounces_form_datas.controls).forEach(key => {  
      //   const control = this.anounces_form_datas.controls[key];  
      //   if (control.invalid && (control.dirty || control.touched)) {  
      //     if (control.errors) {  
      //       if (control.errors.required) {  
      //         this.errorMessages.push(`Le champ ${key} est requis.`);  
      //       }  
      //       // Vous pouvez ajouter d'autres vérifications d'erreurs ici  
      //     }  
      //   }  
      // });  
    } else {  
      
        const entity = "annonce_back/store";  
        let formData: FormData = new FormData();  

        // Collecte des données du formulaire  
        let datas = this.anounces_form_datas.value;  
        
        // Ajout des données du formulaire dans FormData  
        Object.keys(datas).forEach((key) => {  
          if (Array.isArray(datas[key])) {  
            // Si la valeur est un tableau, itérer à travers chaque élément  
            datas[key].forEach((item) => {  
              formData.append(key + '[]', item); // Append le tableau avec une notation '[]' pour indiquer que c'est un tableau  
            });  
          } else if (typeof datas[key] === 'object' && datas[key] !== null) {  
            // Si c'est un objet (mais pas null), vous pouvez également itérer à travers ses propriétés  
            formData.append(key, JSON.stringify(datas[key])); // Convertir l'objet en JSON  
          } else {  
            // Pour d'autres types de valeurs (string, number, etc.)  
            formData.append(key, datas[key]);  
          }  
        });

        // Mise à jour de is_published selon l'événement  
        formData.append('is_published', event ? '1' : '0');  
        formData.append('abonnement_id', '1');  
        formData.append('user_id', '4');  

        // Ajout des images  
        this.images_annouces_list.forEach((file) => {  
              formData.append('images[]', file);  // Utiliser append au lieu de set  
          });

        // Stockage de l'entité  
        this.entityService.store(entity, formData).subscribe({  
            next: (data: any) => {  
              console.log(data);
              
              const notif = new Notification();
                if (data.success) {
                  notif.message = "Annonce crée avec success !"
                  notif.status = "success"
                  this.router.navigate(['/admin']);   
                }else{
                  notif.message = "erreur lors de l'enregistrement contacter l'administrateur !"
                  notif.status = "success"
                }
              
                this.notification.emitNotification(notif)
                // Vous pouvez envisager de réinitialiser le formulaire ou d'afficher un message de succès ici  
            },  
            error: (error: any) => {  
                console.log(error);  
            }  
        });  
    }  
}

  getImagesList(event : any){

    this.images_annouces_list = event;

    
  }

  get formControls(){
    return this.anounces_form_datas.controls
  }

}
