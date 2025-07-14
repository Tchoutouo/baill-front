import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertComponent } from '../../admin/alert/alert.component';
import { NoficationsService } from '../../../services/nofications.service';
import { EntityServiceService } from '../../../services/admin/entity-service.service';

@Component({
  selector: 'app-send-mail-forgot-password',
  standalone: true,
  imports: [TranslateModule, RouterLink,FormsModule, CommonModule, ReactiveFormsModule, AlertComponent],
  templateUrl: './send-mail-forgot-password.component.html',
  styleUrl: './send-mail-forgot-password.component.css'
})
export class SendMailForgotPasswordComponent {
  message_alert : any  = null;
  display_message: boolean = false;
  isSubmitting: boolean = false;
  email: FormControl;
  forgotPasswordForm: FormGroup;
  isLoading = false;
  isCheckingEmail = false;
  message = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  emailExists: boolean | null = null;

  
  constructor(
    fb: FormBuilder,
    private entityService: EntityServiceService,
    private router: Router,
    private translate: TranslateService,
    private notification: NoficationsService
  ) {
    this.email = fb.control("", [Validators.email, Validators.required]);

    this.forgotPasswordForm = fb.group({
      email: this.email
    });
  }

  ngOnInit() {
  }


  async onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const email = this.email?.value;
    this.isLoading = true;
    this.message = '';
    this.emailExists = null;

    try {
      // Étape 1: Vérifier si l'email existe
      this.isCheckingEmail = true;
      this.message = this.entityService.getTranslatedText('user.reset-password.message. verification-email');
      this.messageType = 'info';

      const emailExists = await this.entityService.checkEmailExists(email).toPromise();
      this.isCheckingEmail = false;

      if (!emailExists) {
        this.message = this.entityService.getTranslatedText('user.reset-password.message.no-email') || 'Aucun compte associé à cet email.';
        this.messageType = 'error';
        this.emailExists = false;
        this.isLoading = false;
        return;
      }

      // Étape 2: Envoyer l'email de récupération
      this.emailExists = true;
      this.message = this.entityService.getTranslatedText('user.reset-password.message.mail-send-recove');
      this.messageType = 'info';

      const result: any  = await this.entityService.sendPasswordResetEmail(email).toPromise();

      if (result.success) {
        this.message = this.entityService.getTranslatedText('user.reset-password.message.success') || 'Email de récupération envoyé avec succès. Vérifiez votre boîte de réception.';
        this.messageType = 'success';
        this.forgotPasswordForm.reset();
        this.emailExists = null;
      } else {
        this.message = this.entityService.getTranslatedText('user.reset-password.message.mail-send-recove-erreur');
        this.messageType = 'error';
      }

    } catch (error: any) {
      
      // Gestion des erreurs Laravel
      if (error.status === 422 && error.error?.errors) {
        const errors = error.error.errors;
        if (errors.email) {
          this.message = errors.email[0];
        } else {
          this.message = this.entityService.getTranslatedText('user.reset-password.message.error-validation');
        }
      } else if (error.status === 404) {
        this.message = this.entityService.getTranslatedText('user.reset-password.message.no-email') || 'Aucun compte associé à cet email.';
      } else {
        this.message =  this.entityService.getTranslatedText('user.reset-password.message.error-title') || 'Une erreur est survenue. Veuillez réessayer.';
      }
      
      this.messageType = 'error';
    } finally {
      this.isLoading = false;
      this.isCheckingEmail = false;
    }
  }

  // Réinitialiser le feedback quand l'utilisateur tape
  onEmailInput() {
    this.emailExists = null;
    this.message = '';
  }

  private markFormGroupTouched() {
    Object.keys(this.forgotPasswordForm.controls).forEach(key => {
      const control = this.forgotPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  closeAlert(event: any) {
    this.display_message = false;
  }

}
