import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { getSiteName } from '../../../helpers/helper';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticatorService } from '../../../services/admin/authenticator.service';
import { CommonModule } from '@angular/common';


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

  isSubmited : boolean = false

  icon_eyes : string = "";
  display : string = "none";

  loginForm : any;
  email : FormControl
  password : FormControl

  email_error_message : string = "L'e-mail est obligatoire !"
  password_error_message : string = "Le mot de passe est obligatoire !"

  constructor(private authService : AuthenticatorService, private fb: FormBuilder){
    this.email = fb.control("", [Validators.required , Validators.email] );
    this.password = fb.control("", [Validators.required])
  }

  ngOnInit() {
    this.site_name = getSiteName();

    this.loginForm = this.fb.group({
        email:this.email,
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
    this.authService.signin(user)
    
  }

  get formControls(){
    return this.loginForm.controls
  }
  
}
