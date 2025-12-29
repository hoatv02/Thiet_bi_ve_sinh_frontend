import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { OrderService } from '../../../services/order.service';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { LoadingService } from '../../../services/loading.service';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

@Component({
  selector: 'app-admin-order',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, NzModalModule, PaginationComponent],
  templateUrl: './admin-order.component.html',
  styleUrl: './admin-order.component.css'
})
export class AdminOrderComponent {

  // Accordion
  isSearchOpen = true;


  // Pagination
  pageNumber = 1;
  pageSize = 20;
  totalItems = 0;

  // Danh sách đơn hàng
  orders: any[] = [];
  originalOrders: any[] = [];

  // Bộ lọc
  keyword = '';
  statusFilter = '';
  dateFrom: string = '';
  dateTo: string = '';

  constructor(
    private orderService: OrderService,
    private router: Router,
    private modal: NzModalService,
    private loading: LoadingService
  ) { }
  @ViewChild('orderDetailTpl') orderDetailTpl!: TemplateRef<any>;
  selectedOrder: any = null;

  ngOnInit() {
    this.fetchOrders();
  }
  onPageChange(page: number) {
    this.pageNumber = page;
    this.fetchOrders();
  }
  fetchOrders() {
    this.loading.show();

    this.orderService.getPaged({
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      keyword: this.keyword?.trim() || undefined,
      status: this.statusFilter || undefined,
      dateFrom: this.dateFrom || undefined,
      dateTo: this.dateTo || undefined,
    }).subscribe({
      next: (res: any) => {
        const items = res.items ?? res.data ?? []; // tuỳ backend đặt tên
        this.orders = items.map((o: any) => ({
          ...o,
          tempStatus: o.orderStatus,
          showStatusDropdown: false
        }));

        this.totalItems = res?.totalCount ?? 0;
        this.loading.hide();
      },
      error: () => this.loading.hide()
    });
  }
  openDetail(id: number) {
    this.loading.show();

    this.orderService.getById(id).subscribe({
      next: (res) => {
        this.selectedOrder = res;
        this.loading.hide();

        this.modal.create({
          nzTitle: 'Chi tiết đơn hàng',
          nzContent: this.orderDetailTpl,
          nzFooter: null,
          nzWidth: 800
        });
      },
      error: () => {
        this.loading.hide();
      }
    });
  }


  toggleSearchPanel() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  // Lấy danh sách đơn
  getOrders() {
    this.loading.show();   // 🔥 bật loading

    this.orderService.getAllOrders().subscribe({
      next: (res: any[]) => {
        this.orders = res.map(o => ({
          ...o,
          tempStatus: o.orderStatus,
          showStatusDropdown: false
        }));
        this.originalOrders = this.orders;
        this.loading.hide()
      },
      error: () => {
        this.loading.hide();   // 🔥 phải hide để tránh kẹt loading
      }
    });
  }
  toggleStatusDropdown(order: any) {
    order.showStatusDropdown = !order.showStatusDropdown;
    // Khi mở dropdown, đảm bảo tempStatus = trạng thái hiện tại
    if (order.showStatusDropdown) {
      order.tempStatus = order.orderStatus;
    }
  }
  onStatusChange(order: any) {
    // chỉ set lại tempStatus, nút xác nhận sẽ hiện vì đã binding trong template
  }
  confirmStatus(order: any) {
    if (order.tempStatus === order.orderStatus) return;

    this.loading.show();

    this.orderService.updateStatus(order.orderId, order.tempStatus).subscribe({
      next: () => {
        // Cập nhật lại trạng thái chính
        order.orderStatus = order.tempStatus;
        order.showStatusDropdown = false; // đóng dropdown
        this.loading.hide();
      },
      error: () => {
        this.loading.hide();
      }
    });
  }

  // Tìm kiếm / lọc
  searchOrders() {
    this.pageNumber = 1;      // reset về trang 1 khi search
    this.fetchOrders();       // gọi API với keyword/status/dateFrom/dateTo hiện tại
  }


  // Mở modal cập nhật trạng thái (tùy bạn làm thêm UI)
  openStatusModal(order: any) {
    const newStatus = prompt("Nhập trạng thái mới:", order.orderStatus);
    if (!newStatus) return;

    this.orderService.updateStatus(order.orderId, newStatus).subscribe(() => {
      this.getOrders();
    });
  }

  // Xóa đơn hàng
  deleteOrder(id: number) {
    this.modal.confirm({
      nzTitle: 'Xác nhận xóa đơn hàng',
      nzContent: 'Bạn có chắc chắn muốn xóa đơn hàng này không?',
      nzOkText: 'Xóa',
      nzOkDanger: true,
      nzCancelText: 'Hủy',

      // ⏳ Loading khi xóa
      nzOnOk: () => {
        this.loading.show();

        return new Promise((resolve, reject) => {
          this.orderService.deleteOrder(id).subscribe({
            next: () => {
              this.getOrders();
              this.loading.hide();
              resolve(true);
            },
            error: () => {
              this.loading.hide();
              reject();
            }
          });
        });
      }
    });
  }

  // Hiển thị text trạng thái
  getStatusName(status: string) {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'confirmed': return 'Đã xác nhận';
      case 'shipping': return 'Đang giao';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  }

  // CSS trạng thái
  getStatusClass(status: string) {
    return {
      'bg-yellow-100 text-yellow-600': status === 'pending',
      'bg-blue-100 text-blue-600': status === 'confirmed',
      'bg-orange-100 text-[#3AA7E9]': status === 'shipping',
      'bg-green-100 text-green-600': status === 'completed',
      'bg-red-100 text-red-600': status === 'cancelled'
    };
  }
}
