import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Menu, ChevronDown, ShoppingCart, User, Search } from 'lucide-angular';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { TypeService } from '../../services/type.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { BrandService } from '../../services/brand.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  @ViewChild('cartDropdown') cartDropdownRef!: ElementRef;
  @ViewChild('searchContainer', { read: ElementRef }) searchContainer!: ElementRef; // ⭐ Đảm bảo có dòng này

  @Input() isHome: any;
  cartCount = 0;
  cartItems: any[] = [];
  showCartDropdown = false;
  public type: any[] = [];
  public isLoading: boolean = false;
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  activeType: any = null;
  activeProduct: any = null;
  public featuredProducts: any[] = [];
  brands: any[] = [];
  constructor(
    private router: Router,
    private cartService: CartService,
    private eRef: ElementRef,
    private typeService: TypeService,
    private productService: ProductService,
    private brandService: BrandService
  ) {

  }
  showMobileMenu = false;
  searchText = '';
  searchResults: any[] = []
  showResults = false;

  ngOnInit() {
    // Lấy số lượng
    this.cartService.cartCount$.subscribe(count => (this.cartCount = count));
    this.cartService.cartItems$.subscribe(items => (this.cartItems = items));
    this.getData();
    this.loadBrands();
    this.searchSubject
      .pipe(
        debounceTime(300),
        switchMap((query) => this.productService.searchProducts(query)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          console.log("🚀 This is! __ res:", res)
          this.searchResults = res
          this.isLoading = false;
          this.showResults = true;
        },
        error: () => {
          this.isLoading = false;
          this.searchResults = [];
          this.showResults = true;
        }
      });
  }
  goToType(slug: string) {
    this.router.navigate(['/list-product', slug]);
  }
  private loadBrands(): void {
    this.brandService.getAll().subscribe({
      next: (res) => {
        this.brands = res.slice(0, 9);
      },
      error: (err) => {
        console.error('❌ Lỗi khi tải brand:', err);
      }
    });
  }
  navigateToBrand(brand: any) {
    if (!this.activeType) return; // nếu chưa hover vào loại nào thì bỏ qua

    // ⚡ Điều hướng sang trang list-product với type slug và brandId
    this.router.navigate(
      ['/list-product', this.activeType.slug],
      { queryParams: { brandId: brand.id } }
    );

    // ✅ Ẩn mega menu sau khi click (cho UX tốt hơn)
    this.activeType = null;
  }
  isMobileMenuOpen = false;
  isMobileSearchOpen = false;

  // navigateToProduct(slug: any) {
  //   console.log("🚀 This is! __ slug:", slug)
  //   this.router.navigate(['/detail-product', slug?.slug],
  //     // { queryParams: { brandId: brand.id } }
  //   );

  //   setTimeout(() => {
  //     this.closeSearchResults();
  //   }, 0);
  // }


  navigateToProduct(slug: any) {
    this.router.navigate(['/detail-product', slug?.slug],
      { queryParams: { category: slug.category } }
    );
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  openMobileMenu() {
    this.showMobileMenu = true;
  }

  closeMobileMenu() {
    this.showMobileMenu = false;
  }
  closeSearchResults(): void {
    this.showResults = false;
    this.searchText = '';
    this.searchResults = []; // ⭐ Thêm dòng này
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Kiểm tra click outside search container
    if (this.searchContainer && !this.searchContainer.nativeElement.contains(target)) {
      this.closeSearchResults();
    }

    // Kiểm tra click outside cart dropdown
    if (this.cartDropdownRef && !this.cartDropdownRef.nativeElement.contains(target)) {
      this.showCartDropdown = false;
    }
  }
  // Thêm các biến này
  mobileMenuOpen = false;
  showMobileSearch = false;
  showMobileCart = false;

  // Thêm các phương thức này
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    // Đóng các overlay khác nếu đang mở
    if (this.mobileMenuOpen) {
      this.showMobileSearch = false;
      this.showMobileCart = false;
    }
  }

  toggleMobileSearch() {
    this.showMobileSearch = !this.showMobileSearch;
    if (this.showMobileSearch) {
      // Đóng các overlay khác nếu đang mở
      this.mobileMenuOpen = false;
      this.showMobileCart = false;

      // Focus vào input search khi mở
      setTimeout(() => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  }

  toggleMobileCart() {
    this.showMobileCart = !this.showMobileCart;
    if (this.showMobileCart) {
      // Đóng các overlay khác nếu đang mở
      this.mobileMenuOpen = false;
      this.showMobileSearch = false;
    }
  }
  // Sửa lại phương thức toggleCartDropdown cho desktop
  toggleCartDropdown(event: Event) {
    this.closeSearchResults();

    // Chỉ áp dụng cho desktop, mobile dùng toggleMobileCart
    if (window.innerWidth >= 1024) { // lg breakpoint
      event.stopPropagation();
      this.showCartDropdown = !this.showCartDropdown;
    }
  }
  navigateTo(path: string) {
    this.showCartDropdown = false;
    setTimeout(() => {
      this.router.navigate([path]);
    }, 0);
  }

  onSearchInput(event: Event) {
    if (event) {
      const value = (event.target as HTMLInputElement).value.trim();
      console.log("🚀 This is! __ value:", value)
      this.searchText = value;
      if (!value) {
        this.showResults = false;
        this.searchResults = [];
        return;
      }
      this.isLoading = true;
      this.showResults = true;
      this.searchSubject.next(value);
    }
  }

  onTypeHover(slug: string) {
    this.activeType = this.type.find((t: any) => t.slug === slug);
    const a = this.type.find((t: any) => t.slug === slug).specialProduct;
    this.featuredProducts = a?.map((items: any) => {
      return {
        ...items,
        category: slug
      }
    })
  }



  getData() {
    this.isLoading = true;
    this.typeService.getAll().subscribe(res => {
      this.type = res;
      this.activeType = this.type[0];
      this.featuredProducts = this.type[0].specialProduct;
      this.isLoading = false;
    });
  }


  login() {
    location.href = 'auth/login';
  }
}
