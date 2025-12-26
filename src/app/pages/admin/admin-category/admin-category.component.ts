import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../../services/category.service';
import { LoadingService } from '../../../services/loading.service';
import { TypeService } from '../../../services/type.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-admin-category',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, NzModalModule],
  templateUrl: './admin-category.component.html',
})
export class AdminCategoryComponent {

  categories: any[] = [];
  types: any[] = [];
  searchText = '';

  isSearchOpen = true;
  isModalOpen = false;

  editingCategory: any = null;
  selectedImage: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  form = {
    name: '',
    typeId: 0,
  };

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private typeService: TypeService,
    private modal: NzModalService,
    private loadingService: LoadingService,
    private notification: NzNotificationService,

  ) { }

  ngOnInit() {
    this.loadTypes();
    this.getCategories();
  }
  getTypeName(typeId: number): string {
    const type = this.types.find(t => t.id == typeId);
    return type ? type?.name : '—';
  }
  loadTypes() {
    this.typeService.getTypesList().subscribe({
      next: (res) => {
        this.types = res || [];
      },
      error: () => {
        this.types = [];
      }
    });
  }

  toggleSearchPanel() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  getCategories() {
    this.loadingService.show();

    this.categoryService.getList().subscribe({
      next: (res: any) => {
        this.categories = (res || []).filter((x: any) =>
          this.searchText === '' ||
          x.name?.toLowerCase()?.includes(this.searchText.toLowerCase())
        );
        this.loadingService.hide();
      },
      error: () => this.loadingService.hide()
    });
  }

  openCreateModal() {
    this.isModalOpen = true;
    this.editingCategory = null;
    this.selectedImage = null;
    this.previewImage = null;
    this.form = { name: '', typeId: 0 };
  }

  edit(category: any) {
    this.isModalOpen = true;
    this.editingCategory = category;
    this.form = {
      name: category.name,
      typeId: category.typeId || 0,
    };

    this.previewImage = category.img || null;
    this.selectedImage = null;
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;

      // Preview ảnh
      const reader = new FileReader();
      reader.onload = () => (this.previewImage = reader.result);
      reader.readAsDataURL(file);
    }
  }

  save() {
    const formData = new FormData();
    formData.append('Name', this.form.name);
    formData.append('TypeId', this.form.typeId.toString());
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.loadingService.show();

    if (this.editingCategory) {
      this.categoryService.update(this.editingCategory.id, formData).subscribe({
        next: (res: any) => {
          console.log("🚀 This is! __ res:", res)
          if (res?.success) {
            this.notification.success('Thành công', 'Cập nhật danh mục thành công!');

            this.getCategories();
            this.closeModal();
            this.loadingService.hide();
          }
        },
        error: (error: any) => {
          this.loadingService.hide()
          this.notification.error('Thất bại', error?.error?.message || 'Cập nhật danh mục thất bại');

        },
      });
    } else {
      this.categoryService.create(formData).subscribe({
        next: (res: any) => {
          this.notification.success('Thành công', 'Thêm danh mục thành công!');
          this.getCategories();
          this.closeModal();
          this.loadingService.hide();
        },
        error: (error: any) => {
          this.loadingService.hide()
          this.notification.error('Thất bại', error?.error?.message || 'Thêm danh mục thất bại');

        },
      });
    }
  }

  delete(id: number) {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc muốn xóa danh mục này không?',
      nzOkText: 'Xóa',
      nzOkDanger: true,
      nzOnOk: () => {
        this.categoryService.delete(id).subscribe({
          next: () => {
            this.toastr.success('Xóa thành công');
            this.getCategories();
          },
        });
      },
    });
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
