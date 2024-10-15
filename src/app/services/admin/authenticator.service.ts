import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

interface LoginResponse{
  isSuccess : boolean,
  token : string,
  user:User,
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticatorService {

  private authUser = false;

  constructor(private http : HttpClient, private localStorage : LocalStorageService) { 
    const token = this.localStorage.getItem('token')
    const user_ = this.localStorage.getItem('user')
    if (user_ && token) {
      this.authUser = true ;
    }
  }
  
  signin(user : any){
    this.http.post(environment.apiUrl+"login", user).subscribe({
      next : (result : any )=>{
        if(result.success){
          const data : LoginResponse = result ;
          this.localStorage.setItem('token', data.token);
          this.localStorage.setItem('user', data.user);
          this.authUser = true ;
        }
        console.log(result);
      },

      error : (error : any)=>{
        console.log(error);
      }

    })
  }

  logOut(){
    this.localStorage.removeItem("token");
    this.localStorage.removeItem("user");
    this.authUser = true ;
  }

  isAuthenticated(): boolean {
    return this.authUser;
  }
  
}
