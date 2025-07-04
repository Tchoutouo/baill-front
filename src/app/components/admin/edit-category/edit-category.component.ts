import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {Notification} from '../../../models/notification';
import { Subscription } from 'rxjs';
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import { NoficationsService } from '../../../services/nofications.service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent {

  editCategoryForm : FormGroup
  title : any = ''
  description : any = '';
  edtiSub : Subscription | undefined;
  @Input() category : any = { };
  @Output() updated = new EventEmitter<boolean>();
  @Output() updatedSend = new EventEmitter<boolean>();

  constructor(private formBuil : FormBuilder, private entitServ : EntityServiceService, private notification : NoficationsService){
    this.editCategoryForm = formBuil.group({
      title : ['', ],
      description : ['', ]
    })

    this.title = this.category.title ? this.category.title : ' ';
    this.description = this.category.description ? this.category.description : ' ';

  }

  ngOnInit() {  
    // Initialiser le formulaire avec la catégorie si elle est disponible  
    if (this.category) {  
      this.editCategoryForm.patchValue({  
        title: this.category.title || '',  
        description: this.category.description || '',  
      });  
    }  
  }  

  ngOnChanges(changes: SimpleChanges) {  
    // Vérifier si la catégorie a changé  
    if (changes['category'] && changes['category'].currentValue) {  
      this.editCategoryForm.patchValue({  
        title: changes['category'].currentValue.title || '',  
        description: changes['category'].currentValue.description || '',  
      });  
    }  
  }  

  submitData(){
    console.log(this.editCategoryForm.valid);
    
    if (this.editCategoryForm.valid) {
      let form_datas : FormData = new FormData(); 
      let datas_edit = this.editCategoryForm.value
      
      const entity = "categorie_back/update"; 
      this.updated.emit(true);
      const notif = new Notification();
      

      Object.keys(datas_edit).forEach((key) => { 
        form_datas.append(key, datas_edit.key);
      })
      // this.editCategoryForm.reset();
      this.edtiSub = this.entitServ.updateCat(this.category.id, datas_edit, entity).subscribe({
        next: (result: any) => { 
          console.log({edited : result});
          
          if (result.success) {
             notif.message = "Catégorie mise à jour avec success !"
              notif.status = "success"
              this.notification.emitNotification(notif)

          }else{
            notif.message = "erreur lors de modification contacter l'administrateur !"
            notif.status = "warning"
            this.notification.emitNotification(notif)
          }

          this.updatedSend.emit(true)

        },
        error: (error: any) => { 
          if (error) {
            console.log('error when update category', error);
            
            notif.message = "erreur lors de modification contacter l'administrateur !"
            notif.status = "warning"
            this.notification.emitNotification(notif)
          }
        },
        complete() {
          console.log('complete !');
        },
      })
    }
  }

}
