import { Component, EventEmitter, Output, output } from '@angular/core';
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import {Notification} from '../../../models/notification';
import { NoficationsService } from '../../../services/nofications.service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-form-category',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './form-category.component.html',
  styleUrl: './form-category.component.css'
})
export class FormCategoryComponent {

  datas : any;
  title : FormControl
  description : FormControl
  catSub : Subscription | undefined
  categoryForm: FormGroup; 
  isEmptyTitle : boolean = false;
  @Output() isSubmited = new EventEmitter<boolean>();  
  @Output() requestCompleted = new EventEmitter<boolean>();  

  constructor(private entitServ : EntityServiceService, formBuild : FormBuilder, private notification : NoficationsService){
    this.title = formBuild.control('', [Validators.required, Validators.maxLength(128)]);
    this.description = formBuild.control('', [Validators.required, Validators.maxLength(300)]);

    this.categoryForm = formBuild.group({
      title : this.title,
      description : this.description,
    });
  }

  ngOnInit(){

  }

  submitData(){
    let datas = this.categoryForm.value;
    if (this.categoryForm.valid) {
      let formData: FormData = new FormData();  
      Object.keys(datas).forEach((key) => { 
        formData.append(key, datas[key]);
      })
      const entity = "categorie_back/store"; 
        this.isSubmited.emit(true);
        const notif = new Notification();
        this.categoryForm.reset();
        this.catSub = this.entitServ.store(entity, formData).subscribe({

          next: (data_result: any) => { 
            if (data_result.success) {
                notif.message = "Catégorie crée avec success !"
                notif.status = "success"
                this.notification.emitNotification(notif)
            } else {
              notif.message = "erreur lors de l'enregistrement contacter l'administrateur !"
              notif.status = "warning"
              this.notification.emitNotification(notif)
            }

            this.requestCompleted.emit(true)
            
          },
          error: (error: any) => { 
            const notif_error = new Notification();
            notif_error.message = "erreur lors de l'enregistrement contacter l'administrateur !";
            notif_error.status = "warning";
            this.notification.emitNotification(notif)

            // console.log('error when trying store category', error);
          },
          complete: () => { 
            
          }
        })
    }
    // this.catSub{}
    
  }

}
