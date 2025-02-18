import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntityServiceService } from '../../../../services/admin/entity-service.service';
import { Subscription } from 'rxjs';
import { Notification } from '../../../../models/notification';
import { NoficationsService } from '../../../../services/nofications.service';


@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css'
})
export class ConfigurationComponent {

  activeUpdate = false;
  datas : any;
  paySub : Subscription | undefined
  payModSub : Subscription | undefined
  reciecedValue : any
  paymentForm: FormGroup;

  constructor(private fb: FormBuilder, private entityService : EntityServiceService , private notification : NoficationsService){
    this.paymentForm = this.fb.group({
      om: [this.reciecedValue?.om ? this.reciecedValue.om : false], // Valeur par défaut du checkbox
      momo: [this.reciecedValue?.momo ? this.reciecedValue.momo : false], // Valeur par défaut du checkbox
      stripe: [this.reciecedValue?.stripe ?  this.reciecedValue.stripe : false], // Valeur par défaut du checkbox
    });
  }

  ngOnInit(){
    this.activeUpdate = false;

    this.getPaymentModes();
    
  }

  acitveChange(){
    this.activeUpdate = true;
  }

  getPaymentModes(){
    this.payModSub = this.entityService.getPaymentMod().subscribe({
      next: (result: any) => {
        console.log(result);
        if (result.success) {
          this.datas = result.data;
          this.reciecedValue = {
            om : this.datas[1].is_active === 1 ? true : false,
            momo : this.datas[1].is_active === 1 ? true : false,
            stripe : this.datas[0].is_active === 1 ? true : false,
          }
        }
       },

      error: (error: any) => {
        console.log('error when get Payment mode ', error);
       },

      complete : () => { 

      }
    })
  }

  setPayment(){
   let valueD = this.paymentForm.value;

    let formValues= new FormData()

    formValues.append('momo', valueD.momo);
    formValues.append('om', valueD.momo);
    formValues.append('stripe', valueD.momo);
    
    this.paySub = this.entityService.updatePamentMethods(formValues).subscribe({
      next: (result_request: any) => { 
        let message = ''
        let type = ''
        const notif = new Notification();
        if(result_request.success){
            notif.message =' message';
            notif.status = 'success';
            this.notification.emitNotification(notif);
          this.getPaymentModes();
        }else{
          message = 'erreur survenu lors de lors de l\'enregistement des modifications';
          type = 'warning';
        }
        this.notification.emitNotification(notif);
      },
      error: (error: any) => { 
        let message = ''
        let type = ''
        message = 'erreur survenu lors de lors de l\'enregistement des modifications';
        type = 'warning';
        const notif = new Notification();
        this.notification.emitNotification(notif);
        console.log('erreur lors de la mise à jour des methodes de paiement');
      },
      complete(){
        console.log('complete update');
      }
    })
  }

}
