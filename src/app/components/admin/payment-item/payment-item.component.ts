import { Component, EventEmitter, Input, AfterViewChecked, ChangeDetectorRef, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StripeServiceService } from '../../../services/stripe-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-item',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payment-item.component.html',
  styleUrls: ['./payment-item.component.css']
})
export class PaymentItemComponent implements AfterViewChecked {
  showStripeForm: boolean = false;
  showOmForm: boolean = false;
  showMomoForm: boolean = false;

  errorMessage: any;

  @Input() itemPay: any;
  @Output() payDatas = new EventEmitter<any>();

  constructor(
    private form_build: FormBuilder,
    private stripeService: StripeServiceService,
    private cdr: ChangeDetectorRef // Injectez ChangeDetectorRef
  ) {}

  async ngAfterViewChecked() {
    // Vérifiez si le conteneur est dans le DOM et que Stripe Elements n'a pas encore été monté
    if (this.showStripeForm && this.itemPay.title === 'Stripe' && !this.stripeService.isCardElementMounted()) {
      await this.stripeService.createCardElements();
      this.cdr.detectChanges(); // Force la détection des changements
    }
  }

  async handlePayment(type : string | null = null) {
    if (type) {
      this.showForm(type)
    }
    const stripe = await this.stripeService.getStripe();
    const cardNumberElement = this.stripeService.getCardNumberElement();
    const cardExpiryElement = this.stripeService.getCardExpiryElement();
    const cardCvcElement = this.stripeService.getCardCvcElement();
  
    if (!stripe || !cardNumberElement || !cardExpiryElement || !cardCvcElement) {
      this.errorMessage = 'Stripe ou les éléments de carte ne sont pas initialisés.';
      return;
    }
  
    // Créez une intention de paiement côté serveur (exemple avec Laravel)
    const clientSecret = await this.stripeService.createPaymentIntent(1000, 'eur'); // 10,00 €
  
    if (!clientSecret) {
      this.errorMessage = 'Erreur lors de la création de l\'intention de paiement.';
      return;
    }
  
    // Confirmez le paiement côté client
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberElement,
        billing_details: {
          name: (document.getElementById('cardholder-name') as HTMLInputElement).value,
        },
      },
    });
  
    if (error) {
      this.errorMessage = error.message;
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      console.log('Paiement réussi!', paymentIntent);
      // Vous pouvez envoyer les données de confirmation à votre API Laravel ici
    }
  }
  

  showForm(type: string) {
    this.showStripeForm = type.toLowerCase() === 'stripe' && !this.showStripeForm;
    this.showOmForm = type.toLowerCase() === 'orange money' && !this.showOmForm;
    this.showMomoForm = type.toLowerCase() === 'mobile money' && !this.showMomoForm;
  }
}