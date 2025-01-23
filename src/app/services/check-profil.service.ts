import { Injectable } from '@angular/core';
import { LocalStorageService } from './admin/local-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CheckProfilService {

  constructor(
    private localStorage: LocalStorageService,
    private router: Router
  ) {}

  isAdmin(): boolean {
    const user = this.localStorage.getItem('user');
    console.log("user", user)

    if (user) {
      if (user.profil_code === 'SUP_ADMIN') {
        return true;
      }else{
        return false;
      }
    } else {
      this.router.navigate(['/admin']);
      return false;
    }
  }
}
