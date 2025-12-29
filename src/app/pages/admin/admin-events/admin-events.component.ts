import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { HttpClient } from '@angular/common/http';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { EventService } from '../../../services/event.service';
import { ToastrService } from 'ngx-toastr';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { PaginationComponent } from '../../../components/pagination/pagination.component';




@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, CKEditorModule, NzModalModule, PaginationComponent],
  templateUrl: './admin-events.component.html',
  styleUrl: './admin-events.component.css'
})
export class AdminEventsComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private eventService: EventService,
    private toastr: ToastrService,
    private modal: NzModalService

  ) { }
  public Editor = ClassicEditor;
  searchText: string = '';
  isModalOpen = false;
  modalMode: 'create' | 'edit' | 'view' = 'create';
  isSectionModalOpen = false;
  listEvents: any;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  newSection = { title: '', content: '' };

  newEvent = {
    name: '',
    location: '',
    description: '',
    startDate: '',
    endDate: '',
    isFeatured: false,
    sections: [] as { title: string; content: string }[],
    bannerImage: null as File | null
  };


  ngOnInit(): void {
    this.loadEvents();
  }
  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.loadEvents();
  }
  loadEvents() {
    this.eventService.getPaged(this.currentPage, this.pageSize, this.searchText).subscribe({
      next: (res: any) => {
        this.listEvents = res.items;
        this.totalItems = res.totalCount;
      },
      error: (err) => console.error('Lỗi load sự kiện:', err)
    });
  }
  viewEvent(event: any) {
    this.newEvent = { ...event }; // clone dữ liệu vào form
    this.modalMode = 'view'; // 👈 đặt mode
    this.isModalOpen = true;
  }
  editEvent(event: any) {
    this.isModalOpen = true;
    this.modalMode = 'edit';

    // Gán dữ liệu sự kiện vào form để sửa
    this.newEvent = {
      name: event.name,
      location: event.location,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      isFeatured: event.isFeatured,
      sections: event.sections || [],
      bannerImage: null
    };

    console.log('✏️ Đang chỉnh sửa sự kiện:', event);
  }
  deleteEvent(id: number) {
    this.modal.confirm({
      nzTitle: 'Xác nhận xóa sự kiện',
      nzContent: 'Bạn có chắc chắn muốn xóa sự kiện này không? Hành động này không thể hoàn tác.',
      nzOkText: 'Xóa',
      nzOkDanger: true, // Làm nút đỏ cảnh báo
      nzCancelText: 'Hủy',
      nzCentered: true, // Căn giữa màn hình
      nzOnOk: () => {
        return new Promise<void>((resolve, reject) => {
          this.eventService.delete(id).subscribe({
            next: () => {
              this.toastr.success('🗑️ Xóa sự kiện thành công');
              this.loadEvents();
              resolve();
            },
            error: (err) => {
              console.error('❌ Lỗi khi xóa sự kiện:', err);
              this.toastr.error('Không thể xóa sự kiện');
              reject();
            }
          });
        });
      }
    });
  }
  addRaceCategory(event: any) {
    console.log('➕ Thêm Race Category cho sự kiện:', event);
  }



  openModal() {
    this.modalMode = 'create';
    this.newEvent = {
      name: '',
      location: '',
      description: '',
      startDate: '',
      endDate: '',
      isFeatured: false,
      sections: [],
      bannerImage: null
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.newEvent = {
      name: '',
      location: '',
      description: '',
      startDate: '',
      endDate: '',
      isFeatured: false,
      sections: [],
      bannerImage: null
    };
  }

  closeSectionModal() {
    this.isSectionModalOpen = false;
  }
  addSection() {
    this.newEvent.sections.push({ ...this.newSection });
    this.closeSectionModal();
  }
  openSectionModal() {
    this.isSectionModalOpen = true;
    this.newSection = { title: '', content: '' };
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newEvent.bannerImage = file;
    }
  }
  removeSection(index: number) {
    this.newEvent.sections.splice(index, 1);
  }


  filteredEvents() {
    if (!this.searchText.trim()) return this.listEvents;
    return this.listEvents.filter((e: any) =>
      e.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // ======================
  // SUBMIT FORM
  // ======================
  onSubmit() {
    // Gộp formData để chuẩn bị gửi về API
    const formData = new FormData();
    formData.append('Name', this.newEvent.name);
    formData.append('Location', this.newEvent.location);
    formData.append('Description', this.newEvent.description);
    formData.append('StartDate', this.newEvent.startDate);
    formData.append('EndDate', this.newEvent.endDate);
    formData.append('IsFeatured', String(this.newEvent.isFeatured));
    const sectionsWithOrder = this.newEvent.sections.map((s, index) => ({
      title: s.title,
      content: s.content,
      sortOrder: index
    }));
    formData.append('Sections', JSON.stringify(sectionsWithOrder));
    if (this.newEvent.bannerImage) {
      formData.append('BannerImage', this.newEvent.bannerImage);
    }

    console.log('📤 Sending event data:', this.newEvent);

    this.eventService.create(formData).subscribe({
      next: (res: any) => {
        this.toastr.success('Thêm sự kiện thành công 🎉', 'Thành công');
        this.closeModal();
      },
      error: err => {
        console.error('❌ Lỗi khi thêm sự kiện:', err);
      }
    });
  }
}
