import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import { AlertComponent } from '../../admin/alert/alert.component';
import { NoficationsService } from '../../../services/nofications.service';
import { Notification } from '../../../models/notification';  


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, ReactiveFormsModule, FormsModule, AlertComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  password: FormControl;
  password_confirmation: FormControl;

  isSubmitting: boolean = false;
  message_alert : any  = null;
  display_message: boolean = false;

  serverValidationErrors: { [key: string]: string } = {};

  token: string | null = null;
  email: string | null = null;

  constructor(
    fb: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,
    private entityService: EntityServiceService,
    private notification: NoficationsService
  ) {
      this.password = fb.control("", [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]);
      this.password_confirmation = fb.control("", [Validators.required]);
  
      this.resetPasswordForm = fb.group({
      password: this.password,
      password_confirmation: this.password_confirmation,
    });

    this.password_confirmation.setValidators([
      Validators.required,
      this.passwordMatchValidator.bind(this)
    ]);
  }
  ngOnInit() {
    window.scroll(0,0)
    this.route.params.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
      
      console.log('Token:', this.token);
      console.log('Email:', this.email);
      
      if (!this.token || !this.email) {
        // Rediriger vers la page de connexion si les paramètres manquent
        const notif = new Notification();
        notif.message = this.entityService.getTranslatedText('user.reset-password.message.invalid-link') || 'Lien invalide';
        notif.status = "error";
        this.notification.emitNotification(notif);
        this.router.navigate(['/signin']);
      }
    });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!control.value || !this.password) return null;
    
    const password = this.password.value;
    const password_confirmation = control.value;
    
    return password === password_confirmation ? null : { passwordsDoNotMatch: true };
  }

  passwordStrengthValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;

    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[#?!@$%^&*-]/.test(value);

    const valid = hasNumber && hasUpper && hasLower && hasSpecial;
    if (!valid) {
      return { 'passwordStrength': true };
    }
    return null;
  }


  handleSubmite() {
  if (this.isSubmitting) return;

    this.serverValidationErrors = {};

    const formData = { 
      ...this.resetPasswordForm.value,
      token: this.token,
      email: this.email
    };

    const notif = new Notification();

    if (this.resetPasswordForm.valid) {
      this.isSubmitting = true;
      
      this.entityService.resetPassword(formData).subscribe({
        next: (data: any) => {
          this.isSubmitting = false;
          if (data.success) {
            notif.message = this.entityService.getTranslatedText('user.reset-password.message.success-title') || 'Mot de passe réinitialisé avec succès';
            notif.status = "success";
            this.notification.emitNotification(notif);
            this.router.navigate(['/signin']);
          } else {
            notif.message = this.entityService.getTranslatedText('user.reset-password.message.error-title') || 'Une erreur est survenue';
            notif.status = "warning";
            this.notification.emitNotification(notif);
          }
        },
        error: (error: any) => {
          this.isSubmitting = false;

          if (error.status === 422 && error.error?.errors) {
            this.handleServerValidationErrors(error.error.errors);
          } else if (error.status === 400 || error.status === 404) {
            // Token invalide ou expiré
            notif.message = this.entityService.getTranslatedText('user.reset-password.message.token-invalid') || 'Token invalide ou expiré';
            notif.status = "error";
            this.notification.emitNotification(notif);
            // Rediriger vers la page de demande de réinitialisation
            setTimeout(() => {
              this.router.navigate(['/send-mail-forget-password']);
            }, 3000);
          } else {
            notif.message = this.entityService.getTranslatedText('user.signup.message.notif.error') || 'Une erreur est survenue';
            notif.status = "error";
            this.notification.emitNotification(notif);
          }
        }
      });

    }
  }

  // Obtenir le message d'erreur pour un champ
  getFieldError(fieldName: string): string | null {
    const control = this.resetPasswordForm.get(fieldName);
    
    if (!control || (!control.dirty && !control.touched)) {
      return null;
    }

    // Erreur du serveur
    if (this.serverValidationErrors[fieldName]) {
      return this.serverValidationErrors[fieldName];
    }

    // Erreurs de validation côté client
    if (control.errors) {
      const errors = control.errors;
      if (errors['required']) {
        return this.entityService.getTranslatedText(`user.signup.message.error.${fieldName}.required`);
      }
      if (errors['minlength']) {
        return this.entityService.getTranslatedText(`user.signup.message.error.${fieldName}.minlength`);
      }
      if (errors['passwordStrength']) {
        return this.entityService.getTranslatedText('user.signup.message.error.password.strength');
      }
    }

    // Erreur de correspondance des mots de passe
    if (fieldName === 'password_confirmation' && this.password_confirmation.errors?.['passwordsDoNotMatch']) {
      return this.entityService.getTranslatedText('user.signup.message.error.password.mismatch');
    }

    return null;
  }

   // Vérifier si un champ a une erreur
  hasFieldError(fieldName: string): boolean {
    return this.getFieldError(fieldName) !== null;
  }

  closeAlert(event: any) {
    this.display_message = false;
  }

  // Obtenir la force du mot de passe
  getPasswordStrength(): string {
    const password = this.password.value;
    if (!password) return 'weak';

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score >= 4) return 'strong';
    if (score >= 3) return 'medium';
    return 'weak';
  }

  // Obtenir le pourcentage de force du mot de passe
  getPasswordStrengthPercentage(): number {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'weak': return 33;
      case 'medium': return 66;
      case 'strong': return 100;
      default: return 0;
    }
  }

   // Gérer les erreurs de validation du serveur
  handleServerValidationErrors(errors: any) {
    this.serverValidationErrors = {};
    
    for (const field in errors) {
      if (errors.hasOwnProperty(field)) {
        this.serverValidationErrors[field] = errors[field][0];
        
        // Marquer le champ comme ayant une erreur
        const control = this.resetPasswordForm.get(field);
        if (control) {
          control.setErrors({ 'serverError': true });
          control.markAsTouched();
        }
      }
    }
  }

  // Méthode pour nettoyer les erreurs serveur quand l'utilisateur modifie un champ
  onFieldChange(fieldName: string) {
    if (this.serverValidationErrors[fieldName]) {
      delete this.serverValidationErrors[fieldName];
      
      // Supprimer l'erreur du contrôle
      const control = this.resetPasswordForm.get(fieldName);
      if (control && control.hasError('serverError')) {
        control.setErrors(null);
      }
    }
  }
  
}
