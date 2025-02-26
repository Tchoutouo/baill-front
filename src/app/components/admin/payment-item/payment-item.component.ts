import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment-item',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payment-item.component.html',
  styleUrl: './payment-item.component.css'
})
export class PaymentItemComponent {

  showStripeForm : boolean = false;
  showOmForm : boolean = false;
  showMomoForm: boolean = false;

  number : FormControl
  exp_month : FormControl
  exp_year : FormControl
  cvc : FormControl

  paymentForm : FormGroup
  

  @Input() itemPay :any ;

  @Output() payDatas = new  EventEmitter<any>()

  constructor(private form_build : FormBuilder){
      this.cvc = this.form_build.control('', [Validators.required, Validators.maxLength(3), Validators.minLength(3)])
      this.number = this.form_build.control('', [Validators.required, Validators.maxLength(16), Validators.minLength(16)])
      this.exp_month = this.form_build.control('', [Validators.required, Validators.maxLength(2), Validators.minLength(2)])
      this.exp_year = this.form_build.control('', [Validators.required, Validators.maxLength(4), Validators.minLength(4)])

      this.paymentForm = this.form_build.group({
          cvc : this.cvc,
          number : this.number,
          exp_month : this.exp_month,
          exp_year : this.exp_year
      })
  }

  ngOnInit(){

  }

  
  showForm(type : string){
    if (type.toLocaleLowerCase() === 'stripe') {
      this.showStripeForm = !this.showStripeForm ;
      if (this.showMomoForm) {
        this.showMomoForm = !this.showMomoForm ;
      }
      if (this.showOmForm) {
        this.showOmForm = !this.showOmForm ;
      }
    }
    if (type.toLocaleLowerCase() === 'mobile money') {
      this.showMomoForm = !this.showMomoForm ;
      if (this.showStripeForm) {
        this.showStripeForm = !this.showStripeForm ;
      }
      if (this.showOmForm) {
        this.showOmForm = !this.showOmForm ;
      }
    }
    if (type.toLocaleLowerCase() === 'orange money') {
      this.showOmForm = !this.showOmForm ;
      if (this.showStripeForm) {
        this.showStripeForm = !this.showStripeForm ;
      }
      if (this.showMomoForm) {
        this.showMomoForm = !this.showMomoForm ;
      }
    }
  }

  handleSubmit(){
    if (this.paymentForm.valid) {
      let formValue = this.paymentForm.value();
      
       // convertir formValue en un tableau clé-valeur
      let keyValueArray = Object.entries(formValue);

        // encoder le tableau (par exemple, en JSON)
      let encodedFormValues = JSON.stringify(keyValueArray);

      console.log(encodedFormValues);

      this.payDatas.emit(encodedFormValues)
    }
  }

}
