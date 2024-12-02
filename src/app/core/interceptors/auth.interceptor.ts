import {HttpInterceptorFn} from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
  });
  return next(req);
};
