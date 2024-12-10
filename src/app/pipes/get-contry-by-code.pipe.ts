import { Pipe, PipeTransform } from '@angular/core';
import { Country, ICountry } from 'country-state-city';

@Pipe({
  name: 'getContryByCode',
  standalone: true
})
export class GetContryByCodePipe implements PipeTransform {
  // contry_name!: ICountry[];

  transform(value: string): string {
    let contry_name: any  = Country.getCountryByCode(value);

    let name = contry_name.name;

    return name;
  }

}
