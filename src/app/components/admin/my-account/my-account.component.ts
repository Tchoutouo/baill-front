import { Component } from '@angular/core';
import { LocalStorageService } from '../../../services/admin/local-storage.service';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { City, Country, ICity, ICountry } from 'country-state-city';
import { TranslateModule } from '@ngx-translate/core';
import { EntityServiceService } from '../../../services/admin/entity-service.service';
import { Router } from '@angular/router';
import { is_image } from '../../../helpers/helper';

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
  countries!: ICountry[] | undefined;
  cities: ICity[] | undefined;
  selectedCountry!: any;
  selectedCity!: any;
  picture: string = "";
  errorMessage : string = "";


  constructor (private localStorage : LocalStorageService, private entityService : EntityServiceService, private router: Router){

  }

  ngOnInit(){
    window.scroll(0,0)
    this.user  = this.localStorage.getItem('user');
    this.countries = Country.getAllCountries();
    console.log(this.countries);
    this.selectedCountry = this.user.country;
    this.cities = City.getCitiesOfCountry(this.selectedCountry);
    this.selectedCity = this.user.city;

  }

  chanIcon(event : any){
    this.type = (this.type === "password") ?  "text"  : "password" ;

    this.icon_eyes = (this.icon_eyes === "") ?  "-slash"  : "" ;
  }

  async onCountryChange(event: any) {
    try{
      const countryCode = event.target.value;
      this.cities = City.getCitiesOfCountry(countryCode);
    } catch (error) {
      console.error('Erreur lors de la récupération des villes:', error);
    }
  }

  UpdateProfil(){
    // console.log(this.User.name);
    var updateUser = {
      username: this.user.username,
      last_name: this.user.last_name,
      first_name: this.user.first_name,
      email: this.user.email,
      password: this.user.password,
      picture: this.user.picture,
      number: this.user.number,
      whatsapp_number: this.user.whatsapp_number,
      site_url: this.user.site_url,
      neighborhood: this.user.neighborhood,
      city: this.user.city,
      country: this.user.country,
      sex: this.user.sex,
      cni: this.user.cni
    }
    const entity = "advertiser_back/update";
    const user_id =  this.user.id;

    this.entityService.update(user_id, updateUser, entity).subscribe({
      next : (data : any) =>{
        console.log("data",data);
        if(data.success){
          this.localStorage.setItem('user',data.data);
          this.user  = this.localStorage.getItem('user');
          this.router.navigate(['/admin/myAccount']);
        }
      },

      error: (error : any) => {
        console.log(error);
      }
    });

    console.log("updateUser",updateUser);
  }

  handleAddImage(event : any){
    const input_file : any = document.querySelector("#images")
    if (input_file) {
      input_file.click()
    }
  }

  addImage(event: any) {  
    const files = event.target.files;  
    const file_image = files[0];  
  
    if (!is_image(file_image)) {  
      this.errorMessage = "Erreur, ceci n'est pas une image !";  
    }  

    this.errorMessage = "";  
    const file_reader = new FileReader();    
    file_reader.readAsDataURL(file_image);
      
    file_reader.onload = () => {  
      this.picture = file_reader.result as string ;
      this.user.picture = this.picture ; 
    };  
  }

}
