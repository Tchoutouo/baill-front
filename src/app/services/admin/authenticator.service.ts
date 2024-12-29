import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';

interface LoginResponse{
  success : boolean,
  user:User,
  token : string,
  redirect_url: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticatorService {

  private authUser = false;
  private value : any = false ;
  csrfToken: string | null = null;  

  
  constructor(private http : HttpClient, private localStorage : LocalStorageService, private router: Router) { 
    const token = this.localStorage.getItem('token')
    const user_ = this.localStorage.getItem('user')
    if (user_ && token) {
      this.authUser = true ;
    }
  }
  
  signin(user: any) {  
    // const csrfToken  = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    
    console.log({token : this.getCsrfToken()});
    // Définir les headers nécessaires  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }); 


    
    this.http.post(environment.apiUrl+'login', user).subscribe({  
        next: (result: any) => {  
          console.log(result);
          
            if (result.success) {  
                const data: LoginResponse = {  
                    success: true,  
                    user: result.data,  
                    token: result.token,  
                    redirect_url: result.redirect_url  
              };  
                console.log("redirect_url", result.redirect_url);  
                this.localStorage.setItem('token', data.token);  
                this.localStorage.setItem('user', result.data);  
                this.authUser = true;  
                this.router.navigate(['/admin']);  
                this.value = true;  
            } else {  
                this.value = false;  
            }  

        },  
        error: (error: any) => {  
            console.log(error);  
        }  
    });  

    return this.value;  
  }
  


  logOut(){
    this.localStorage.removeItem("token");
    this.localStorage.removeItem("user");
    this.authUser = false ;
  }

  isAuthenticated(): boolean {
    return this.authUser;
  }

  getUserRole(){
    const user = this.localStorage.getItem('user')
    if (user) {
      return user.profil_name ;
    }else{
      return 'false' ;
    }
  }


  fetchCsrfToken() {  
    console.log({cedric : environment.apiUrl+'csrf-token'});
    return this.http.options(environment.apiUrl+'csrf-token');  
  }  

  saveCsrfToken(token: string) {  
    this.csrfToken = token;  
  }  

  private getCsrfToken(): string {
    // Méthode pour récupérer le token CSRF depuis le cookie
    const name = 'XSRF-TOKEN=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
    c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
    return c.substring(name.length, c.length);
    }
    }
    return '';
    }
    
  
}
