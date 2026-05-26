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

  signin(user: any): Observable<{ success: boolean; reason?: string }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<any>(environment.apiUrl + 'login', user, { headers }).pipe(
      tap((result) => {
        if (result.success) {
          this.localStorage.setItem('user', result.data);
          this.authUser = true;
          this.router.navigate(['/admin']);
        }
      }),
      map((result) => ({ success: result.success === true, reason: result.reason }))
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

  forgotPassword(email: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<any>(environment.apiUrl + 'forget-password', { email });
  }

  verifyResetToken(token: string, email: string): Observable<{ success: boolean }> {
    return this.http.get<any>(`${environment.apiUrl}reset-password/${token}/${email}`);
  }

  resetPassword(payload: { token: string; email: string; password: string; password_confirmation: string }): Observable<{ success: boolean; message: string }> {
    return this.http.post<any>(environment.apiUrl + 'reset-password', payload);
  }

  verifyEmail(token: string, email: string): Observable<{ success: boolean; already_verified?: boolean; reason?: string }> {
    return this.http.get<any>(`${environment.apiUrl}verify-email/${token}/${email}`);
  }
}
