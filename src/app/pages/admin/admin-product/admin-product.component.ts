import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { ExportProductRequest, PagedProductRequest } from '../../../models/product.model';
import { TypeService } from '../../../services/type.service';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { LoadingService } from '../../../services/loading.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { forkJoin } from 'rxjs';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-admin-product',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PaginationComponent, NzModalModule, NzInputModule, NzNotificationModule],
  templateUrl: './admin-product.component.html',
})
export class AdminProductComponent implements OnInit {

  @ViewChild('discountTpl', { static: true }) discountTpl!: TemplateRef<any>;

  searchText = '';
  filterQuantity: 'less' | 'greater' | 'equal' = 'greater';
  filterType = 0;
  filterGroup = 0;
  filterBrand = 0;
  priceFrom?: number;
  priceTo?: number;
  isSearchOpen = true;
  quantityValue: number | null = null;
  loading = false;
  totalItems = 0;
  pageNumber = 1;
  pageSize = 10;
  products: any[] = [];
  types: any[] = [];
  groups: any[] = [];
  brands: any[] = [];
  selectedIds: any[] = [];
  discountPercent: number | null = null;
  applyingDiscount = false;

  constructor(private router: Router, private productService: ProductService, private toastr: ToastrService,
    private modal: NzModalService,
    private typeService: TypeService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private loadingService: LoadingService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit() {
    this.loadInitData();
    this.getProducts();
  }

  loadInitData() {
    forkJoin({
      types: this.typeService.getTypesList(),
      brands: this.brandService.getAll()
    }).subscribe({
      next: (res) => {
        this.types = res.types;
        this.brands = res.brands;
      },
      error: (err) => {
        console.error('Lỗi load dữ liệu filter:', err);
      }
    });
  }
  private mapQtyOp(op: 'less' | 'greater' | 'equal'): 'lt' | 'gt' | 'eq' {
    switch (op) {
      case 'less': return 'lt';
      case 'greater': return 'gt';
      case 'equal': return 'eq';
    }
  }
  onPageChange(page: number) {
    this.pageNumber = page;
    this.getProducts();
  }


  getProducts() {
    this.loadingService.show();
    const body: PagedProductRequest = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      searchText: this.searchText,
      typeId: this.filterType,
      brandId: this.filterBrand,
      cateId: this.filterGroup,
      priceFrom: this.priceFrom,
      priceTo: this.priceTo,
    }
    if (this.quantityValue !== null && this.quantityValue !== undefined) {
      body.stockQuantityValue = Number(this.quantityValue);
      body.stockQuantityOp = this.mapQtyOp(this.filterQuantity); // lt/gt/eq
    }
    this.productService.getPaged(body).subscribe({
      next: (res: any) => {
        this.loadingService.hide();
        console.log('✅ API result:', res);
        const list = res.items || res.data || [];
        this.products = list.map((p: any) => ({
          ...p,
          isActive: p.isActive ?? p.IsActive ?? false,   // default Inactive
          _updatingActive: false
        }));
        this.totalItems = res.totalCount || res.total || 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error loading products:', err);
        this.loadingService.hide();
      },
    });
  }
  toggleActive(p: any) {
    if (p._updatingActive) return;

    const prev: 0 | 1 = (p.isActive === 1 ? 1 : 0);
    const next: 0 | 1 = (prev === 1 ? 0 : 1);

    // optimistic update
    p.isActive = next;
    p._updatingActive = true;

    this.productService.updateActiveStatus(p.productId, next).subscribe({
      next: () => {
        p._updatingActive = false;
        this.toastr.success(next === 1
          ? '✅ Sản phẩm đã Active và publish lên web user'
          : '✅ Sản phẩm đã Inactive (ẩn khỏi web user)');
      },
      error: (err: any) => {
        // rollback nếu lỗi
        p.isActive = prev;
        p._updatingActive = false;

        const message =
          err?.error?.message ||
          err?.error?.title ||
          '❌ Không thể cập nhật trạng thái sản phẩm. Vui lòng thử lại.';
        this.toastr.error(message);
      }
    });
  }


  getCate(typeId: number | string) {
    this.categoryService.getByTypeId(typeId).subscribe({
      next: (res: any) => {
        this.groups = res;
      }
    });
  }

  toggleSearchPanel() {
    this.isSearchOpen = !this.isSearchOpen;
  }
  openCreatePage() {
    this.router.navigate(['/admin/product-create']);
  }

  filterProducts() {
    console.log('🔍 Filtering...');
  }

  openModal(product?: any) {
    this.router.navigate([`/admin/product-update/${product.productId}`]);
  }
  getTypeName(id: number): string {
    const type = this.types.find(t => t.id === id);
    return type ? type.name : '—'; // nếu không có thì hiển thị “—”
  }

  getBrandName(id: number): string {
    const brand = this.brands.find(b => b.id === id);
    return brand ? brand.name : '—';
  }

  deleteProduct(id: number) {
    this.loading = true;
    this.modal.confirm({
      nzTitle: 'Xác nhận xóa sản phẩm',
      nzContent: 'Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.',
      nzOkText: 'Xóa',
      nzOkDanger: true, // Làm nút đỏ cảnh báo
      nzCancelText: 'Hủy',
      nzCentered: true, // Căn giữa màn hình
      nzOnOk: () => {
        return new Promise<void>((resolve, reject) => {
          this.productService.delete(id, true).subscribe({
            next: () => {
              this.toastr.success('✅ Xóa sản phẩm thành công. Sản phẩm đã được chuyển đến thùng rác!');
              this.loading = false;
              resolve();
              this.getProducts();
            },
            error: (err) => {
              this.loading = false;
              const message =
                err.error?.message ||
                err.error?.title ||
                '❌ Lỗi khi xóa sản phẩm. Vui lòng thử lại.';
              this.toastr.error(message);
              reject();
            },
          })
        });
      }
    });
  }
  openDiscountModal() {
    if (!this.selectedIds.length) {
      this.notification.warning('Thông báo', 'Bạn chưa chọn sản phẩm nào.');
      return;
    }

    this.discountPercent = null;

    this.modal.create({
      nzTitle: 'Áp giảm giá theo %',
      nzCentered: true,
      nzMaskClosable: false,
      nzOkText: 'Áp dụng',
      nzCancelText: 'Hủy',
      nzOkLoading: this.applyingDiscount,
      nzContent: this.discountTpl,
      nzOnOk: () => {
        const val = Number(this.discountPercent);

        if (Number.isNaN(val)) {
          this.notification.warning('Thông báo', 'Vui lòng nhập % giảm giá hợp lệ.');
          return false;
        }
        if (val < 0 || val > 100) {
          this.notification.warning('Thông báo', 'Phần trăm giảm giá phải từ 0 đến 100.');
          return false;
        }

        return this.applyDiscountPercent(val);
      }
    });
  }

  onDeleteBySelect() {

    const body = {
      productIds: this.selectedIds,
      isRevert: true
    };

    this.loading = true;
    this.modal.confirm({
      nzTitle: 'Xác nhận xóa sản phẩm',
      nzContent: 'Bạn có chắc chắn muốn xóa những sản phẩm này không? Hành động này không thể hoàn tác.',
      nzOkText: 'Xóa',
      nzOkDanger: true, // Làm nút đỏ cảnh báo
      nzCancelText: 'Hủy',
      nzCentered: true, // Căn giữa màn hình
      nzOnOk: () => {
        return new Promise<void>((resolve, reject) => {
          this.productService.deleteBySelect(body).subscribe({
            next: () => {
              this.toastr.success('✅ Xóa sản phẩm thành công. Sản phẩm đã được chuyển đến thùng rác!');
              this.loading = false;
              resolve();
              this.getProducts();
            },
            error: (err) => {
              this.loading = false;
              const message =
                err.error?.message ||
                err.error?.title ||
                '❌ Lỗi khi xóa sản phẩm. Vui lòng thử lại.';
              this.toastr.error(message);
              reject();
            },
          })
        });
      }
    });
    console.log("🚀 This is! __ body:", body)
  }
  private applyDiscountPercent(percent: number): Promise<boolean> {
    this.applyingDiscount = true;

    const body = {
      productIds: this.selectedIds,
      percent
    };

    return new Promise((resolve) => {
      this.productService.applyDiscount(body).subscribe({
        next: (res: any) => {
          this.applyingDiscount = false;

          const ok = Number(res?.status) === 1;
          const msg = res?.message || (ok ? '✅ Cập nhật thành công' : '❌ Cập nhật thất bại');

          if (ok) {
            this.notification.success('Thành công', msg);
            this.getProducts();
            this.selectedIds = [];
            resolve(true);   // đóng modal
          } else {
            this.notification.error('Thất bại', msg);
            resolve(false);  // không đóng modal
          }
        },
        error: (err) => {
          this.applyingDiscount = false;

          // nếu BE trả BadRequest cũng có {status,message} thì lấy luôn
          const msg =
            err?.error?.message ||
            err?.error?.Message ||
            '❌ Có lỗi xảy ra. Vui lòng thử lại.';

          this.notification.error('Lỗi', msg);
          resolve(false);
        }
      });
    });
  }


  exportExcel() {
    this.loading = true;
    const body: ExportProductRequest = {
      productId: this.selectedIds,
    }
    this.productService.exportExcel(body).subscribe(blob => {
      // Tạo URL tạm thời từ blob
      const url = window.URL.createObjectURL(blob);

      // Tạo thẻ <a> ẩn để download file
      const a = document.createElement('a');
      a.href = url;
      a.download = `SanPham_${new Date().getTime()}.xlsx`;
      a.click();

      // Dọn dẹp
      a.remove();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Xuất Excel thất bại', error);
      alert('Có lỗi xảy ra khi xuất file!');
    });
  }

  toggleSelection(id: number, event: any) {
    if (event.target.checked) {
      // chọn → thêm vào danh sách
      if (!this.selectedIds.includes(id)) {
        this.selectedIds.push(id);
      }
    } else {
      // bỏ chọn → xóa khỏi danh sách
      this.selectedIds = this.selectedIds.filter(x => x !== id);
    }
  }
  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.pageNumber = 1; // reset về trang 1 khi đổi pageSize
    this.getProducts();
  }

  isAllSelected(): boolean {
    return this.products?.length > 0 && this.selectedIds.length === this.products.length;
  }

  isIndeterminate(): boolean {
    return this.selectedIds.length > 0 && this.selectedIds.length < (this.products?.length || 0);
  }

  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      // chọn hết các productId hiện đang hiển thị ở trang hiện tại
      this.selectedIds = this.products.map(p => p.productId);
    } else {
      // bỏ chọn hết
      this.selectedIds = [];
    }
  }
}
