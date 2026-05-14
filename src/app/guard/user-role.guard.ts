import { CanActivateFn, Router } from '@angular/router';
import { AuthenticatorService } from '../services/admin/authenticator.service';
import { inject } from '@angular/core';

export const userRoleGuard: CanActivateFn = (route, state) => {

  const myService = inject(AuthenticatorService);
  const router = inject(Router);

  if (!myService.isAuthenticated()) {
    router.navigateByUrl('/signin');
    return false;
  }

  if (myService.getUserRole() === 'ADVERT') {
    router.navigateByUrl('/access-interdit');
    return false;
  }

  return true;
};
