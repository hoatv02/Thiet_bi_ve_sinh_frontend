import { Component } from '@angular/core';
import { RegisterRequest } from '../../../models/login.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  public form: RegisterRequest;

  constructor(
    private authService: AuthService,
    private notifyService: NzNotificationService,
    private router: Router,
  ) {
    this.form = {
      fullName: '',
      email: '',
      phone: '',
      dob: new Date(),
      password: ''
    }
  }

  signup() {
    this.authService.registry(this.form).subscribe({
      next: () => {
        this.notifyService.success("Thành công", "Đăng ký tài khoản thành công!");
        setTimeout(() => {
          this.router.navigateByUrl('/auth/login');
        }, 1000); // 
      },
      error: (err) => {
        const message =
          err.error?.message ||
          err.error?.title ||
          '❌ Lỗi khi đăng nhập. Vui lòng thử lại.';
        this.notifyService.create('error', 'Thất bại', message);
      }
    })
  }
}
