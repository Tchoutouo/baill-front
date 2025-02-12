import { Injectable } from '@angular/core';
import { StripeService } from 'ngx-stripe';

@Injectable({
  providedIn: 'root'
})
export class PaymentsServiceService {

  constructor(private stripe: StripeService) {}

  createPaymentToken(cardDetails: any) {
    return this.stripe.createToken(cardDetails);
  }
  
}
