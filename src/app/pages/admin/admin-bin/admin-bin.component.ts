import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-admin-bin',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PaginationComponent, NzModalModule],
  templateUrl: './admin-bin.component.html',
  styleUrl: './admin-bin.component.css'
})
export class AdminBinComponent implements OnInit{

  searchText = '';
  filterQuantity = '';
  filterType = '';
  filterGroup = '';
  filterBrand = '';
  priceFrom?: number;
  priceTo?: number;
  isSearchOpen = true;
  quantityValue: number | null = null;
  loading = false;
  totalItems = 0;
  pageNumber = 1;
  pageSize = 10;
  products: any[] = [];

  brands = ['TOTO', 'INAX', 'CAESAR'];
  types = ['Thiết bị bếp', 'Thiết bị vệ sinh'];
  groups = ['Nhóm 1', 'Nhóm 2'];

  constructor(
    private router: Router, private productService: ProductService, private toastr: ToastrService,
    private notification: NzNotificationService,
    private modal: NzModalService,
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.loading = true;
    this.productService.getDeletedPaged(this.pageNumber, this.pageSize)
    .subscribe({
      next: (res: any) => {
        this.products = res.items || res.data || []; 
        this.totalItems = res.totalCount || res.total || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error loading products:', err);
        this.loading = false;
      },
    })
  }

  filteredProducts() {
    return this.products.filter(p => {
      const matchesText =
        !this.searchText ||
        p.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        p.code.includes(this.searchText);
      const matchesBrand = !this.filterBrand || p.brand === this.filterBrand;
      const matchesType = !this.filterType || p.type === this.filterType;
      return matchesText && matchesBrand && matchesType;
    });
  }

   filterProducts() {
    console.log('🔍 Filtering...');
  }

  toggleSearchPanel() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  revertProduct(id: any) {
    this.loading = true;
    this.modal.confirm({
      nzTitle: 'Xác nhận khôi phục sản phẩm',
      nzContent: 'Bạn có chắc chắn muốn khôi phục sản phẩm này không? Hành động này không thể hoàn tác.',
      nzOkText: 'Khôi phục',
      nzOkDanger: true, // Làm nút đỏ cảnh báo
      nzCancelText: 'Hủy',
      nzCentered: true, // Căn giữa màn hình
      nzOnOk: () => {
        return new Promise<void>((resolve, reject) => {
          this.productService.delete(id, false).subscribe({
            next: () => {
              this.toastr.success('✅Khôi phục sản phẩm thành công. Sản phẩm đã được quay lại danh mục sản phẩm!');
              this.loading = false;
              resolve();
              this.getData();
            },
            error: (err) => {
              this.loading = false;
              const message =
                err.error?.message ||
                err.error?.title ||
                '❌ Lỗi khi khôi phục sản phẩm. Vui lòng thử lại.';
              console.error('Lỗi khôi phục sản phẩm:', message);
              this.toastr.error(message);
              reject();
            },
          })
        });
      }
    });
  }

}
