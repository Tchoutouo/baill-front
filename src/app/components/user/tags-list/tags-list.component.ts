import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { City, Country, ICity, ICountry } from 'country-state-city';
import { Category } from '../../../models/admin/category';
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import { Subscription } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-tags-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tags-list.component.html',
  styleUrl: './tags-list.component.css'
})
export class TagsListComponent implements OnInit{
  selectedCountry: string = '';
  selectedCity: string = '';
  countries: ICountry[] | undefined;
  cities: ICity[] | undefined;
  categories: Category[] = [] ;

  constructor(private entityService : EntityServiceService){}
  
  ngOnInit(): void {
    this.countries = Country.getAllCountries();
    this.getAllCategories();
  }

  async onCountryChange(event: any) {
    try{
      const countryCode = event.target.value;
      this.cities = City.getCitiesOfCountry(countryCode);

    } catch (error) {
      console.error('Erreur lors de la récupération des villes:', error);
    }
  }

  async getAllCategories(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    console.log("headers",headers);

    try{
      const entity= "categorie_back";
      this.entityService.getAll(entity)
      .subscribe({
        next: (categories: any)=>{
          this.categories = categories.data
        },
        error: (error: any)=>{
          console.log("error", error)
        },
        complete: ()=>{
          console.log("complete")
        }
      })

    }catch (e){
      console.error('erreur de recupérer des catégories d\'articles:', e)
    }
  }

}
