import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {inject} from "@angular/core";

export const roles: any = {
  partner: {
    "/": "ALL",
  },
  inspector: {
    "/": "ALL",
    "/partners": {
      list: true,
      actionsButtonColum: true
    },
    "/plots": "ALL",
    "/plots/inspection/:plotsId/:producerId": {
      create: true,
      delete: true,
      detail: true,
    },
  },
  admin: {
    "/": "ALL",
    "/association": "ALL",
    "/partners": "ALL",
    "/plots": "ALL",
    "/plots/inspection/:plotsId/:producerId": {
      create: true,
      delete: true,
      detail: true,
    },
    "/users": "ALL",
  }
}

export const authGuard:CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot)  => {
  const router = inject(Router);

  if (validateRules(state.url)) {
    return true;
  } else {
    router.navigate(['/login']).then();
    return false;
  }
};

const matchesPattern = (route: string, pattern: string): boolean => {
  const regex = new RegExp('^' + pattern.replace(/:[^\s/]+/g, '[^/]+') + '$');
  return regex.test(route);
}

export const validateRules = (currentUrl: string): boolean => {
  const isAuthenticated = localStorage.getItem('authToken');
  const role = localStorage.getItem('role');

  if (isAuthenticated && role) {
    const allowedRoutes = roles[role] || {};

    for (const allowedRoute in allowedRoutes) {
      if (matchesPattern(currentUrl, allowedRoute)) {
        return true;
      }
    }
  }
  return false;
}

export const validateActionRules = (currentUrl: string, action: string): boolean => {
  const isAuthenticated = localStorage.getItem('authToken');
  const role = localStorage.getItem('role');

  if (isAuthenticated && role) {
    const allowedRoutes = roles[role] || {};

    for (const allowedRoute in allowedRoutes) {
      if (matchesPattern(currentUrl, allowedRoute) && (allowedRoutes[allowedRoute]=="ALL" || allowedRoutes[allowedRoute][action])) {
        return true;
      }
    }
  }
  return false;
}
