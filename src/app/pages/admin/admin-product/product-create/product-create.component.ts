import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BrandService } from '../../../../services/brand.service';
import { CategoryService } from '../../../../services/category.service';
import { TypeService } from '../../../../services/type.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProductService } from '../../../../services/product.service';
import { LoadingService } from '../../../../services/loading.service';

@Component({
  selector: 'app-product-create',
  standalone: true,
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
  imports: [CommonModule, FormsModule, LucideAngularModule, CKEditorModule],
})
export class ProductCreateComponent implements OnInit {
  @ViewChildren('variantFileInput') variantFileInputs!: QueryList<ElementRef<HTMLInputElement>>;
  loading = false;
  public Editor = ClassicEditor;
  token = localStorage.getItem('token');
  displayPrice = '';

  // ✅ Dữ liệu sản phẩm
  product: any = {
    name: '',
    sku: '',
    brandId: null,
    typeId: null,
    categoryId: null,
    price: 0,
    salePrice: 0,
    stockQuantity: 0,
    description: '',
    shortDescription: '',
    status: 'active',
    hasVariants: false,
    variants: [],
    isActive: 0,
    discountPercent: 0,
    warrantyInfo: '',          // Link thông số kỹ thuật
    deliveryInfo: '',          // Link hướng dẫn sử dụng
    installationSupport: '',   // Link hướng dẫn lắp đặt
  };

  // ✅ Hàm thêm / xóa biến thể
  addVariant() {
    this.product.variants.push({
      name: '',
      sku: '',
      price: 0,
      salePrice: 0,
      stockQuantity: 0,
      attributes: '',
      imageUrl: null,
      imageFile: null
    });
  }

  removeVariant(index: number) {
    this.product.variants.splice(index, 1);
  }
  onPriceInput(value: string) {
    // chỉ lấy số
    const digits = value.replace(/\D/g, '');

    // lưu số thật
    this.product.price = digits ? Number(digits) : 0;

    // format hiển thị kiểu 1.000.000
    this.displayPrice = digits
      ? Number(digits).toLocaleString('vi-VN') // vi-VN => dấu .
      : '';
  }
  formatPrice(value: number | string): string {
    if (value === null || value === undefined) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  onPriceChange(value: string, v: any) {
    // bỏ hết dấu chấm
    const rawValue = value.replace(/\./g, '');

    // chỉ cho số
    if (!/^\d*$/.test(rawValue)) return;

    // lưu giá trị SỐ để gửi backend
    v = Number(rawValue);
  }



  // ✅ Upload ảnh cho từng biến thể
  onVariantImageChange(event: any, index: number) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.product.variants[index].imageUrl = reader.result as string;
      this.product.variants[index].imageFile = file;
    };
    reader.readAsDataURL(file);
  }
  onVariantPriceChange(
    value: string,
    variant: any,
    field: 'price' | 'salePrice'
  ) {
    const rawValue = value.replace(/\./g, '');
    if (!/^\d*$/.test(rawValue)) return;

    variant[field] = Number(rawValue);
  }

  onProductPriceChange(value: string) {
    const rawValue = value.replace(/\./g, '');

    if (!/^\d*$/.test(rawValue)) return;

    this.product.price = Number(rawValue);
    console.log("🚀 This is! __ this.product.price:", this.product.price)
    // 🔥 BẮT BUỘC gọi lại
    this.updateDiscountedPrice();
  }
  removeVariantImage(index: number) {
    this.product.variants[index].imageUrl = null;
    this.product.variants[index].imageFile = null;
  }

  // ✅ Dữ liệu mẫu
  types: any[] = [];

  categories: any[] = [];
  brands: any[] = [];

  mainFile: File | null = null;
  previewMain: string | null = null;

  galleryFiles: File[] = [];
  previewGallery: string[] = [];

  constructor(
    private http: HttpClient,
    private notification: NzNotificationService,
    private router: Router,
    private brandService: BrandService,
    private typeService: TypeService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private loadingService: LoadingService,
  ) { }

  ngOnInit(): void {
    this.getBrands();
    this.getType();
  }

  // ✅ Xử lý ảnh chính
  onMainSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.mainFile = input.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => (this.previewMain = e.target.result);
    reader.readAsDataURL(this.mainFile);
  }

  removeMain(event: Event) {
    event.stopPropagation();
    this.mainFile = null;
    this.previewMain = null;
  }

  // ✅ Ảnh gallery
  onGallerySelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const files = Array.from(input.files);
    const remainingSlots = 5 - this.galleryFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    filesToAdd.forEach((file) => {
      this.galleryFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewGallery.push(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  getBrands() {
    this.brandService.getAll().subscribe(res => {
      this.brands = res;
    });
  }

  getType() {
    this.typeService.getTypesList().subscribe({
      next: (res: any) => {
        this.types = res;
      }
    })
  }

  getCate(typeId: number | string) {
    this.categoryService.getByTypeId(typeId).subscribe({
      next: (res: any) => {
        this.categories = res;
      }
    })

  }

  removeGalleryImage(index: number, event: Event) {
    event.stopPropagation();
    this.galleryFiles.splice(index, 1);
    this.previewGallery.splice(index, 1);
  }
  private stripHtml(html: string): string {
    return (html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, '').trim();
  }

  private validateBeforeSubmit(): string | null {
    if (!(this.product?.sku ?? '').trim()) return 'Vui lòng nhập ID sản phẩm (SKU).';
    if (!(this.product?.name ?? '').trim()) return 'Vui lòng nhập Tên sản phẩm.';
    if (!this.product?.typeId) return 'Vui lòng chọn Loại sản phẩm.';
    if (!this.product?.categoryId) return 'Vui lòng chọn Nhóm/Danh mục sản phẩm.';

    const price = Number(this.product?.price);
    if (!Number.isFinite(price) || price <= 0) return 'Giá thành phải lớn hơn 0.';

    const stock = Number(this.product?.stockQuantity);
    if (!Number.isFinite(stock) || stock < 0) return 'Số lượng sản phẩm không hợp lệ.';

    if (!this.stripHtml(this.product?.description ?? '')) return 'Vui lòng nhập Giới thiệu về sản phẩm.';
    if (!this.mainFile) return 'Vui lòng chọn Ảnh sản phẩm (ảnh chính).';

    return null; // ok
  }


  // ✅ Lưu sản phẩm
  saveProduct() {
    console.log("🚀 This is! __ this.product:", this.product)

    const err = this.validateBeforeSubmit();
    if (err) {
      this.notification.error('Lỗi', err);
      return; // ✅ không call API
    }
    this.loadingService.show();

    const formData = new FormData();
    formData.append('Name', this.product.name);
    formData.append('Sku', this.product.sku || '');
    formData.append('TypeId', this.product.typeId?.toString() || '');
    formData.append('BrandId', this.product.brandId?.toString() || '');
    formData.append('CategoryId', this.product.categoryId?.toString() || '');
    formData.append('Description', this.product.description || '');
    formData.append('ShortDescription', this.product.shortDescription || '');
    formData.append('Price', this.product.price?.toString() || '0');
    formData.append('DiscountPercent', this.product.discountPercent?.toString() || '0');
    formData.append('SalePrice', this.product.salePrice?.toString() || '0');
    formData.append('StockQuantity', this.product.stockQuantity?.toString() || '0');
    formData.append('IsActive', String(this.product.isActive ?? 1));
    formData.append('Status', this.product.status || 'active');
    formData.append('WarrantyInfo', this.product.warrantyInfo || '');
    formData.append('DeliveryInfo', this.product.deliveryInfo || '');
    formData.append('InstallationSupport', this.product.installationSupport || '');
    formData.append('HasVariants', this.product.hasVariants ? 'True' : 'False');

    // ✅ Thêm biến thể
    if (this.product.hasVariants && this.product.variants.length > 0) {
      const variantsPayload = this.product.variants.map((v: any) => ({
        name: v.name,
        sku: v.sku,
        price: v.price,
        salePrice: v.salePrice,
        stockQuantity: v.stockQuantity,
        attributes: v.attributes,
      }));
      formData.append('VariantsJson', JSON.stringify(variantsPayload));

      // upload ảnh từng biến thể
      this.product.variants.forEach((v: any, i: number) => {
        if (v.imageFile) {
          formData.append(`VariantImages_${i}`, v.imageFile, v.imageFile.name);
        }
      });
    }

    // ✅ Ảnh chính
    if (this.mainFile) {
      formData.append('MainImage', this.mainFile, this.mainFile.name);
    }

    // ✅ Gallery
    this.galleryFiles.forEach((file) => {
      formData.append('GalleryFiles', file, file.name);
    })

    // ✅ Gửi API
    this.productService.createProduct(formData).subscribe({
      next: (res: any) => {
        this.loadingService.hide();
        this.notification.success('Thành công', 'Thêm sản phẩm thành công!');
        this.router.navigate(['/admin/product']);
      },
      error: (err) => {
        this.loadingService.hide();
        const message =
          err.error?.message ||
          err.error?.title ||
          '❌ Lỗi khi tạo sản phẩm. Vui lòng thử lại.';
        this.notification.error('Lỗi', message);
      },
    });
  }

  goBack() {
    this.router.navigate(['admin/product']);
  }
  updateDiscountedPrice() {
    const price = Number(this.product.price) || 0;
    const percent = Number(this.product.discountPercent) || 0;
    this.product.salePrice =
      percent > 0 && percent <= 100 ? price - (price * percent) / 100 : price;
  }
}
