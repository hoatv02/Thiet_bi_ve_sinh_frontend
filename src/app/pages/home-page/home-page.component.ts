import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { EventResponse, EventService } from '../../services/event.service';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TypeService } from '../../services/type.service';
import { BrandService } from '../../services/brand.service';
import { RecentlyViewedService } from '../../services/recently-viewed.service';
import { BannerService } from '../../services/banner.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NgClass, RouterLink, LucideAngularModule, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {

  public loaiSanPham: any[] = [];
  public isLoading: boolean = false;
  partners: any[] = [];

  constructor(
    private typeService: TypeService,
    private eventService: EventService,
    private brandService: BrandService,
    private recentlyViewedService: RecentlyViewedService,
    private router: Router,
    private bannerService: BannerService
  ) {

  }

  banners: any = [
    // 'assets/bg.png',
    // 'assets/bg.png',
    // 'assets/bg.png',
    // 'assets/banner4.jpg',
    // 'assets/banner5.jpg'
  ];

  rightImages = [
    'assets/banner1.jpg',
    'assets/banner2.jpg'
  ];

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  currentIndex = 0;
  productIndex = 0;
  translateX = 0;
  itemWidth = 300;
  isHovering = false;


  sanPhamDaXem: any[] = [];
  pauseSlide() {
    this.isHovering = true;
    clearInterval(this.intervalId); // dừng auto slide
  }

  resumeSlide() {
    this.isHovering = false;
    this.intervalId = setInterval(() => {
      this.next();
    }, 3000); // chạy lại
  }


  get maxProductIndex() {
    return Math.max(this.sanPhamDaXem.length - 4, 0);
  }
  // splitCategories(categories: any[]) {
  //   const total = categories.length;

  //   // Nếu <=6 thì chỉ 1 hàng
  //   if (total <= 6) return [categories];

  //   // Nếu > 6 thì chia đôi
  //   const firstRowCount = Math.ceil(total / 2);
  //   return [categories.slice(0, firstRowCount), categories.slice(firstRowCount)];
  // }
  normalizeCategories(item: any) {
    const categories = [...item.categories];
    if (item.slug === 'thiet_bi_ve_sinh') {
      const row1 = categories.slice(0, 6);
      const row2 = categories.slice(6, 11); // đúng 5 item, không null
      return [row1, row2];
    }
    while (categories.length < 12) categories.push(null);

    return [categories.slice(0, 6), categories.slice(6, 12)];
  }

  // thêm helper
  isSpecialRow(item: any, rowIndex: number) {
    return item?.slug === 'thiet_bi_ve_sinh' && rowIndex === 1;
  }
  getListBanner() {
    this.bannerService.getList().subscribe({
      next: (res: any) => {
        this.banners = res?.map((items: any) => {
          return {
            mainImage: items?.mainImage || ''
          }
        })
        console.log("🚀 This is! __  this.banners:", this.banners)
      },
    });
  }

  getItemWidth(length: number): string {
    const gap = 16; // khoảng cách giữa các item (px)
    const widthPercent = 100 / length; // chia đều 100%
    return `calc(${widthPercent}% - ${gap}px)`; // ví dụ: 5 item => 20%
  }


  nextSlide() {
    const total = this.sanPhamDaXem.length;
    const visible = 4;

    if (total <= visible) return;

    if (this.productIndex < this.maxProductIndex) {
      this.productIndex++;
      this.translateX = this.productIndex * this.itemWidth;
    }
  }

  prevSlide() {
    if (this.productIndex > 0) {
      this.productIndex--;
      this.translateX = this.productIndex * this.itemWidth;
    }
  }

  featuredEvents: EventResponse[] = [];

  intervalId: any;
  formatPrice(value: number): string {
    return value.toLocaleString("vi-VN") + "đ";
  }
  private touchStartX = 0;
  private touchEndX = 0;
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].clientX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipe();
  }

  private handleSwipe() {
    const deltaX = this.touchEndX - this.touchStartX;

    // ngưỡng swipe để tránh chạm nhẹ
    if (Math.abs(deltaX) < 50) return;

    if (deltaX < 0) {
      this.next(); // vuốt trái
    } else {
      this.prev(); // vuốt phải
    }
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.next();
    }, 3000);
    this.getListBanner()
    this.getData();
    this.loadBrands();
    this.loadRecentlyViewed();
  }
  loadRecentlyViewed() {
    const items = this.recentlyViewedService.getAll();
    console.log("🚀 This is! __ items:", items)
    this.sanPhamDaXem = items.map((p: any) => ({
      id: p.productId,
      brand: p.brandName || '',
      name: p.name,
      slug: p.slug,
      category: p?.category,
      image: p.mainImageUrl || 'assets/no-image.png',
      oldPrice: p.price,
      price: p.salePrice ?? p.price,
      discount: p.salePrice ? Math.round(((p.price - p.salePrice) / p.price) * 100) : 0,
      isHot: p.isHot ?? false
    }));
  }

  loadBrands() {
    this.brandService.getAll().subscribe({
      next: (brands) => {
        console.log("🚀 This is! __ brands:", brands)

        this.partners = brands;
      },
      error: (err) => {
      },
    });
  }
  goToDetail(slug: any) {
    console.log("🚀 This is! __ slugssssssssssss:", slug)
    this.router.navigate(['/detail-product', slug.slug
    ], {
      queryParams: {
        category: slug?.category,
      }
    });
  }

  getData() {
    this.isLoading = true;
    this.typeService.getAll().subscribe(res => {
      this.loaiSanPham = res.map((item: any) => ({
        ...item,
        slideIndexBrand: 0 // mỗi loại có chỉ số trượt riêng
      }));
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.banners.length;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.banners.length) % this.banners.length;
  }

  goTo(index: number) {
    this.currentIndex = index;
  }
  slideIndexBrand = 0;

  nextBrandSlide(item: any) {
    if (item.slideIndexBrand + 6 < this.partners.length) {
      item.slideIndexBrand++;
    }
  }

  prevBrandSlide(item: any) {
    if (item.slideIndexBrand > 0) {
      item.slideIndexBrand--;
    }
  }
}
