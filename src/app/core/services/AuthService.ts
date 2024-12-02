import { Injectable } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import {CrudService} from "./CrudService";
import {LOGIN} from "../endpoints";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  constructor(private service: CrudService) {}

  login(username: string, password: string): Observable<boolean> {
    const result = new Subject<boolean>();
    this.service.post(LOGIN, {
      username, password
    }).subscribe((response: any) => {
      const jwt = response.jwt
      const decoded: any = jwtDecode(jwt);
      if (jwt && decoded) {
        localStorage.setItem('authToken', jwt)
        localStorage.setItem('role', decoded.role ?? null)
        result.next(true)
      } else result.next(false)
    }, (error: HttpErrorResponse) => {
      result.next(false)
    })
    return result
  }

  logout() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('role')
    window.location.reload()
  }
}
