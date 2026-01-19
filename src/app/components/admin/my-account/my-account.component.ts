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
import { is_image, requireLogin } from '../../../helpers/helper';  
import { NoficationsService } from '../../../services/nofications.service';  
import { environment } from '../../../../environments/environment.development';  
import { Subscription } from 'rxjs';  

@Component({  
  selector: 'app-my-account',  
  standalone: true,  
  imports: [CommonModule, ReactiveFormsModule, TranslateModule,FormsModule],  
  templateUrl: './my-account.component.html',  
  styleUrl: './my-account.component.css' // Correction de "styleUrl"  
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
  apiRessources : string = environment.apiUrlRessources;
  images : any = false;
  errorMessage : string = '';
  user_logged : any;
  user_di_loggged : number = 0;
  isModalOpen: boolean = false;
  password: string = '';
  new_password: string = '';
  confirm_password: string = '';


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
      sex: ['', Validators.required]  
    });  
  }  

  ngOnInit(): void {  
    window.scroll(0, 0);  
    this.user = this.localStorage.getItem('user');  
    // this.user = requireLogin();  
    // const user = requireLogin();
    if (!this.user) return;
    this.picture = this.user.picture ? environment.apiUrlRessources + '/' + this.user.picture : '' ;  
    this.countries = Country.getAllCountries();  
    this.selectedCountry = this.user.country;  
    this.cities = City.getCitiesOfCountry(this.selectedCountry);  
    this.selectedCity = this.user.city;  

    this.profileForm.patchValue({ // Remplissage initial du formulaire  
      username: this.user.username ? this.user.username : '',  
      last_name: this.user.last_name ?  this.user.last_name : '',  
      first_name: this.user.first_name ? this.user.first_name : '',  
      email: this.user.email ? this.user.email : '',  
      whatsapp_number: this.user.whatsapp_number ? this.user.whatsapp_number.toString() : '',
      number: this.user.number ? this.user.number.toString() : '',
      site_url: this.user.site_url ?this.user.site_url : '',  
      neighborhood: this.user.neighborhood ? this.user.neighborhood : '',  
      city: this.user.city ? this.user.city : '',  
      country: this.user.country ? this.user.country : '',  
      // cni: this.user.cni ? this.user.cni : '',
      sex: this.user.sex ? this.user.sex : ''  
    });  

    console.log(this.user, 'yoo');
    
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
      const value = formValues[field];

      if (field === 'whatsapp_number') {
        formData.append(field, value !== undefined && value !== null ? value.toString() : '');
      } else {
        formData.append(field, value !== undefined && value !== null ? value : '');
      }
    }

    if (this.selectedFile) {  
      formData.append('picture', this.selectedFile);  
    }  

    this.user_logged = this.localStorage.getItem('user');  
    
    const user_id = this.user_logged ? this.user_logged.id : '';
    this.user_di_loggged = this.user_logged ? this.user_logged.id : '';
    const notif = new Notification();  
    const entity = "advertiser_back/update";  
    let message;
    let type;
    this.entityService.update(user_id, formData, entity).subscribe({
      next : (datas : any) =>{
        // console.log(datas);
        
        if (datas.success === true) {
          this.router.navigate(['/admin/myAccount']);
          message = 'Profil mis à jour avec succeès';
          type = 'success';
        }else{
          message = 'Erreur lors de la mise à jour de votre profil veuillez contacter l\administrateur';
          type = 'warning';
        }
        this.handleNotification(message, type)
        
      },

      error: (error : any) => {
        message = 'Erreur lors de la mise à jour de votre profil veuillez contacter l\administrateur';
        type = 'warning';
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

            console.log('error inside complete after update user', error);
         
          }
        })
      }
    });

  }

  handleAddImage(event : any){
    const input_file : any = document.querySelector("#images")
    if (input_file) {
      input_file.click();
    }
  }

  addImage(event: any) {  
    const files = event.target.files; 
    const file_image = files[0];
    // console.log(file_image);
    
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
    this.password = '';
    this.new_password = '';
    this.confirm_password = '';
  }  

  // changePassword( new_password: string, old_ppassword :string) {

  //   // Étape 1 : créer un tableau ou un objet avec les deux valeurs
  //   const passwords = {
  //     new_password: new_password,
  //     password: old_ppassword
  //   };

  //   // Étape 2 : encoder en JSON
  //   const encodedDatas = JSON.stringify(passwords);
  
  //   const id = this.localStorage.getItem('user')?.id;


  //   if (id) {
  //     this.entityService.updatePassword(id, encodedDatas).subscribe({
  //       next: (data : any) => {
  //           let message = ''
  //           let type = ''
  //           console.log(data);
            
  //         if (data.success === true) {
  //            message = 'Mot de passe modifié avec success';
  //            type = 'success';
  //         }else{
  //           message = 'Mot de passe actuel invalide';
  //           type = 'warning';
  //         }
  //         this.handleNotification(message, type)
  //       },
  //       error: (error : any) => {
  //         console.log(error);
  //       }
  //     })
  //   }else{
  //     this.router.navigate(['/signin']);  
  //   }
  //   setTimeout(() => {
  //     console.log('Formulaire soumis avec succès !');
  //     this.closeModal(); // Ferme le modal après l'instruction
  //   }, 1000);
  // }

  changePassword() {
    if (!this.password || !this.new_password || this.new_password !== this.confirm_password) {
      // Optionnel : message d'erreur
      return;
    }

    const passwords = {
      password: this.password,
      new_password: this.new_password,
      confirm_password: this.confirm_password
    };

    const id = this.localStorage.getItem('user')?.id;
    // const encodedDatas = JSON.stringify(passwords);

    if (id) {
      this.entityService.updatePassword(id, passwords).subscribe({
        
        next: (data: any) => {
          // console.log(data);
          const type = data.success ? 'success' : 'warning';
          const message = data.message ? data.message : 'erreur lors de la mise à jour de votre mot de passe veuilez contacter l\'administrateur';
          this.handleNotification(message, type);
        },
        error: (err) => console.log(err)
      });
    } else {
      this.router.navigate(['/signin']);
    }

    setTimeout(() => {
      this.closeModal();

      this.router.navigate(['/admin/myAccount']);
    }, 1000);
  }

  private handleNotification(message: any, type:string) {
    const notif = new Notification();
    notif.message = message;
    notif.status = type;
    this.notification.emitNotification(notif);
  }

  private handleError(error: any) {
    // console.error("Création d'annonce", error);
    const notif = new Notification();
    notif.message = "Erreur lors de l'enregistrement, contacter l'administrateur !";
    notif.status = "warning";
    this.notification.emitNotification(notif);
  }


getPasswordStrength(): string {
  const password = this.new_password;
  if (!password) return 'weak';

  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score >= 5) return 'strong';
  if (score >= 3) return 'medium';
  return 'weak';
}

getPasswordStrengthPercentage(): number {
  switch (this.getPasswordStrength()) {
    case 'weak': return 33;
    case 'medium': return 66;
    case 'strong': return 100;
    default: return 0;
  }
}

}
