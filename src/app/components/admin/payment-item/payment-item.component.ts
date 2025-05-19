import { Component, EventEmitter, Input, AfterViewChecked, ChangeDetectorRef, Output, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { loadStripe, Stripe, StripeElements, StripeCardElement, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js'; // Importez Stripe

@Component({
  selector: 'app-payment-item',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payment-item.component.html',
  styleUrls: ['./payment-item.component.css']
})
export class PaymentItemComponent  {
  showStripeForm: boolean = false;
  showOmForm: boolean = false;
  showMomoForm: boolean = false;
  createPayMeth : boolean = false
  phoneNumber : string = '';

  errorMessage: string | null | undefined = null;

  @Input() itemPay: any;
  @Output() payDatas = new EventEmitter<any>();

  // Variables pour Stripe
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;
  private cardNumberElement: StripeCardNumberElement | null = null;
  private cardExpiryElement: StripeCardExpiryElement | null = null;
  private cardCvcElement: StripeCardCvcElement | null = null;
  
  constructor(
    private form_build: FormBuilder,
    private cdr: ChangeDetectorRef // Injectez ChangeDetectorRef
  ) {}
  // ngAfterViewInit(): void {
  //   throw new Error('Method not implemented.');
  // }


  ngAfterViewChecked() {
    // Rechercher et afficher les éléments de la carte si nécessaires
    if (this.showStripeForm && !this.cardElement) {
      this.initializeStripe();
    }
  }

   

  async handlePayment(type: string | null = null) {
    if (type) {
      this.showForm(type);
    }else{
      this.createPayMeth = true
    }


    if (!this.stripe || !this.cardNumberElement) {
      this.errorMessage = 'Stripe ou l\'élément de carte n\'est pas initialisé.';
      return;
    }

    try {
      // Créez un PaymentMethod avec Stripe
      const { paymentMethod, error } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.cardNumberElement,
      });

      if (error) {
        this.errorMessage = error.message;
        this.createPayMeth = false;
      } else {
        paymentMethod['type'] = 'stripe';
        this.payDatas.emit(paymentMethod);
        this.createPayMeth = true;
        // console.log('Payment method created:', paymentMethod, paymentMethod.type);
      }
    } catch (error: any) {
      this.errorMessage = 'Erreur lors de la création du PaymentMethod: ' + error.message;
    }
  }

  showForm(type: string) {
    this.showStripeForm = type.toLowerCase() === 'stripe' && !this.showStripeForm;
    this.showOmForm = type.toLowerCase() === 'orange money' && !this.showOmForm;
    this.showMomoForm = type.toLowerCase() === 'mobile money' && !this.showMomoForm;
  }
  
  mobilePay(operateur: string, event: Event): void {
    event.preventDefault();
    // console.log({
    //   numero: this.phoneNumber,
    //   operateur});
    
    const regex = /^6\d{8}$/;
    if (!regex.test(this.phoneNumber)) {
      alert('Numéro invalide. Il doit commencer par 6 et avoir 9 chiffres.');
      return;
    }
    
    let paymentInfos: any = {};;

    paymentInfos['type'] = 'mobile_money';
    paymentInfos['datas'] = {
      numero: this.phoneNumber,
      operateur: operateur
    };
    this.payDatas.emit(paymentInfos);
    // this.hasSubmit.emit({
    //   numero: this.phoneNumber,
    //   operateur
    // });
  }

  // Simulez la création d'une intention de paiement côté serveur
  // async createPaymentIntent(amount: number, currency: string): Promise<string | null> {
  //   // Remplacez ceci par un appel HTTP à votre API Laravel
  //   // Exemple fictif :
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve('pi_123456789_secret_987654321'); // Simule un clientSecret
  //     }, 1000);
  //   });
  // }
  async initializeStripe() {
    if (this.stripe) {
      return; // Si Stripe est déjà initialisé, ne pas réinitialiser
    }
  
    try {
      // Chargez Stripe avec votre clé publique
      this.stripe = await loadStripe('pk_test_51QydBnP1JVeVCDSKAwmszQbjui4iRexbdPLeWmfYwoXpQayltVXrUXwKUPaxyr9pZQq5Yd6GOYibpoZ54L36g0Id00KKkJF9wH');
      
      if (!this.stripe) {
        throw new Error('Erreur lors du chargement de Stripe.');
      }
  
      // Créez les éléments Stripe
      this.elements = this.stripe.elements();
  
      // Créer des éléments individuels avec un style personnalisé
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
        showIcon: true, // Assurez-vous que cette option est activée pour afficher l'icône de la carte
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
      this.errorMessage = null;
      
    } catch (error: any) {
      this.errorMessage = 'Erreur lors de l\'initialisation de Stripe: ' + error.message;
    }
  }
  



}