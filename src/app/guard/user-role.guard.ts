import { CanActivateFn, Router } from '@angular/router';
import { AuthenticatorService } from '../services/admin/authenticator.service';
import { inject } from '@angular/core';

export const userRoleGuard: CanActivateFn = (route, state) => {

  const myService = inject(AuthenticatorService);
  const router = inject(Router);

  if(myService.isAuthenticated()) {
    if (myService.getUserRole() === 'ADVERT') {
      router.navigateByUrl('/access-interdit')
        return false;
    }else{
      return true ;
    }
  }else{
    router.navigateByUrl('/signin')
  }

  return true;
};
