import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from "rxjs";

interface ErrorHttpCustom {
  statusCode: number;
  message: string;
  data: any;
}

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let customError: ErrorHttpCustom;
      if (error.error instanceof ErrorEvent) {
        customError = {
          statusCode: error.status,
          message: error.message || 'Client-side error',
          data: error.error,
        };
      } else {
        customError = {
          statusCode: error.status || 400,
          message: error.message || 'An unexpected error occurred',
          data: error.error || null,
        };
      }
      if (error.status == 403) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('role')
        window.location.reload()
      }
      return throwError(() => customError);
    }),
  );
};
