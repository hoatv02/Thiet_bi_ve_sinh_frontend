import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class BaseService {
  protected baseUrl = environment.API_ROOT;
  private token = localStorage.getItem('token');
  private headers: HttpHeaders;

  constructor(protected http: HttpClient) {
    this.headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
  }

  protected httpGet<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${url}`);
  }
  protected httpGetWithParams<T>(url: string, params: any): Observable<T> {
    let httpParams = new HttpParams();
    Object.keys(params || {}).forEach(key => {
      const value = params[key];
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value);
      }
    });

    return this.http.get<T>(`${this.baseUrl}/${url}`, { params: httpParams });
  }

  protected httpPost<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${url}`, body, { headers: this.headers });
  }

  protected httpPut<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${url}`, body, { headers: this.headers });
  }

  protected httpDelete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${url}`, { headers: this.headers });
  }

  protected httpPostFile(url: string, body: any): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/${url}`, body, { headers: this.headers, responseType: 'blob' });
  }
}
