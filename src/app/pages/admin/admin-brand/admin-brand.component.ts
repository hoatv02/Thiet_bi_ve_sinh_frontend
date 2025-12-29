import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../../services/brand.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { LoadingService } from '../../../services/loading.service';
import { finalize, lastValueFrom, Observable, switchMap, tap } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-admin-brand',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, NzModalModule],
  templateUrl: './admin-brand.component.html',
  styleUrl: './admin-brand.component.css'
})
export class AdminBrandComponent implements OnInit {
  listOfData: any[] = [];
  filteredList: any[] = [];
  isModalOpen = false;
  editingCategory = false;
  searchText = '';
  previewImage: string | ArrayBuffer | null = null;

  /** ✅ Thêm biến này để điều khiển accordion tìm kiếm */
  isSearchOpen = true;

  formData = { id: 0, name: '', img: null as File | null };

  constructor(private brandService: BrandService,
    private loadingService: LoadingService,
    private modal: NzModalService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.loadingService.show();
    this.getData()
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe();
  }

  /** ✅ Toggle panel tìm kiếm */
  toggleSearchPanel(): void {
    this.isSearchOpen = !this.isSearchOpen;
  }

  getData(): Observable<any> {
    return this.brandService.getAll().pipe(
      tap((res: any) => {
        this.listOfData = res;
        this.applySearch();
      })
    );
  }
  applySearch(): void {
    const q = (this.searchText || '').trim().toLowerCase();
    if (!q) {
      this.filteredList = [...this.listOfData];
      return;
    }

    this.filteredList = this.listOfData.filter(item =>
      (item?.name ?? '').toString().toLowerCase().includes(q)
    );
  }


  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.formData.img = file;

      const reader = new FileReader();
      reader.onload = () => (this.previewImage = reader.result);
      reader.readAsDataURL(file);
    }
  }

  openModal(item?: any) {
    this.isModalOpen = true;
    if (item) {
      this.editingCategory = true;
      this.formData = { id: item.id, name: item.name, img: null };
      this.previewImage = item.img;
    } else {
      this.editingCategory = false;
      this.formData = { id: 0, name: '', img: null };
      this.previewImage = null;
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.editingCategory = false;
    this.formData = { id: 0, name: '', img: null };
    this.previewImage = null;
  }

  save() {
    const form = new FormData();
    form.append('Id', this.formData.id.toString());
    form.append('Name', this.formData.name);
    if (this.formData.img) form.append('Img', this.formData.img);

    this.loadingService.show();

    const request$ = !this.editingCategory
      ? this.brandService.create(form)
      : this.brandService.update(this.formData.id, form);

    request$
      .pipe(
        switchMap(() => this.getData()),
        tap(() => this.closeModal()),
        finalize(() => this.loadingService.hide())
      )
      .subscribe({
        error: () =>
          console.error(!this.editingCategory ? 'Không thể thêm thương hiệu' : 'Không thể cập nhật thương hiệu'),
      });
  }


  deleteBrand(id: number) {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc muốn xóa thương hiệu này không?',
      nzOkText: 'Xóa',
      nzOkDanger: true,
      nzCancelText: 'Hủy',
      nzOnOk: async () => {
        this.loadingService.show();
        try {
          await lastValueFrom(
            this.brandService.delete(id).pipe(
              tap((res: any) => {
                if (res?.success) {
                  this.notification.success('Thành công', res?.message || 'Xóa thành công');
                } else {
                  this.notification.error('Lỗi', res?.message || 'Xóa thất bại');
                }
              }),
              switchMap(() => this.getData())
            )
          );
        } catch (err) {
          console.error('Delete error:', err);
          this.notification.error('Lỗi', 'Không thể xóa thương hiệu');
          throw err;
        } finally {
          this.loadingService.hide();
        }
      }
    });
  }

  filteredData(): any[] {
    const q = (this.searchText || '').trim().toLowerCase();
    if (!q) return this.listOfData;

    return this.listOfData.filter(item =>
      (item?.name ?? '').toString().toLowerCase().includes(q)
    );
  }

}

