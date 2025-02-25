import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-payment-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-item.component.html',
  styleUrl: './payment-item.component.css'
})
export class PaymentItemComponent {

  showStripeForm : boolean = false;
  showOmForm : boolean = false;
  showMomoForm: boolean = false;

  @Input() itemPay :any ;

  
  showForm(type : string){
    console.log(type.toLocaleLowerCase());
    
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


}
