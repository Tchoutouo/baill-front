import { Component, OnInit } from '@angular/core';
import { getSiteName } from '../../../helpers/helper';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Country, State, City ,ICountry, IState, ICity}  from 'country-state-city';
import { User } from '../../../models/user';
import { EntityServiceService } from '../../../services/admin/entity-service.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [TranslateModule, RouterLink,FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{
  siteName: string ="";
  // countries: any[] = [];
  countries: ICountry[] | undefined;
  cities: ICity[] | undefined;
  selectedCountry: string = '';
  selectedCity: string = '';
  phoneCode: string = '';

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
  whatsapp_number: FormControl;
  email: FormControl;
  city: FormControl;
  country: FormControl;
  neighborhood : FormControl;
  password: FormControl;
  // passwordConfirm: FormControl;

  constructor(fb: FormBuilder, private entityService : EntityServiceService) {
    this.username = fb.control("",[Validators.required]);
    this.last_name = fb.control("",[Validators.required]);
    this.whatsapp_number = fb.control("",[Validators.required]);
    this.city = fb.control("",[Validators.required]);
    this.country = fb.control("",[Validators.required]);
    this.neighborhood = fb.control("",[Validators.required]);
    this.email = fb.control("",[Validators.email, Validators.required]);
    this.password = fb.control("",[Validators.required, Validators.minLength(8)]);
    // this.passwordConfirm = fb.control("",[Validators.required, Validators.minLength(8)]);
    
    this.signupForm = fb.group({
      username: this.username,
      last_name: this.last_name,
      whatsapp_number: this.whatsapp_number,
      email: this.email,
      city: this.city,
      country: this.country,
      neighborhood: this.neighborhood,
      password: this.password,
      // passwordConfirm: this.passwordConfirm,

    })
  }

  ngOnInit(): void {
    this.siteName = getSiteName();
    this.countries = Country.getAllCountries();
    console.log("countries",this.countries)
  }

  async onCountryChange(event: any) {
    try{
      const countryCode = event.target.value;
      this.cities = City.getCitiesOfCountry(countryCode);
      console.log("cities",this.cities);

    } catch (error) {
      console.error('Erreur lors de la récupération des villes:', error);
    }
  }

  handleSubmit(){
    console.log("formValue",this.signupForm.value)
    const entity =  "users_back/store";

    const datas = this.signupForm.value;
    this.entityService.store(entity, datas).subscribe({
      next : (data : any) =>{
        console.log("data",data);

        console.log({success: data});
      },

      error: (error : any) => {
        console.log(error);
      }
    })
  }
}
