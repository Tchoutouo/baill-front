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

    if (user) {
      return user.profil_name === 'SUPER_ADMIN';
    } else {
      this.router.navigate(['/admin']);
      return false;
    }
  }
}
