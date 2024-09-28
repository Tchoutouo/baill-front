import { Component } from '@angular/core';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent {
  type : string = "password";

  icon_eyes : string =""

  constructor (){

  }

  ngOnInit(){

  }
  chanIcon(event : any){
    this.type = (this.type === "password") ?  "text"  : "password" ;

    this.icon_eyes = (this.icon_eyes === "") ?  "-slash"  : "" ;

   
  }

 
}
