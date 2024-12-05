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

  
  constructor(private http : HttpClient, private localStorage : LocalStorageService, private router: Router) { 
    const token = this.localStorage.getItem('token')
    const user_ = this.localStorage.getItem('user')
    if (user_ && token) {
      this.authUser = true ;
    }
  }
  
  signin(user: any) {  
    // Définir les headers nécessaires  
    const headers = new HttpHeaders({  
        'Content-Type': 'application/json',  
        'Accept': 'application/json'  
        // Vous pouvez ajouter d'autres headers si nécessaire, par exemple pour l'authentification  
    });  

    this.http.post(environment.apiUrl + "login", user).subscribe({  
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
  
}
