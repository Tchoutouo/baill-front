import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { getSiteName } from '../../../helpers/helper';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [TranslateModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  site_name: string = ""

  typeField : string = "password";

  icon_eyes : string = "";
  display : string = "none";
  // <i class="fa-solid fa-eye-slash"></i>
  constructor(){}

  ngOnInit() {
    this.site_name = getSiteName();
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
  
}
