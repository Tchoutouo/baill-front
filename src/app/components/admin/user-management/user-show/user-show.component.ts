import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ICity, ICountry } from 'country-state-city';

@Component({
  selector: 'app-user-show',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './user-show.component.html',
  styleUrl: './user-show.component.css'
})
export class UserShowComponent {
  countries!: ICountry[] | undefined;  
  cities!: ICity[] | undefined;  
  selectedCountry!: any;  
  selectedCity!: any;  
  picture: any = false;
}
