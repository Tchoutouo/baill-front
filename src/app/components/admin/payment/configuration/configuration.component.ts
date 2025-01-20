import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntityServiceService } from '../../../../services/admin/entity-service.service';
import { Subscription } from 'rxjs';

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
  paymentForm: FormGroup;

  constructor(private fb: FormBuilder, private entityService : EntityServiceService ){
    this.paymentForm = this.fb.group({
      om: [this.datas.om], // Valeur par défaut du checkbox
      momo: [this.datas.momo], // Valeur par défaut du checkbox
      stripe: [this.datas.momo], // Valeur par défaut du checkbox
    });
  }

  ngOnInit(){
    this.activeUpdate = false;
    this.datas = {
      om: false,
      momo: false,
      tripe: false,
    }
  }

  acitveChange(){
    this.activeUpdate = true;
  }

  setPayment(){
    this.datas = this.paymentForm.value;
    for (const key in this.datas) {
      if (this.datas[key]) {
        this.datas[key] = 1
      }else{
        this.datas[key] = 0
      }
    }

    
    // this.paySub = this.entityService.updatePamentMethods(this.datas).subscribe({
    //   next: (result: any) => { 
    //     console.log(result);
         
    //   },
    //   error: (error: any) => { 
    //     console.log('erreur lors de la mise à jour des methodes de paiement');
    //   },
    //   complete(){
    //     console.log('complete update');
        
    //   }
    // })
  }

}
