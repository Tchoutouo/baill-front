import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeElements, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root',
})
export class StripeServiceService {
  private stripePromise: Promise<Stripe | null>;
  private elements: StripeElements | null = null;
  private cardNumberElement: StripeCardNumberElement | null = null;
  private cardExpiryElement: StripeCardExpiryElement | null = null;
  private cardCvcElement: StripeCardCvcElement | null = null;
  private apiUrl = 'https://votre-api-laravel.com'; // Remplacez par l'URL de votre API Laravel

  constructor(private http: HttpClient) {
    this.stripePromise = loadStripe('votre_clé_publique_stripe');
  }

  async getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }

  async createCardElements(): Promise<void> {
    const stripe = await this.getStripe();
    if (!stripe) {
      console.error('Stripe n\'a pas pu être chargé.');
      return;
    }

    this.elements = stripe.elements();

    // Créer des éléments individuels
    this.cardNumberElement = this.elements.create('cardNumber', {
      style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a',
        },
      },
      showIcon: true, // Assurez-vous que cette option est activée
    });
    this.cardNumberElement.mount('#card-number-element');

    this.cardExpiryElement = this.elements.create('cardExpiry', {
      style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
        },
      },
    });
    this.cardExpiryElement.mount('#card-expiry-element');

    this.cardCvcElement = this.elements.create('cardCvc', {
      style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
        },
      },
    });
    this.cardCvcElement.mount('#card-cvc-element');
  }

  getCardNumberElement(): StripeCardNumberElement | null {
    return this.cardNumberElement;
  }

  getCardExpiryElement(): StripeCardExpiryElement | null {
    return this.cardExpiryElement;
  }

  getCardCvcElement(): StripeCardCvcElement | null {
    return this.cardCvcElement;
  }

  destroyCardElement(): void {
    if (this.cardNumberElement) {
      this.cardNumberElement.unmount();
      this.cardNumberElement = null;
    }
    if (this.cardExpiryElement) {
      this.cardExpiryElement.unmount();
      this.cardExpiryElement = null;
    }
    if (this.cardCvcElement) {
      this.cardCvcElement.unmount();
      this.cardCvcElement = null;
    }
  }

  isCardElementMounted(): boolean {
    return !!this.cardNumberElement;
  }

  async createPaymentIntent(amount: number, currency: string): Promise<string | null> {
    try {
      const response = await this.http
        .post<{ clientSecret: string }>(`${this.apiUrl}/create-payment-intent`, {
          amount: amount,
          currency: currency,
        })
        .toPromise();

      return response?.clientSecret || null;
    } catch (error) {
      console.error('Erreur lors de la création de l\'intention de paiement:', error);
      return null;
    }
  }
}