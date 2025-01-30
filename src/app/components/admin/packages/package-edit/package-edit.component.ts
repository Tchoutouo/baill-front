import { CommonModule } from '@angular/common';
import { Component,EventEmitter,Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EntityServiceService } from '../../../../services/admin/entity-service.service';
import { NoficationsService } from '../../../../services/nofications.service';
import { Notification } from '../../../../models/notification';  



@Component({
  selector: 'app-package-edit',
  standalone: true,
  imports: [TranslateModule,CommonModule, RouterModule,ReactiveFormsModule],
  templateUrl: './package-edit.component.html',
  styleUrl: './package-edit.component.css'
})
export class PackageEditComponent implements OnInit {

  @Input() Abonnememt: any = [];
  abonnementForm: FormGroup;
  @Output()  isModalOpenChild = new EventEmitter<boolean>();

  closeModal : boolean = false;


  constructor(
        private fb: FormBuilder,  
        private entityService: EntityServiceService,  
        private router: Router,  
        private notification: NoficationsService,

  ) { 
    this.abonnementForm = this.fb.group({  
      name: ['', Validators.required],  
      price: ['', Validators.required],  
      time: ['', [Validators.maxLength(3), Validators.minLength(1)]],
      type_time: ['M'],
      reduction: [''],
      is_actived: [''],
      hight_lite: [''],
      type: [''],
    });
  }

  ngOnInit(): void {
    this.abonnementForm.patchValue({ // Remplissage initial du formulaire  
      name: this.Abonnememt.name ? this.Abonnememt.name : '',  
      price: this.Abonnememt.price ?  this.Abonnememt.price : '',  
      type_time: this.Abonnememt.type_time ? this.Abonnememt.type_time : '',  
      time: this.Abonnememt.time ? this.Abonnememt.time : '',
      reduction:this.Abonnememt.reduction ? this.Abonnememt.reduction : 0,
      is_actived:this.Abonnememt.is_actived ? this.Abonnememt.is_actived : 0,
      hight_lite:this.Abonnememt.hight_lite ? this.Abonnememt.hight_lite : 1,
      type:this.Abonnememt.type ? this.Abonnememt.type : 'Standard',
    }); 
  }

  ngOnChanges(changes: SimpleChanges) {
    
    if (changes && this.Abonnememt) {
      this.abonnementForm.patchValue(this.Abonnememt);
    }
  }


  UpdateAbonnement() {  
    if (this.abonnementForm.invalid) {  
      return;  
    } 
    
    if (this.abonnementForm.valid) {

      this.abonnementForm.value.price = this.abonnementForm.value.price - (this.abonnementForm.value.reduction * this.abonnementForm.value.price)/100;

      const notif = new Notification();  
      const entity = "abonnement_back/update";
      let abonnement_id = this.Abonnememt.id;
  
      this.entityService.updateAbonnement(abonnement_id,this.abonnementForm.value, entity).subscribe({
        next : (datas : any) =>{          
          if(datas.success === true){
            notif.message = "Informations mise à jour avec success"
            notif.status = "success"
            this.handleCloseModal();
          }else{
            notif.message = "erreur lors de l'enregistrement des modifications"
            notif.status = "warning"
            this.notification.emitNotification(notif)
          }
        },
        error: (error : any) => {
          notif.message = "Nous sommes désolé mais le serveur est momentanement indisponible"
          notif.status = "warning"
          this.notification.emitNotification(notif);
        },
      });
    }
  }

  handleCloseModal(){
    this.closeModal = false;
    this.isModalOpenChild.emit(this.closeModal);
  }

  
}
