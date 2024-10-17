import { Component } from '@angular/core';
import { LocalStorageService } from '../../../services/admin/local-storage.service';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { City, Country, ICity, ICountry } from 'country-state-city';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent {
  type : string = "password";
  icon_eyes : string =""
  user!: User;
  countries: ICountry[] | undefined;
  cities: ICity[] | undefined;
  selectedCountry: string = '';
  selectedCity: string = '';

  constructor (private localStorage : LocalStorageService){

  }

  ngOnInit(){
    window.scroll(0,0)
    this.user  = this.localStorage.getItem('user');
    this.countries = Country.getAllCountries();
  }

  chanIcon(event : any){
    this.type = (this.type === "password") ?  "text"  : "password" ;

    this.icon_eyes = (this.icon_eyes === "") ?  "-slash"  : "" ;

   
  }

  async onCountryChange(event: any) {
    try{
      const countryCode = event.target.value;
      this.cities = City.getCitiesOfCountry(countryCode);
      // console.log("cities",this.cities);

    } catch (error) {
      console.error('Erreur lors de la récupération des villes:', error);
    }
  }

  UpdateProfil(){
    
  }

 
}
