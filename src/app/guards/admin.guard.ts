import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService,) { }

  canActivate(): boolean {
    const check = this.authService.getUser();
    if (check?.role == 'Admin') {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
