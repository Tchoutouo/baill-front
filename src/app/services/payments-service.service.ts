import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { StripeService } from 'ngx-stripe';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentsServiceService {

  private stripePromise: Promise<Stripe | null>;
  private elements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;

  constructor(private http : HttpClient) {
    this.stripePromise = loadStripe('pk_test_51QydBnP1JVeVCDSKAwmszQbjui4iRexbdPLeWmfYwoXpQayltVXrUXwKUPaxyr9pZQq5Yd6GOYibpoZ54L36g0Id00KKkJF9wH');
  }
  
  async getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }

  async createCardElement(): Promise<StripeCardElement | null> {
    const stripe = await this.getStripe();
    if (!stripe) {
      console.error('Stripe n\'a pas pu être chargé.');
      return null;
    }

    const elements = stripe.elements();
    const cardElement = elements.create('card');
    cardElement.mount('#card-element'); // Montez le formulaire de carte dans un conteneur HTML
    this.cardElement = cardElement;
    return cardElement;
  }

  // async confirmPayment(clientSecret: string): Promise<{ error?: any; paymentIntent?: any }> {
  //   const stripe = await this.getStripe();
  //   if (!stripe || !this.cardElement) {
  //     console.error('Stripe ou l\'élément de carte n\'est pas initialisé.');
  //     return { error: 'Stripe non initialisé' };
  //   }

  //   const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
  //     payment_method: {
  //       card: this.cardElement,
  //     },
  //   });

  //   return { error, paymentIntent };
  // }

  paymentConfirm(datas : any){
    // console.log({pay_steph: datas});
    
    return this.http.post(environment.apiUrl+'stripe-payment', datas); 
  }
  
}
