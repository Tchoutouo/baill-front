import { Component } from '@angular/core';
import { LocalStorageService } from '../../../services/admin/local-storage.service';
import { User } from '../../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent {
  type : string = "password";

  icon_eyes : string =""

  user: User | undefined ;

  constructor (private localStorage : LocalStorageService){

  }

  ngOnInit(){
    this.user  = this.localStorage.getItem('user');
  }

  chanIcon(event : any){
    this.type = (this.type === "password") ?  "text"  : "password" ;

    this.icon_eyes = (this.icon_eyes === "") ?  "-slash"  : "" ;

   
  }

 
}
