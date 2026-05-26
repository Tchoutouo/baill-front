import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Country, City, ICountry, ICity } from 'country-state-city';
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import { NoficationsService } from '../../../services/nofications.service';
import { Notification } from '../../../models/notification';
import { getSiteName } from '../../../helpers/helper';

const STEPS = ['identity', 'location', 'security'] as const;
type StepKey = typeof STEPS[number];

/** Champs requis pour valider chaque étape avant de passer à la suivante */
const STEP_FIELDS: Record<StepKey, string[]> = {
  identity: ['username', 'first_name', 'last_name', 'email'],
  location: ['country', 'city', 'neighborhood', 'whatsapp_number'],
  security: ['password', 'passwordConfirm'],
};

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, TranslateModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  siteName = '';
  countries: ICountry[] = [];
  cities: ICity[] = [];
  selectedCountry = 'CM';
  phoneCode = '237';
  isLoading = false;
  isStepSubmitted = false;
  isSuccess = false;
  registeredEmail = '';
  serverError = '';

  currentStep = 0;
  readonly steps = STEPS;
  readonly totalSteps = STEPS.length;

  signupForm!: FormGroup;
  username!: FormControl;
  first_name!: FormControl;
  last_name!: FormControl;
  email!: FormControl;
  country!: FormControl;
  city!: FormControl;
  neighborhood!: FormControl;
  whatsapp_number!: FormControl;
  password!: FormControl;
  passwordConfirm!: FormControl;

  showPassword = false;
  showPasswordConfirm = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly entityService: EntityServiceService,
    private readonly notification: NoficationsService,
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.siteName = getSiteName();
    this.countries = Country.getAllCountries();
    this.buildForm();
    this.loadCities('CM');
  }

  private buildForm(): void {
    this.username        = this.fb.control('', [Validators.required, Validators.minLength(3)]);
    this.first_name      = this.fb.control('', [Validators.required]);
    this.last_name       = this.fb.control('', [Validators.required]);
    this.email           = this.fb.control('', [Validators.required, Validators.email]);
    this.country         = this.fb.control('CM', [Validators.required]);
    this.city            = this.fb.control('', [Validators.required]);
    this.neighborhood    = this.fb.control('', [Validators.required]);
    this.whatsapp_number = this.fb.control('', [Validators.required, Validators.pattern(/^\d{6,15}$/)]);
    this.password        = this.fb.control('', [Validators.required, Validators.minLength(8)]);
    this.passwordConfirm = this.fb.control('', [Validators.required]);

    this.signupForm = this.fb.group(
      {
        username: this.username,
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        country: this.country,
        city: this.city,
        neighborhood: this.neighborhood,
        whatsapp_number: this.whatsapp_number,
        password: this.password,
        passwordConfirm: this.passwordConfirm,
      },
      { validators: this.passwordsMatchValidator },
    );
  }

  private passwordsMatchValidator(g: FormGroup) {
    const pw  = g.get('password')?.value;
    const cpw = g.get('passwordConfirm')?.value;
    return pw === cpw ? null : { passwordsDoNotMatch: true };
  }

  private loadCities(isoCode: string): void {
    try {
      this.cities = City.getCitiesOfCountry(isoCode) ?? [];
      const countryData = Country.getCountryByCode(isoCode);
      this.phoneCode = countryData?.phonecode ?? '';
    } catch {
      this.cities = [];
    }
  }

  onCountryChange(event: Event): void {
    const code = (event.target as HTMLSelectElement).value;
    this.selectedCountry = code;
    this.city.setValue('');
    this.loadCities(code);
  }

  get progressPercent(): number {
    return Math.round(((this.currentStep + 1) / this.totalSteps) * 100);
  }

  showErrors(ctrl: FormControl): boolean {
    return (ctrl.dirty || ctrl.touched || this.isStepSubmitted) && ctrl.invalid;
  }

  private touchCurrentStepFields(): void {
    const fields = STEP_FIELDS[STEPS[this.currentStep]];
    fields.forEach(f => this.signupForm.get(f)?.markAsTouched());
  }

  private isCurrentStepValid(): boolean {
    const fields = STEP_FIELDS[STEPS[this.currentStep]];
    return fields.every(f => {
      const ctrl = this.signupForm.get(f);
      return ctrl?.valid ?? false;
    });
  }

  nextStep(): void {
    this.isStepSubmitted = true;
    this.touchCurrentStepFields();

    // Vérification spéciale étape 3 : mots de passe correspondants
    if (this.currentStep === 2 && this.signupForm.errors?.['passwordsDoNotMatch']) {
      return;
    }

    if (!this.isCurrentStepValid()) return;

    this.isStepSubmitted = false;
    this.currentStep = Math.min(this.currentStep + 1, this.totalSteps - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prevStep(): void {
    this.isStepSubmitted = false;
    this.currentStep = Math.max(this.currentStep - 1, 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleSubmit(): void {
    this.isStepSubmitted = true;
    this.touchCurrentStepFields();

    if (!this.isCurrentStepValid() || this.signupForm.errors?.['passwordsDoNotMatch']) return;

    this.isLoading = true;
    this.serverError = '';

    const payload = {
      ...this.signupForm.value,
      whatsapp_number: this.phoneCode + this.signupForm.value.whatsapp_number,
    };
    delete payload['passwordConfirm'];

    this.entityService.store('advertiser_back/store', payload).subscribe({
      next: (data: any) => {
        this.isLoading = false;
        if (data.success) {
          this.isSuccess = true;
          this.registeredEmail = this.signupForm.value.email;
        } else {
          const notif = new Notification();
          notif.message = this.entityService.getTranslatedText('user.signup.message.notif.warning');
          notif.status  = 'warning';
          this.notification.emitNotification(notif);
          this.serverError = 'user.signup.message.notif.warning';
        }
      },
      error: () => {
        this.isLoading = false;
        this.serverError = 'user.signup.message.notif.warning';
      },
    });
  }
}
