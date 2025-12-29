import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { TypeService } from '../../../services/type.service';
import { LoadingService } from '../../../services/loading.service';
import { BannerService } from '../../../services/banner.service';

@Component({
  selector: 'app-admin-banner',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, NzModalModule],

  templateUrl: './admin-banner.component.html',
  styleUrl: './admin-banner.component.css'
})
export class AdminBannerComponent {
  bannerList: any[] = [];
  types: any[] = [];
  searchText = '';

  isSearchOpen = true;
  isModalOpen = false;

  editBanner: any = null;
  selectedImage: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  form = {
    description: '',
  };

  constructor(
    private bannerService: BannerService,
    private toastr: ToastrService,
    private typeService: TypeService,
    private modal: NzModalService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.loadTypes();
    this.getListBanner();
  }
  getTypeName(typeId: number): string {
    const type = this.types.find(t => t.id == typeId);
    console.log(type?.name, 'typeId123');
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

  getListBanner() {
    this.loadingService.show();
    this.bannerService.getList().subscribe({
      next: (res: any) => {
        this.bannerList = (res || []).filter((x: any) =>
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
    this.editBanner = null;
    this.selectedImage = null;
    this.previewImage = null;
    this.form = { description: '' };
  }

  edit(category: any) {
    this.isModalOpen = true;
    this.editBanner = category;
    this.form = {
      description: category.description,

    };

    this.previewImage = category.mainImage || null;
    this.selectedImage = null;
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = () => (this.previewImage = reader.result);
      reader.readAsDataURL(file);
    }
  }

  save() {
    const formData = new FormData();
    formData.append('requests[0].id', this.editBanner.id);
    formData.append('requests[0].description', this.form.description);
    if (this.selectedImage) {
      formData.append('requests[0].file', this.selectedImage);
    }
    this.loadingService.show();

    if (this.editBanner) {
      this.bannerService.update(formData).subscribe({
        next: () => {
          this.toastr.success('Cập nhật banner thành công');
          this.getListBanner();
          this.closeModal();
          this.loadingService.hide();
        },
        error: () => this.loadingService.hide(),
      });
    }
  }

  delete(id: number) {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc muốn xóa banner này không?',
      nzOkText: 'Xóa',
      nzOkDanger: true,
      nzOnOk: () => {
        // this.bannerService.delete(id).subscribe({
        //   next: () => {
        //     this.toastr.success('Xóa thành công');
        //     this.getListBanner();
        //   },
        // });
      },
    });
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
