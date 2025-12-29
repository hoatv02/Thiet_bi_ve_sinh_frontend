import { Injectable } from '@angular/core';
import { BaseService } from './base/base.service';
import { LoginRequest, RegisterRequest, ResetPasswordRequest, UserInfo } from '../models/login.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService{
  private TOKEN_KEY = 'token';
  private USER_KEY = 'user';

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  setLogin(token: string, user: UserInfo) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  login<T>(body: LoginRequest): Observable<T> {
    return this.httpPost('auth/login', body);
  }

  registry<T>(body: RegisterRequest): Observable<T> {
    return this.httpPost('auth/register', body);
  }

  resetPasword<T>(body: ResetPasswordRequest): Observable<T> {
    return this.httpPost('auth/reset-password', body);
  }
}
