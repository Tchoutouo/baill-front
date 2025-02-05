import { Component, OnInit } from '@angular/core';
import { getSiteName } from '../../../helpers/helper';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Country, State, City ,ICountry, IState, ICity}  from 'country-state-city';
import { User } from '../../../models/user';
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import { AlertComponent } from '../../admin/alert/alert.component';
import { NoficationsService } from '../../../services/nofications.service';
import { Notification } from '../../../models/notification';  

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

  signupForm: FormGroup;
  username: FormControl;
  last_name: FormControl;
  first_name: FormControl;
  whatsapp_number: FormControl;
  email: FormControl;
  city: FormControl;
  country: FormControl;
  neighborhood : FormControl;
  password: FormControl;
  passwordConfirm: FormControl;
  

  constructor(fb: FormBuilder, private entityService : EntityServiceService, 
              private router: Router, private translate: TranslateService,
              private notification: NoficationsService) {
    this.username = fb.control("",[Validators.required]);
    this.last_name = fb.control("",[Validators.required]);
    this.first_name = fb.control("",[Validators.required]);
    this.whatsapp_number = fb.control("",[Validators.required]);
    this.city = fb.control("",[Validators.required]);
    this.country = fb.control("",[Validators.required]);
    this.neighborhood = fb.control("",[Validators.required]);
    this.email = fb.control("",[Validators.email, Validators.required]);
    this.password = fb.control("",[Validators.required, Validators.minLength(8)]);
    this.passwordConfirm = fb.control("",[Validators.required]);
    
    this.signupForm = fb.group({
      username: this.username,
      last_name: this.last_name,
      first_name: this.first_name,
      whatsapp_number: this.whatsapp_number,
      email: this.email,
      city: this.city,
      country: this.country,
      neighborhood: this.neighborhood,
      password: this.password,
      passwordConfirm: this.passwordConfirm,
      // passwordsDoNotMatch: false

    }
    ,
    {
      validators: this.passwordsMatchValidator
    })
    this.selectedCountry = 'CM';
  }

  ngOnInit(): void {
    window.scroll(0,0)
    this.siteName = getSiteName();
    this.countries = Country.getAllCountries();
    this.onCountryChange({ target: { value: this.selectedCountry } });
  }

  passwordsMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const passwordConfirm = formGroup.get('passwordConfirm')?.value;

    return password === passwordConfirm ? null : { passwordsDoNotMatch: true };
  }

  // getTranslatedText(key: string): string {
  //   let translatedText = '';
  //   this.translate.get(key).subscribe((res: string) => {
  //     console.log("res", res);
  //     translatedText = res;
  //   });
  //   return translatedText;
  // }
  // get password() {
  //   return this.signupForm.get('password');
  // }

  // get passwordConfirm() {
  //   return this.signupForm.get('passwordConfirm');
  // }

  async onCountryChange(event: any) {
    try{
      var countryCode = event.target.value;
      this.cities = City.getCitiesOfCountry(countryCode);
      this.country_selected = Country.getCountryByCode(countryCode);
      this.phoneCode = this.country_selected.phonecode;
      this.my_country = this.country_selected.name;
      this.selectedCountry = countryCode;

    } catch (error) {
      console.error('Erreur lors de la récupération des villes:', error);
    }
  }

  handleSubmit(){
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
            notif.message = this.entityService.getTranslatedText('user.signup.message.notif.error');
            notif.status = "warning"
          }
          this.notification.emitNotification(notif);
        },
        error: (error : any) => {
          console.log("erreur lors de l'enregistrement d'un utilisateur:",error);
        }
      })

    } else {
      alert('Please correct the errors in the form');
    }
  }

  closeAlert(event : any){
    event ? this.display_message = false : this.display_message = false ;
  }
}
