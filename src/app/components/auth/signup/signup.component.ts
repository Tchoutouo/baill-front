import { Component, OnInit } from '@angular/core';
import { getSiteName } from '../../../helpers/helper';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Country, State, City ,ICountry, IState, ICity}  from 'country-state-city';
import { User } from '../../../models/user';
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import { AlertComponent } from '../../admin/alert/alert.component';
import { NoficationsService } from '../../../services/nofications.service';
import { Notification } from '../../../models/notification';  
import { debounceTime, distinctUntilChanged, switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [TranslateModule, RouterLink,FormsModule, CommonModule, ReactiveFormsModule, AlertComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{
  siteName: string ="";
  countries: ICountry[] | undefined;
  cities: ICity[] | undefined;
  selectedCountry: string = 'CM';
  selectedCity: string = '';
  phoneCode: string = '';
  message_alert : any  = null;
  display_message: boolean = false;
  country_selected!: any;
  my_country: string ='';
  isSubmitting: boolean = false;

  user: User = {
    username:"",
    first_name: "",
    last_name: "",
    email: "",
    password:"",
    whatsapp_number: "",
    city: "",
    country: "",
    neighborhood: "",
    // passwordConfirm:""
  }

  // Suivre les erreurs de validation côté serveur
  serverValidationErrors: { [key: string]: string } = {};

  signupForm: FormGroup;
  username: FormControl;
  last_name: FormControl;
  first_name: FormControl;
  whatsapp_number: FormControl;
  email: FormControl;
  city: FormControl;
  country: FormControl;
  neighborhood : FormControl;
  // password: FormControl;
  // passwordConfirm: FormControl;
  

  constructor(
    fb: FormBuilder,
    private entityService: EntityServiceService,
    private router: Router,
    private translate: TranslateService,
    private notification: NoficationsService
  ) {
    this.username = fb.control("", [Validators.required], [this.usernameValidator.bind(this)]);
    this.last_name = fb.control("", [Validators.required]);
    this.first_name = fb.control("", [Validators.required]);
    this.whatsapp_number = fb.control("", [Validators.required, this.phoneValidator], [this.phoneAsyncValidator.bind(this)]);
    this.city = fb.control("", [Validators.required]);
    this.country = fb.control("", [Validators.required]);
    this.neighborhood = fb.control("", [Validators.required]);
    this.email = fb.control("", [Validators.email, Validators.required], [this.emailAsyncValidator.bind(this)]);
    // this.password = fb.control("", [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]);
    // this.passwordConfirm = fb.control("", [Validators.required]);

    this.signupForm = fb.group({
      username: this.username,
      last_name: this.last_name,
      first_name: this.first_name,
      whatsapp_number: this.whatsapp_number,
      email: this.email,
      city: this.city,
      country: this.country,
      neighborhood: this.neighborhood,
      // password: this.password,
      // passwordConfirm: this.passwordConfirm,
    }, {
      // validators: this.passwordsMatchValidator
    });

    this.selectedCountry = 'CM';
  }

  ngOnInit(): void {
    window.scroll(0,0)
    this.siteName = getSiteName();
    this.countries = Country.getAllCountries();
    this.onCountryChange({ target: { value: this.selectedCountry } });
    this.setupAsyncValidation();
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

  // Validation personnalisée pour le téléphone
  phoneValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;
    
    const phoneRegex = /^\d{6,14}$/;
    if (!phoneRegex.test(value)) {
      return { 'invalidPhone': true };
    }
    return null;
  }

  // Validation asynchrone pour l'email
  emailAsyncValidator(control: AbstractControl) {
  if (!control.value || control.hasError('email') || !control.dirty) {
    return of(null);
  }

  return of(control.value).pipe(
    debounceTime(2500), // Augmenté à 1.5 seconde
    distinctUntilChanged(),
    switchMap(email => {
      // Vérifier si le contrôle a toujours la même valeur
      if (control.value !== email) {
        return of(null);
      }
      return this.entityService.checkEmailExists(email);
    }),
    map(exists => exists ? { 'emailExists': true } : null),
    catchError(() => of(null))
  );
}

  // Validation asynchrone pour le nom d'utilisateur
  usernameValidator(control: AbstractControl) {
  if (!control.value || !control.dirty) {
    return of(null);
  }

  return of(control.value).pipe(
    debounceTime(2500), // Augmenté à 1.5 seconde
    distinctUntilChanged(),
    switchMap(username => {
      // Vérifier si le contrôle a toujours la même valeur
      if (control.value !== username) {
        return of(null);
      }
      return this.entityService.checkUsernameExists(username);
    }),
    map(exists => exists ? { 'usernameExists': true } : null),
    catchError(() => of(null))
  );
}

  // Validation asynchrone pour le téléphone
  phoneAsyncValidator(control: AbstractControl) {
  if (!control.value || control.hasError('invalidPhone') || !control.dirty) {
    return of(null);
  }

  const fullPhone = this.phoneCode + control.value;
  return of(fullPhone).pipe(
    debounceTime(2500), // Augmenté à 1.5 seconde
    distinctUntilChanged(),
    switchMap(whatsapp_number => {
      // Vérifier si le contrôle a toujours la même valeur
      if (control.value !== whatsapp_number.replace(this.phoneCode, '')) {
        return of(null);
      }
      return this.entityService.checkPhoneExists(whatsapp_number);
    }),
    map(exists => exists ? { 'phoneExists': true } : null),
    catchError(() => of(null))
  );
}

  // Configuration de la validation asynchrone
  setupAsyncValidation() {
    // Révalider le téléphone quand le code pays change
    this.country.valueChanges.subscribe(() => {
      if (this.whatsapp_number.value) {
        this.whatsapp_number.updateValueAndValidity();
      }
    });
  }

  // passwordsMatchValidator(formGroup: FormGroup) {
  //   const password = formGroup.get('password')?.value;
  //   const passwordConfirm = formGroup.get('passwordConfirm')?.value;

  //   return password === passwordConfirm ? null : { passwordsDoNotMatch: true };
  // }

  async onCountryChange(event: any) {
    try {
      var countryCode = event.target.value;
      this.cities = City.getCitiesOfCountry(countryCode);
      this.country_selected = Country.getCountryByCode(countryCode);
      this.phoneCode = this.country_selected.phonecode;
      this.my_country = this.country_selected.name;
      this.selectedCountry = countryCode;

      // Réinitialiser la ville sélectionnée
      this.selectedCity = '';
      this.city.setValue('');

    } catch (error) {
      console.error('Erreur lors de la récupération des villes:', error);
    }
  }

  handleSubmit() {
    if (this.isSubmitting) return;

    this.serverValidationErrors = {};
    const entity = "advertiser_back/store";
    
    // Construire les données à envoyer
    const formData = { ...this.signupForm.value };
    formData.whatsapp_number = this.phoneCode + formData.whatsapp_number;
    formData.country = this.my_country;
    
    // Supprimer la confirmation du mot de passe
    // delete formData.passwordConfirm;

    const notif = new Notification();

    if (this.signupForm.valid) {
      this.isSubmitting = true;
      
      this.entityService.store(entity, formData).subscribe({
        next: (data: any) => {
          this.isSubmitting = false;
          
          if (data.success) {
            notif.message = this.entityService.getTranslatedText('user.signup.message.notif.success');
            notif.status = "success";
            this.notification.emitNotification(notif);
            this.router.navigate(['/signin']);
          } else {
            notif.message = data.message || this.entityService.getTranslatedText('user.signup.message.notif.warning');
            notif.status = "warning";
            this.notification.emitNotification(notif);
          }
        },
        error: (error: any) => {
          this.isSubmitting = false;
          console.log("erreur lors de l'enregistrement d'un utilisateur:", error);
          
          // Gérer les erreurs de validation du serveur
          if (error.status === 422 && error.error?.errors) {
            this.handleServerValidationErrors(error.error.errors);
          } else {
            notif.message = this.entityService.getTranslatedText('user.signup.message.notif.error') || 'Une erreur est survenue';
            notif.status = "error";
            this.notification.emitNotification(notif);
          }
        }
      });

    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.markFormGroupTouched(this.signupForm);
      notif.message = this.entityService.getTranslatedText('user.signup.message.form.invalid') || 'Veuillez corriger les erreurs dans le formulaire';
      notif.status = "warning";
      this.notification.emitNotification(notif);
    }
  }

  handleSubmit_old(){
    const entity =  "advertiser_back/store";
    this.signupForm.value.whatsapp_number = this.phoneCode+this.signupForm.value.whatsapp_number;
    const datas = this.signupForm.value;
    const notif = new Notification();

    if (this.signupForm.valid) {
      this.entityService.store(entity, datas).subscribe({
        next : (data : any) =>{
          if(data.success){
            notif.message = this.entityService.getTranslatedText('user.signup.message.notif.success');
            notif.status = "success"
            if (this.message_alert) {
              this.display_message = true;
            }
            this.router.navigate(['/signin']);
          }else{
            notif.message = this.entityService.getTranslatedText('user.signup.message.notif.warning');
            notif.status = "warning"
          }
          this.notification.emitNotification(notif);
        },
        error: (error : any) => {
          this.phoneCode = "";
          console.log("erreur lors de l'enregistrement d'un utilisateur:",error);
        }
      })

    } else {
      alert('Please correct the errors in the form');
    }
  }

   // Gérer les erreurs de validation du serveur
  handleServerValidationErrors(errors: any) {
    this.serverValidationErrors = {};
    
    for (const field in errors) {
      if (errors.hasOwnProperty(field)) {
        this.serverValidationErrors[field] = errors[field][0]; // Prendre le premier message d'erreur
        
        // Marquer le champ comme ayant une erreur
        const control = this.signupForm.get(field);
        if (control) {
          control.setErrors({ 'serverError': true });
          control.markAsTouched();
        }
      }
    }
  }

  // Marquer tous les champs comme touchés
  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Obtenir le message d'erreur pour un champ
  getFieldError(fieldName: string): string | null {
    const control = this.signupForm.get(fieldName);
    
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
      if (errors['email']) {
        return this.entityService.getTranslatedText('user.signup.message.error.email.invalid');
      }
      if (errors['minlength']) {
        return this.entityService.getTranslatedText(`user.signup.message.error.${fieldName}.minlength`);
      }
      if (errors['passwordStrength']) {
        return this.entityService.getTranslatedText('user.signup.message.error.password.strength');
      }
      if (errors['invalidPhone']) {
        return this.entityService.getTranslatedText('user.signup.message.error.phone.invalid');
      }
      if (errors['emailExists']) {
        return this.entityService.getTranslatedText('user.signup.message.error.email.exists');
      }
      if (errors['usernameExists']) {
        return this.entityService.getTranslatedText('user.signup.message.error.username.exists');
      }
      if (errors['phoneExists']) {
        return this.entityService.getTranslatedText('user.signup.message.error.phone.exists');
      }
    }

    // Erreur de correspondance des mots de passe
    // if (fieldName === 'passwordConfirm' && this.signupForm.errors?.['passwordsDoNotMatch']) {
    //   return this.entityService.getTranslatedText('user.signup.message.error.password.mismatch');
    // }

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
  // getPasswordStrength(): string {
  //   const password = this.password.value;
  //   if (!password) return 'weak';

  //   let score = 0;
  //   if (password.length >= 8) score++;
  //   if (/[a-z]/.test(password)) score++;
  //   if (/[A-Z]/.test(password)) score++;
  //   if (/[0-9]/.test(password)) score++;
  //   if (/[^A-Za-z0-9]/.test(password)) score++;

  //   if (score >= 4) return 'strong';
  //   if (score >= 3) return 'medium';
  //   return 'weak';
  // }

  // Obtenir le pourcentage de force du mot de passe
  // getPasswordStrengthPercentage(): number {
  //   const strength = this.getPasswordStrength();
  //   switch (strength) {
  //     case 'weak': return 33;
  //     case 'medium': return 66;
  //     case 'strong': return 100;
  //     default: return 0;
  //   }
  // }

  // Obtenir la liste des erreurs du formulaire
  getFormErrors(): string[] {
    const errors: string[] = [];
    
    Object.keys(this.signupForm.controls).forEach(key => {
      const fieldError = this.getFieldError(key);
      if (fieldError) {
        const fieldName = this.entityService.getTranslatedText(`user.signup.fields.${key}`);
        errors.push(`${fieldName}: ${fieldError}`);
      }
    });

    return errors;
  }

  // Méthode pour nettoyer les erreurs serveur quand l'utilisateur modifie un champ
  onFieldChange(fieldName: string) {
    if (this.serverValidationErrors[fieldName]) {
      delete this.serverValidationErrors[fieldName];
      
      // Supprimer l'erreur du contrôle
      const control = this.signupForm.get(fieldName);
      if (control && control.hasError('serverError')) {
        control.setErrors(null);
      }
    }
  }

  
}
