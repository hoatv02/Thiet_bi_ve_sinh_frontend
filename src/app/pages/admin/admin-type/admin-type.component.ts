import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TypeService } from '../../../services/type.service';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-admin-type',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, NzModalModule],
  templateUrl: './admin-type.component.html'
})
export class AdminTypeComponent {

  types: any[] = [];
  searchText = '';

  isSearchOpen = true;
  isModalOpen = false;

  editingType: any = null;

  form = {
    name: '',
    slug: ''
  };

  constructor(
    private typeService: TypeService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.getTypes();
  }

  toggleSearchPanel() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  getTypes() {
    this.loadingService.show();

    this.typeService.getTypesList().subscribe({
      next: (res) => {
        this.types = res.filter(x =>
          this.searchText === '' ||
          x.name.toLowerCase().includes(this.searchText.toLowerCase())
        );
        this.loadingService.hide();
      },
      error: () => {
        this.notification.error('Lỗi', 'Không tải được danh sách loại');
        this.loadingService.hide();
      }
    });
  }

  openCreateModal() {
    this.isModalOpen = true;
    this.editingType = null;
    this.form = { name: '', slug: '' };
  }

  editType(type: any) {
    this.isModalOpen = true;
    this.editingType = type;
    this.form = {
      name: type.name,
      slug: type.slug
    };
  }

  saveType() {
    const body = { ...this.form };
    this.loadingService.show();

    if (this.editingType) {
      // Cập nhật
      this.typeService.update(this.editingType.id, body).subscribe({
        next: (res: any) => {
          if (res?.success) {
            this.notification.success('Thành công', res.message || 'Cập nhật thành công');
            // cập nhật trực tiếp danh sách nếu muốn tối ưu
            this.getTypes();
            this.closeModal();
          } else {
            this.notification.error('Lỗi', res?.message || 'Cập nhật thất bại');
          }
          this.loadingService.hide();
        },
        error: () => {
          this.notification.error('Lỗi', 'Không thể cập nhật Type');
          this.loadingService.hide();
        }
      });
    } else {
      // Thêm mới
      this.typeService.create(body).subscribe({
        next: (res: any) => {
          console.log(res, 'resss');
          
          if (res?.success) {
            this.notification.success('Thành công', res.message || 'Thêm mới thành công');
            this.getTypes();
            this.closeModal();
          } else {
            this.notification.error('Lỗi', res?.message || 'Thêm mới thất bại');
          }
          this.loadingService.hide();
        },
        error: () => {
          this.notification.error('Lỗi', 'Không thể thêm mới Type');
          this.loadingService.hide();
        }
      });
    }
  }

  toSlug(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'd')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  onNameChange() {
    this.form.slug = this.toSlug(this.form.name);
  }

  deleteType(id: number) {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc muốn xóa loại này không?',
      nzOkText: 'Xóa',
      nzOkDanger: true,
      nzOnOk: () => {
        this.loadingService.show();
        this.typeService.delete(id).subscribe({
          next: (res: any) => {
            if (res?.success) {
              this.notification.success('Thành công', res.message || 'Xóa thành công');
            } else {
              this.notification.error('Lỗi', res?.message || 'Xóa thất bại');
            }
            this.getTypes();
            this.loadingService.hide();
          },
          error: (err) => {
            console.error('Delete error:', err);
            this.notification.error('Lỗi', 'Không thể xóa Type');
            this.loadingService.hide();
          }
        });
      }
    });
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
