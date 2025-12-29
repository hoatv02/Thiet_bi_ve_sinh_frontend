import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { LucideAngularModule } from 'lucide-angular';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { BrandService } from '../../../../services/brand.service';
import { CategoryService } from '../../../../services/category.service';
import { TypeService } from '../../../../services/type.service';
import { ProductService } from '../../../../services/product.service';
import { LoadingService } from '../../../../services/loading.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-product-update',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, CKEditorModule],
  templateUrl: './product-update.component.html',
  styleUrl: './product-update.component.css'
})
export class ProductUpdateComponent {

  @ViewChildren('variantFileInput') variantFileInputs!: QueryList<ElementRef<HTMLInputElement>>;
  loading = false;
  public Editor = ClassicEditor;
  public removedGalleryUrls: any[] = [];

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
    slug: '',

  };

  // ✅ Hàm thêm / xóa biến thể
  addVariant() {
    this.product.variants.push({
      name: '',
      sku: '',
      price: 0,
      salePrice: 0,
      stockQuantity: 0,
      variantImgUrl: null,
      imageFile: null
    });
  }

  removeVariant(index: number) {
    this.product.variants.splice(index, 1);
  }

  // ✅ Upload ảnh cho từng biến thể
  onVariantImageChange(event: any, index: number) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.product.variants[index].variantImgUrl = reader.result as string;
      this.product.variants[index].imageFile = file;
    };
    reader.readAsDataURL(file);
  }

  removeVariantImage(index: number) {
    this.product.variants[index].variantImgUrl = null;
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
    private toastr: ToastrService,
    private router: Router,
    private brandService: BrandService,
    private typeService: TypeService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private loadingService: LoadingService,
    private notification: NzNotificationService,
  ) { }

  ngOnInit(): void {
    this.getBrands();
    this.getType();
    this.initData();
  }

  initData() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getById(id).subscribe({
      next: (res: any) => {
        this.product = {
          name: res.name,
          sku: res.sku,
          brandId: res.brandId,
          typeId: res.typeId,
          categoryId: res.categoryId,
          price: res.price,
          salePrice: res.salePrice,
          stockQuantity: res.stockQuantity,
          description: res.description,
          shortDescription: res.shortDescription,
          status: res.status,
          variants: res.variants,
          hasVariants: res.variants.length > 0,
          isActive: res?.isActive ?? 0,
          discountPercent: res?.discountPercent ?? 0,
          warrantyInfo: res?.warrantyInfo ?? '',
          deliveryInfo: res?.deliveryInfo ?? '',
          installationSupport: res?.installationSupport ?? '',
          slug: res.slug ?? '',
        }
        this.updateDiscountedPrice();

        if (this.product.typeId) {
          this.getCate(this.product.typeId);
        }
        this.previewMain = res.mainImageUrl;
        this.previewGallery = res.galleryUrls;
      }
    })
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

  updateDiscountedPrice() {
    const price = Number(this.product.price) || 0;
    const percent = Number(this.product.discountPercent) || 0;
    this.product.salePrice =
      percent > 0 && percent <= 100 ? price - (price * percent) / 100 : price;
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
    this.brandService.getAll().subscribe({
      next: (res: any) => {
        this.brands = res;
      }
    })
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
    const removedUrl = this.previewGallery[index];
    this.removedGalleryUrls.push(removedUrl);
  }

  // ✅ Lưu sản phẩm
  saveProduct() {
    this.loading = true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const formData = new FormData();
    formData.append('Name', this.product.name);
    formData.append('Sku', this.product.sku || '');
    formData.append('TypeId', this.product.typeId?.toString() || '');
    formData.append('BrandId', this.product.brandId?.toString() || '');
    formData.append('CategoryId', this.product.categoryId?.toString() || '');
    formData.append('Description', this.product.description || '');
    formData.append('ShortDescription', this.product.shortDescription || '');
    formData.append('Price', this.product.price || '0');
    formData.append('SalePrice', this.product.salePrice || '0');
    formData.append('discountPercent', this.product.discountPercent ?? 0);
    formData.append('StockQuantity', this.product.stockQuantity?.toString() || '0');
    formData.append('Status', this.product.status || 'active');
    formData.append('WarrantyInfo', this.product.warrantyInfo || '');
    formData.append('DeliveryInfo', this.product.deliveryInfo || '');
    formData.append('InstallationSupport', this.product.installationSupport || '');
    formData.append('HasVariants', this.product.hasVariants ? 'True' : 'False');
    formData.append('Slug', this.product.slug || '');
    formData.append('IsActive', (this.product.isActive ?? 0).toString());
    formData.append('DiscountPercent', (this.product.discountPercent ?? 0).toString());
    formData.append('Slug', this.product.slug || '');

    // ✅ Thêm biến thể
    if (this.product.hasVariants && this.product.variants.length > 0) {
      const variantsPayload = this.product.variants.map((v: any) => ({
        id: v.id ?? v.productVariantId ?? v.variantId ?? null,
        name: v.name,
        sku: v.sku,
        price: v.price,
        salePrice: v.salePrice,
        stockQuantity: v.stockQuantity,

        // để BE giữ ảnh nếu không upload file mới
        // variantImgUrl: v.variantImgUrl ?? null,
      }));

      formData.append('VariantsJson', JSON.stringify(variantsPayload));

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
    });

    // ✅ Gửi API
    this.productService.updateProduct(formData, id).subscribe({
      next: (res: any) => {
        this.loadingService.hide();
        this.notification.success('Thành công', 'Chỉnh sửa sản phẩm thành công!');
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
  formatPrice(value: number | string): string {
    if (value === null || value === undefined) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
  onProductPriceChange(value: string) {
    const rawValue = value.replace(/\./g, '');

    if (!/^\d*$/.test(rawValue)) return;

    this.product.price = Number(rawValue);
    console.log("🚀 This is! __ this.product.price:", this.product.price)
    // 🔥 BẮT BUỘC gọi lại
    this.updateDiscountedPrice();
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

  onPriceChange(value: string, v: any) {
    // bỏ hết dấu chấm
    const rawValue = value.replace(/\./g, '');

    // chỉ cho số
    if (!/^\d*$/.test(rawValue)) return;

    // lưu giá trị SỐ để gửi backend
    v = Number(rawValue);
  }
  goBack() {
    this.router.navigate(['admin/product']);
  }
}
