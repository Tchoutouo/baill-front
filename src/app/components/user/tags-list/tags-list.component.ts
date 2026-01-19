import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { City, Country, ICity, ICountry } from 'country-state-city';
import { Category } from '../../../models/admin/category';
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import { Subscription } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { LangChangeEvent, TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tags-list',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './tags-list.component.html',
  styleUrl: './tags-list.component.css'
})
export class TagsListComponent implements OnInit{
  selectedCountry: string = '';
  selectedCity: string = '';
  countries: ICountry[] | undefined;
  cities: ICity[] | undefined;

  langChangeSub!: Subscription;
  categories: Category[] = [] ;
  
  @Output() filterParams = new EventEmitter<any>();
  filterListner : any = {
    categ : null ,
    country : null ,
    city : null 
  }

  constructor(private entityService : EntityServiceService, private translate: TranslateService){}
  
 ngOnInit(): void {
    this.countries = Country.getAllCountries();
    this.getAllCategories();

    // 🔁 Réagir au changement de langue
    this.langChangeSub = this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      console.log('Langue changée :', event.lang);
      this.getAllCategories();
    });
  }

  async onFilterChange(event: any, name : string) {
    try{
      if (event) {
        const value = event.target.value;
        console.log({valueç:value});
        
        if (name === "country") {
          let array_value = value.split(",")
          this.cities = City.getCitiesOfCountry(array_value[0]);
          this.filterListner.country = array_value[0];
          this.filterListner.city = null;
        } else if(name === "city"){
          this.filterListner.city = value;

        }else if(name === "category"){
          this.filterListner.categ = value;

        }
        console.log(this.filterListner);
        
        this.filterParams.emit(this.filterListner);
        
      }

    } catch (error) {
      console.error('Erreur lors de la récupération des villes:', error);
    }
  }



  refrech(){
    window.location.reload()
  }

  async getAllCategories(){
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    // });

    // console.log("headers",headers);

    try{
      const currentLang = this.translate.currentLang; 
      const entity= "categorie_back_public/"+currentLang;
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
      console.error('erreur de recupérer des catégories d\'annonce:', e)
    }
  }

}
