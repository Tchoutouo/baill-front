import { Injectable } from '@angular/core';
import countries from 'world-countries';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor() { }

  getCountries() {
    return countries;
  }
    
  getCities(countryCode: string) {
    const country = countries.find(c => c.cca2 === countryCode);
    return country ;
  }

}
