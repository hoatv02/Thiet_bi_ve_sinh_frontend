import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../services/auth.service';
import { UserInfo } from '../../../models/login.model';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, LucideAngularModule, RouterLink, NzDropDownModule,NzModalModule,
    RouterLinkActive,],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {

  public user: UserInfo;

  constructor(private authService: AuthService, private modal: NzModalService) {
    this.user = {
      fullName: '',
      role: '',
    }
  }


  ngOnInit(): void {
    this.user = this.authService.getUser()
  }

  logout() {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc muốn đăng xuất?',
      nzContent: 'Khi bấm xác nhận, tài khoản sẽ được đăng xuất khỏi thiết bị đang sử dụng.',
      nzOkText: 'Xác nhận',
      nzCancelText: 'Huỷ',
      nzCentered: true,
      nzIconType: 'question-circle',
      nzOnOk: () => {
        location.href = 'auth/logout';
      }
    });
  }

}
