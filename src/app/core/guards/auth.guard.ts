import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {inject} from "@angular/core";

export const authGuard:CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot)  => {
  const router = inject(Router);
  if (validateRules()) {
    return true;
  } else {
    router.navigate(['/login']).then();
    return false;
  }
};

export const validateRules = (): boolean => {
  if (typeof window !== 'undefined') {
    const isAuthenticated = localStorage.getItem('authToken');
    if (isAuthenticated) return true
  }
  return false;
}
