import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatorService {

  private authUser = false;
  csrfToken: string | null = null;

  constructor(private http : HttpClient, private localStorage : LocalStorageService, private router: Router) {
    const token = this.localStorage.getItem('token')
    const user_ = this.localStorage.getItem('user')
    if (user_ && token) {
      this.authUser = true ;
    }
  }

  signin(user: any): Observable<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<any>(environment.apiUrl + 'login', user, { headers }).pipe(
      tap((result) => {
        if (result.success) {
          this.localStorage.setItem('token', result.token);
          this.localStorage.setItem('user', result.data);
          this.authUser = true;
          this.router.navigate(['/admin']);
        }
      }),
      map((result) => result.success === true)
    );
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
      return user.profil_code ;
    }else{
      return 'false' ;
    }
  }

  fetchCsrfToken() {
    return this.http.options(environment.apiUrl+'csrf-token');
  }

  saveCsrfToken(token: string) {
    this.csrfToken = token;
  }

  isLoggedIn(): any {
    const user = this.localStorage.getItem('user');
    return user ? user : false;
  }
}
