import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment.development';

@Injectable()
export class BaseService {
  protected apiUrl: string;

  constructor(protected http: HttpClient) {
    this.apiUrl = environment.apiUrl + '/api';
  }

  get<T>(url: string, options?: any) {
    return this.http.get<T>(`${this.apiUrl}/${url}`, options);
  }

  post<T>(url: string, body: any, options?: any) {
    return this.http.post<T>(`${this.apiUrl}/${url}`, body, options);
  }

  put<T>(url: string, body: any, options?: any) {
    return this.http.put<T>(`${this.apiUrl}/${url}`, body, options);
  }

  delete<T>(url: string, options?: any) {
    return this.http.delete<T>(`${this.apiUrl}/${url}`, options);
  }
}
