import { CanActivateFn, Router } from '@angular/router';
import { AuthenticatorService } from '../../app/services/admin/authenticator.service';
import { inject } from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  const myService = inject(AuthenticatorService);
  const router = inject(Router);

  if(!myService.isAuthenticated()) {
    router.navigateByUrl('/signin')
      return false
  }

  return true;
};
