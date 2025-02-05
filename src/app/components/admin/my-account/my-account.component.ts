import { Component, OnInit } from '@angular/core';  
import { FormBuilder, FormGroup, FormsModule,ReactiveFormsModule, Validators } from '@angular/forms';  
import { LocalStorageService } from '../../../services/admin/local-storage.service';  
import { User } from '../../../models/user';  
import { CommonModule } from '@angular/common';  
import { City, Country, ICity, ICountry } from 'country-state-city';  
import { TranslateModule } from '@ngx-translate/core';  
import { EntityServiceService } from '../../../services/admin/entity-service.service';  
import { Router } from '@angular/router';  
import { Notification } from '../../../models/notification';  
import { is_image } from '../../../helpers/helper';  
import { NoficationsService } from '../../../services/nofications.service';  
import { environment } from '../../../../environments/environment.development';  
import { Subscription } from 'rxjs';  

@Component({  
  selector: 'app-my-account',  
  standalone: true,  
  imports: [CommonModule, ReactiveFormsModule, TranslateModule,FormsModule],  
  templateUrl: './my-account.component.html',  
  styleUrls: ['./my-account.component.css'] // Correction de "styleUrl"  
})  
export class MyAccountComponent implements OnInit {
  profileForm: FormGroup;  
  type : string = "password";
  icon_eyes : string =""
  countries!: ICountry[] | undefined;  
  cities!: ICity[] | undefined;  
  selectedCountry!: any;  
  selectedCity!: any;  
  picture: any = false;  
  selectedFile: any = null;  
  fileError: string | null = null;  
  user!: User;  
  userSub?: Subscription; 
  images : any = false;
  errorMessage : string = '';
  user_logged : any;
  user_di_loggged : number = 0;
  isModalOpen: boolean = false;


  constructor(  
    private fb: FormBuilder,  
    private localStorage: LocalStorageService,  
    private entityService: EntityServiceService,  
    private router: Router,  
    private notification: NoficationsService  
  ) {  
    this.profileForm = this.fb.group({  
      username: ['', Validators.required],  
      last_name: [''],  
      first_name: [''],  
      email: ['', [Validators.required, Validators.email]],  
      // password: ['', Validators.required],  
      whatsapp_number: ['', [Validators.maxLength(16), Validators.minLength(9)]],  
      number: [''],  
      site_url: [''],  
      neighborhood: [''],  
      country: [''],  
      city: [''],  
      // cni: [''],  
      // picture: [''] ,
      sex: ['']  
    });  
  }  

  ngOnInit(): void {  
    window.scroll(0, 0);  
    this.user = this.localStorage.getItem('user');  
    this.picture = this.user.picture ? this.user.picture : false ;  
    this.countries = Country.getAllCountries();  
    this.selectedCountry = this.user.country;  
    this.cities = City.getCitiesOfCountry(this.selectedCountry);  
    this.selectedCity = this.user.city;  

    this.profileForm.patchValue({ // Remplissage initial du formulaire  
      username: this.user.username ? this.user.username : '',  
      last_name: this.user.last_name ?  this.user.last_name : '',  
      first_name: this.user.first_name ? this.user.first_name : '',  
      email: this.user.email ? this.user.email : '',  
      whatsapp_number: this.user.whatsapp_number,  
      number: this.user.number ? this.user.whatsapp_number : '' ,  
      site_url: this.user.site_url ?this.user.site_url : '',  
      neighborhood: this.user.neighborhood ? this.user.neighborhood : '',  
      city: this.user.city ? this.user.city : '',  
      country: this.user.country ? this.user.country : '',  
      // cni: this.user.cni ? this.user.cni : '',
      sex: this.user.sex ? this.user.sex : ''  
    });  
  }  

  async onCountryChange(event: any) {  
    const countryCode = event.target.value;  
    this.cities = City.getCitiesOfCountry(countryCode);  
  }  

  UpdateProfil() {      
    if (this.profileForm.invalid || this.fileError) {  
      return;  
    }  

    const formData = new FormData();  
    const formValues = this.profileForm.value;  

    for (const field in formValues) {  
      formData.append(field, formValues[field] || ''); // Ajouter les données du formulaire  
    }  

    if (this.selectedFile) {  
      formData.append('picture', this.selectedFile);  
    }  

    this.user_logged = this.localStorage.getItem('user');  
    
    const user_id = this.user_logged ? this.user_logged.id : '';
    this.user_di_loggged = this.user_logged ? this.user_logged.id : '';
    const notif = new Notification();  
    const entity = "advertiser_back/update";  

    this.entityService.update(user_id, formData, entity).subscribe({
      next : (datas : any) =>{
        
        if(datas.success === true){
          this.router.navigate(['/admin/myAccount']);
          notif.message = "Informations mise à jour avec success"
          notif.status = "success"
          // this.router.navigate(['/admin']);   
        }else{
          notif.message = "erreur lors de l'enregistrement des modifications"
          notif.status = "warning"
          this.notification.emitNotification(notif)
        }
      },

      error: (error : any) => {
        notif.message = "Nous sommes désolé mais le serveur est momentanement indisponible"
        notif.status = "warning"
        this.notification.emitNotification(notif);
      },

      // recuperation du user et mise à jour du local storage .
      complete: ( ) => {
        const entyt = 'advertiser_back/show/';
        this.userSub = this.entityService.getAdvertiser(this.user_di_loggged, entyt).subscribe({
          next: (data : any) => {
            if (data.success === true) {
              this.localStorage.setItem('user', data.data);
            }
          },
          error: (error : any) => {
            console.log(error);
          }
        })
      }
    });

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
    
    if (!is_image(file_image)) {  
      this.errorMessage = "Erreur, ceci n'est pas une image !";  
    }  

    this.errorMessage = "";  
    const file_reader = new FileReader();    
    file_reader.readAsDataURL(file_image);
      
    file_reader.onload = () => {  
      this.picture = file_reader.result as string ;
      // this.user.picture = this.picture ;

      //  this.updateUser.picture = this.picture ;

    };  
  }

  chanIcon(event : any){
    this.type = (this.type === "password") ?  "text"  : "password" ;

    this.icon_eyes = (this.icon_eyes === "") ?  "-slash"  : "" ;
  }

  openModalPassword($event: any) {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }  

  changePassword() {
    setTimeout(() => {
      console.log('Formulaire soumis avec succès !');
      this.closeModal(); // Ferme le modal après l'instruction
    }, 1000);
  }

}
