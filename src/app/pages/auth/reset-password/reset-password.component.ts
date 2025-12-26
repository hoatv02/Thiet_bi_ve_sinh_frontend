import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs';
import { ResetPasswordRequest } from '../../../models/login.model';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  public form: any;
  public showPassword1 = false;
  public showPassword2 = false;
  public passwordMismatch = false;
  public isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notifyService: NzNotificationService,
  ) {
    this.form = {}
  }

  login() {
    this.isLoading = true;
    if(this.passwordMismatch) {
      return;
    }
    const body: ResetPasswordRequest = {
      email: this.form.email,
      password: this.form.password,
      newPassword: this.form.passwordNew,
    }
    this.authService.resetPasword(body)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: any) => {
          this.router.navigateByUrl('/auth/login');
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

  back() {
    this.router.navigateByUrl('/auth/login');
  }

  checkPasswordMatch() {
    this.passwordMismatch =
      this.form.passwordNew !== this.form.confirmPassword &&
      this.form.confirmPassword !== '';
  }
}
