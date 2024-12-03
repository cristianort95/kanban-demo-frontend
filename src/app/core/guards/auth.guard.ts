import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const isValid = validateRules();

  if (isValid) return true
  else {
    inject(Router).navigate(['/login']);
    return false;
  }
};

export const validateRules = (): boolean => {
  return !!localStorage?.getItem('authToken');
}
