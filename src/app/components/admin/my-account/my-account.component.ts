import { Component } from '@angular/core';
import { LocalStorageService } from '../../../services/admin/local-storage.service';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
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
  updateUser!: any;
  images: string ="";
  selectedFile: File | null = null;
  fileError: string | null = null;
  userForm!: NgForm

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
    alert('hello');
    // if (this.userForm.invalid || this.fileError) {
    //   return;
    // }
    
    // this.updateUser = {
    //   username: this.user.username,
    //   last_name: this.user.last_name,
    //   first_name: this.user.first_name,
    //   email: this.user.email,
    //   password: this.user.password,
    //   picture: this.images,
    //   number: this.user.number,
    //   whatsapp_number: this.user.whatsapp_number,
    //   site_url: this.user.site_url,
    //   neighborhood: this.user.neighborhood,
    //   city: this.user.city,
    //   country: this.user.country,
    //   sex: this.user.sex,
    //   cni: this.user.cni
    // }
    // console.log("firstValue",this.updateUser);
    // Object.keys(this.updateUser).forEach((key) => {  
    //   if (typeof this.updateUser[key] === 'object' && this.updateUser[key] !== null) {  
    //     // Si c'est un objet (mais pas null), vous pouvez également itérer à travers ses propriétés  
    //     formData.append(key, JSON.stringify(this.updateUser[key])); // Convertir l'objet en JSON  
    //   } else {  
    //     // Pour d'autres types de valeurs (string, number, etc.)  
    //     formData.append(key, this.updateUser[key]);  
    //   }  
    // });
    // console.log("this.picture",this.picture);

    // formData.append("images", this.picture);  
    // console.log(this.User.name);
    const  formData = new FormData();
      console.log('his.user.username', this.user.username);
      formData.append('username',this.user.username);
      formData.append('last_name',this.user.last_name? this.user.last_name : '');
      formData.append('first_name',this.user.first_name? this.user.first_name : '');
      formData.append('email',this.user.email);
      formData.append('password',this.user.password);
      if (this.selectedFile) {
        formData.append('picture', this.selectedFile, this.selectedFile.name);
      }
      formData.append('whatsapp_number',this.user.whatsapp_number? this.user.whatsapp_number : '');
      formData.append('number',this.user.number? this.user.number : '');
      formData.append('site_url',this.user.site_url? this.user.site_url : '');
      formData.append('neighborhood',this.user.neighborhood? this.user.neighborhood : '');
      formData.append('city',this.user.city? this.user.city : '');
      formData.append('country',this.user.country? this.user.country : '');
      // formData.append('sex',this.user.sex? this.user.sex);
      formData.append('cni',this.user.cni? this.user.cni : '');

        console.log('formData',formData, this.user.id)

    const entity = "advertiser_back/update";
    const user_id =  this.user.id;

    console.log("this.updateUser",this.updateUser);
    this.entityService.update(user_id, formData, entity).subscribe({
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

    // console.log("updateUser",formData);
  }

  handleAddImage(event : any){
    const input_file : any = document.querySelector("#images")
    if (input_file) {
      input_file.click()
    }
  }

  addImage(event: any) {  
    const files = event.target.files; 
    // console.log("files", files); 
    const file_image = files[0];
    if (file_image) {
      if (file_image.size > 2048000) { // Limite à 2MB
        this.fileError = 'La taille du fichier doit être inférieure à 2MB.';
        this.selectedFile = null;
      } else if (!file_image.type.match('image/*')) {
        this.fileError = 'Le fichier doit être une image.';
        this.selectedFile = null;
      } else {
        this.fileError = null;
        this.selectedFile = file_image;
      }
    }  
    // const image = files;
    this.images = files;
    // console.log("file_image", files); 

  
    if (!is_image(file_image)) {  
      this.errorMessage = "Erreur, ceci n'est pas une image !";  
    }  

    this.errorMessage = "";  
    const file_reader = new FileReader();    
    file_reader.readAsDataURL(file_image);
      
    file_reader.onload = () => {  
      this.picture = file_reader.result as string ;
    // console.log("this.picture",this.picture);

      // this.updateUser.picture = this.picture ;

    };  
  }

}
