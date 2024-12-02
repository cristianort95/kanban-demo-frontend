import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  get headers() {
    return new HttpHeaders({})
  }

  constructor(private httpClient: HttpClient) {}

  get(url: string): Observable<any> {
    return this.httpClient.get<any>(url, {headers: this.headers});
  }

  post(url: string, data?: any, isMultiPart = false): Observable<any> {
    if (isMultiPart) {
      const formData = new FormData();
      Object.keys(data).forEach((key: string) => {
        const item = { name: key, value: data[key].file ?? data[key]}
        formData.append(item.name, item.value)
      })
      return this.httpClient.post<any>(url, formData, {headers: this.headers});
    }
    return this.httpClient.post<any>(url, data, {headers: this.headers});
  }

  patch(url: string, data?: any, isMultiPart = false): Observable<any> {
    if (isMultiPart) {
      const formData = new FormData();
      Object.keys(data).forEach((key: string) => {
        const item = { name: key, value: data[key].file ?? data[key]}
        formData.append(item.name, item.value)
      })
      return this.httpClient.patch<any>(url, formData, {headers: this.headers});
    }
    return this.httpClient.patch<any>(url, data, {headers: this.headers});
  }

  delete(url: string): Observable<any> {
    return this.httpClient.delete<any>(url, {headers: this.headers});
  }
}
