import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatorService {

  private authUser = false;

  constructor(private http : HttpClient, private localStorage : LocalStorageService, private router: Router) {
    // Auth state is maintained via HttpOnly cookie — check user info only
    const user_ = this.localStorage.getItem('user');
    if (user_) {
      this.authUser = true;
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
          // Token is stored in HttpOnly cookie by the backend — not in localStorage
          this.localStorage.setItem('user', result.data);
          this.authUser = true;
          this.router.navigate(['/admin']);
        }
      }),
      map((result) => result.success === true)
    );
  }

  logOut(): Observable<any> {
    return this.http.post(environment.apiUrl + 'logout', {}).pipe(
      tap(() => {
        this.localStorage.removeItem('user');
        this.authUser = false;
      })
    );
  }

  isAuthenticated(): boolean {
    return this.authUser;
  }

  getUserRole(): string {
    const user = this.localStorage.getItem('user');
    return user ? user.profil_code : 'false';
  }

  isLoggedIn(): any {
    const user = this.localStorage.getItem('user');
    return user ? user : false;
  }
}
