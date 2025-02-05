import { CanActivateFn } from '@angular/router';

export const canAccessGuard: CanActivateFn = (route, state) => {
  return true;
};
