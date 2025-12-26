import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<any>();


  constructor(private http: HttpClient, private toastr: ToastrService, private authService: AuthService) { }

  email = '';
  password = '';
  loading = false;

  closeModal() {
    this.close.emit();
  }

  login() {
    if (!this.email || !this.password) {
      this.toastr.warning('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    this.loading = true;

    this.http
      .post(`${environment.API_ROOT}/Auth/login`, {
        email: this.email,
        password: this.password
      })
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.toastr.success('Đăng nhập thành công!');
          console.log('Login response:', res);

          if (res?.token) {
            this.authService.setLogin(res.token, res.user);
          }
          this.loginSuccess.emit(res.user);
          this.closeModal();
        },
        error: (err) => {
          this.loading = false;



          const message =
            err.error?.message ||
            err.error?.title ||
            'Đăng nhập thất bại. Vui lòng thử lại.';

          console.error('Login error:', message);

          this.toastr.error(message);
        }
      });
  }
}
