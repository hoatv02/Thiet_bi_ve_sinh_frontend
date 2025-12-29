import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginRequest, LoginResponse, UserInfo } from '../../../models/login.model';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public form: LoginRequest;
  public isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private notifyService: NzNotificationService,
  ) {
    this.form = {
      email: '',
      password: '',
    }
  }

  login() {
    this.isLoading = true;
    this.authService.login(this.form)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next: (res: any) => {
        const user: UserInfo = {
          fullName: res.fullName,
          role: res.role,
        }
        this.authService.setLogin(res.token, user);
        const check = this.authService.getUser();
        if(check.role == 'Admin') {
          location.href = '/admin';
        } else {
          location.href = '/';
        }
      },
      error: (err) => {
        this.isLoading = false;
        const message =
          err.error?.message ||
          err.error?.title ||
          '❌ Lỗi khi đăng nhập. Vui lòng thử lại.';
        this.notifyService.create('error', 'Thất bại', message);
      },
    })
  }
}
