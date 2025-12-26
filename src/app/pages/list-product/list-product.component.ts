import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { PagedProductRequest } from '../../models/product.model';
import { TypeService } from '../../services/type.service';

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PaginationComponent, RouterModule],
  templateUrl: './list-product.component.html',
})
export class ListProductComponent implements OnInit {

  public defaultCategory = { id: 0, name: 'Tất cả', icon: 'menu' };
  public selectedCateId = 0;
  public pageNumber: number = 1;
  public pageSize: number = 10;
  public totalItem: number = 0;
  public selectedTypeId: number = 0;
  brandId?: number;


  categories: any[] = [];

  activeFilters: string[] = [];      // lưu nhiều filter cùng lúc
  priceSort: 'priceasc' | 'pricedesc' | '' = '';  // lưu trạng thái sort theo giá

  activeCategory = 'TẤT CẢ';
  sortOption = 'default';
  showPriceDropdown: boolean = false;
  sortOrder: string = '';
  breadcrumbTypeName = '';
  breadcrumbCategoryName = '';
  currentTypeSlug = '';

  products: any[] = [];

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private loadingService: LoadingService,
    private activeRoute: ActivatedRoute,
    private typeService: TypeService,
  ) { }

  ngOnInit(): void {
    // ✅ Lắng nghe param + query param để nhận typeSlug & brandId
    this.activeRoute.paramMap.subscribe(params => {
      const typeSlug = params.get('type-name');
      const cateSlug = params.get('category-name');
      this.currentTypeSlug = typeSlug || '';

      // Lấy brandId từ query params
      this.activeRoute.queryParamMap.subscribe(query => {
        const brandIdParam = query.get('brandId');
        this.brandId = brandIdParam ? Number(brandIdParam) : undefined;

        // Load dữ liệu type/category sau khi đã có brandId
        this.loadTypesFromCache(typeSlug, cateSlug);
      });
    });
  }
  private loadTypesFromCache(typeSlug?: string | null, cateSlug?: string | null) {
    this.typeService.getAll().subscribe({
      next: (types: any[]) => {
        if (!types?.length) return;

        const foundType = types.find((t) => t.slug === typeSlug);
        if (!foundType) {
          console.warn('⚠️ Không tìm thấy type tương ứng:', typeSlug);
          return;
        }

        this.selectedTypeId = foundType.id;
        this.categories = foundType.categories || [];
        console.log('✅ this.categories (after assign) =', this.categories);
        this.breadcrumbTypeName = foundType.name;

        // Xử lý category nếu có
        if (cateSlug) {
          const foundCate = this.categories.find((c) => c.slug === cateSlug);
          if (foundCate) {
            this.activeCategory = foundCate.name;
            this.selectedCateId = foundCate.id;
            this.breadcrumbCategoryName = foundCate.name;
          } else {
            this.activeCategory = 'TẤT CẢ';
            this.selectedCateId = 0;
            this.breadcrumbCategoryName = '';
          }
        } else {
          this.activeCategory = 'TẤT CẢ';
          this.selectedCateId = 0;
          this.breadcrumbCategoryName = '';
        }

        // ✅ Gọi API sản phẩm sau khi xác định brandId/typeId
        this.fetchProducts();
      },
      error: (err) => console.error('❌ Lỗi load types:', err),
    });
  }
  isFilterActive(key: string): boolean {
    return this.activeFilters.includes(key);
  }
  toggleFilter(key: string) {
    const idx = this.activeFilters.indexOf(key);
    if (idx > -1) {
      this.activeFilters.splice(idx, 1);   // đang bật → tắt
    } else {
      this.activeFilters.push(key);        // đang tắt → bật
    }
    this.fetchProducts();
  }
  clearAllFilters() {
    this.activeFilters = [];
    this.sortOrder = '';
    this.showPriceDropdown = false;
    this.fetchProducts();
  }
  handlePageChange(event: any) {
    console.log("🚀 This is! __ event:", event)
    if (event) {
      this.pageSize = event
      this.fetchProducts()
    }
  }
  /** ✅ Lấy danh sách sản phẩm */
  private fetchProducts() {
    this.loadingService.show();

    const body: PagedProductRequest = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      cateId: this.selectedCateId === 0 ? undefined : this.selectedCateId,
      typeId: this.selectedCateId === 0 ? this.selectedTypeId : undefined,
      brandId: this.brandId,
      isActive: 1,
      sort: this.sortOrder,
      filter: this.activeFilters.length ? this.activeFilters.join(',') : undefined,
    };

    this.productService.getPaged(body).subscribe({
      next: (res: any) => {
        this.products = res?.items?.map((items: any) => {
          return {
            ...items,
            category: this.currentTypeSlug
          }
        }) || [];
        this.totalItem = res?.totalCount || 0;
        this.pageNumber = res?.pageNumber || 1;
        this.pageSize = res?.pageSize || 10;
      },
      error: () => this.loadingService.hide(),
      complete: () => this.loadingService.hide(),
    });
  }


  setActiveFilter(filter: string) {
    if (filter === 'filter') {
      this.clearAllFilters();
      return;
    }
    this.toggleFilter(filter);
  }

  goHome() {
    this.router.navigate(['/'])
  }
  goCart() {
    this.router.navigate(['/cart'])

  }

  goToDetail(slug: any) {
    console.log("🚀 This is! __ slug:", slug)
    this.router.navigate(['/detail-product', slug.slug
    ], {
      queryParams: {
        category: slug?.category,
      }
    });
  }

  setActiveCategory(cate: any = this.defaultCategory) {
    console.log("🚀 This is! __ cate:", cate)
    this.activeCategory = cate.name;
    this.selectedCateId = cate.id;

    if (cate.id === 0) {
      this.router.navigate(['/list-product', this.currentTypeSlug]).then(() => {
        this.fetchProducts();
      });
    } else {
      this.router.navigate(['/list-product', this.currentTypeSlug, cate.slug]).then(() => {
        this.fetchProducts();
      });
    }
  }

  togglePriceDropdown() {
    this.showPriceDropdown = !this.showPriceDropdown;
  }

  setSort(order: 'priceasc' | 'pricedesc') {
    this.sortOrder = order;

    // đảm bảo filter 'price' được đánh dấu active (để highlight button GIÁ)
    if (!this.activeFilters.includes('price')) {
      this.activeFilters.push('price');
    }

    this.showPriceDropdown = false;
    this.fetchProducts();
  }

  sortedProducts() {
    let sorted = [...this.products];
    switch (this.sortOption) {
      case 'priceAsc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return sorted;
  }
}
