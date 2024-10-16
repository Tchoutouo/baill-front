import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';

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
  private value : any = false ;

  
  constructor(private http : HttpClient, private localStorage : LocalStorageService, private router: Router) { 
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

          const data :  LoginResponse = {
                            isSuccess: true,
                            token:"",
                            user: result.data
                        };
                        
          this.localStorage.setItem('token', data.token);
          this.localStorage.setItem('user', data.user);
          this.authUser = true ;
          this.router.navigate(['/admin']);  
          this.value = true;
        }else{
          this.value = false;
        }
        
      },

      error : (error : any)=>{
        console.log(error);
      }

    })

    return this.value ;
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
