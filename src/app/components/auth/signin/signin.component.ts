import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { getSiteName } from '../../../helpers/helper';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticatorService } from '../../../services/admin/authenticator.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [TranslateModule, RouterLink, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  site_name: string = ""

  typeField : string = "password";

  loginResult : any = null

  isSubmited : boolean = false

  message_back : any = null

  icon_eyes : string = "";
  display : string = "none";

  loginForm : any;
  identifiant : FormControl
  password : FormControl

  email_error_message : string = "L'e-mail est obligatoire !"
  password_error_message : string = "Le mot de passe est obligatoire !"

  constructor(private authService : AuthenticatorService, private fb: FormBuilder){
    this.identifiant = fb.control("", [Validators.required] );
    this.password = fb.control("", [Validators.required])
  }

  ngOnInit() {
    this.site_name = getSiteName();

    this.loginForm = this.fb.group({
        identifiant:this.identifiant,
        password:this.password,
    })

    
  }

  toggleIconClass(event : any){
    this.typeField = (this.typeField === "password") ?  "text"  : "password" ;

    this.icon_eyes = (this.icon_eyes === "") ?  "-slash"  : "" ;

    console.log(event);
  }

  showIcon(event : any){
    const {name, value} = event.target
    
    if (value.length >= 1) {
      this.display = "";
    }

    if(value.length == 0){
      this.display = "none";
    }
  }
  
  handleSubmite(){
    
    this.isSubmited = true ;

    if (this.loginForm.invalid) {
    }
    
    const user = this.loginForm.value ;

    this.loginResult = this.authService.signin(user)
    
    if (this.loginResult == false) {
      this.loginResult = false;
    }else{
      this.loginResult = true;
    }
    this.displayM()
  }

  displayM(){

    let  messag  = ""

    if (!this.loginResult) {
      messag = "Les informations d'identification ne sont pas correctes." ;
    }else{
      messag = "" ;
    }

    this.message_back = messag
  }

  

  get formControls(){
    return this.loginForm.controls
  }

 
  
}
