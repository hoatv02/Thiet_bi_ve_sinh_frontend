import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule, NgFor } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductResponse, ProductService } from '../../services/product.service';
import { LoadingService } from '../../services/loading.service';
import { RecentlyViewedService } from '../../services/recently-viewed.service';
import { CartModel } from '../../models/cart.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [FormsModule, LucideAngularModule, CommonModule, RouterLink],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.css'
})
export class DetailProductComponent implements OnInit {

  quantity = 1;
  selectedOption: any = null;
  selectedImage: string | null = null;
  product: any;
  recentlyViewed: ProductResponse[] = [];
  sanPhamDaXem: any[] = [];
  translateX = 0;
  itemWidth = 300;
  listSameProduct: ProductResponse[] = [];
  // ===== SẢN PHẨM TƯƠNG TỰ =====


  relatedProducts: any = [];

  originalGalleryUrls: any = []
  constructor(private cartService: CartService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private loadingService: LoadingService,
    private recentlyViewedService: RecentlyViewedService,
    private sanitizer: DomSanitizer
  ) { }
  addToCart() {
    const selectVariant: CartModel = {
      productId: this.product.productId,
      name: this.selectedOption.name,
      sku: this.selectedOption.sku,
      mainImageUrl: this.selectedOption.variantImgUrl,
      price: this.selectedOption.price,
      salePrice: this.selectedOption.salePrice,
      variantId: this.selectedOption.variantId,
      stockQuantity: this.selectedOption.stockQuantity,

    }
    const itemToAdd = {
      ...selectVariant,
      quantity: this.quantity,
      isActive: this.selectedOption?.isActive,

    };
    this.cartService.addToCart(itemToAdd);
  }
  selectThumb(url: string) {
    this.selectedImage = url;
  }

  buyNow() {
    if (!this.product) return;
    console.log("🚀 This is! __ this.selectedOption:", this.selectedOption)

    const selectVariant: CartModel = {
      productId: this.product.productId,
      name: this.selectedOption.name,
      sku: this.selectedOption.sku,
      mainImageUrl: this.selectedOption.variantImgUrl,
      price: this.selectedOption.price,
      salePrice: this.selectedOption.salePrice,
      variantId: this.selectedOption.variantId,
      stockQuantity: this.selectedOption.stockQuantity,
      isActive: this.selectedOption?.isActive || 1,
    }

    const itemToAdd = {
      ...selectVariant,
      quantity: this.quantity,
    };

    this.cartService.addToCart(itemToAdd);
    this.router.navigate(['/checkout']);
  }
  slugCategoryName: string = ''

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.slugCategoryName = params?.data || params?.category
    });
    this.route.paramMap.subscribe(params => {
      console.log("🚀 This is! __ params:", params)
      const slug = params.get('slug');
      if (slug) {
        this.loadProduct(slug);
      }
    });
    this.loadRecentlyViewed();
    this.recentlyViewed = this.recentlyViewedService.getAll();
  }

  private loadOtherPaged() {
    console.log("🚀 This is! __ this.product:", this.product)

    const body: any = {
      pageNumber: 1,
      pageSize: 3,
      typeId: this.product?.typeId,
      isActive: 1,
    };
    this.productService.getOtherProduct(body).subscribe({
      next: (res: any) => {
        console.log("🚀 This is! __ getOtherProduct:", res)
        if (res?.items?.length) {
          this.relatedProducts = res?.items?.map((items: any) => {
            return {
              ...items,
              category: this.slugCategoryName,
              image: items?.mainImageUrl
            }
          })
        }
      },
      error: () => this.loadingService.hide(),
      complete: () => this.loadingService.hide(),
    });
  }













  prevSlideTT() {
    if (this.sameIndex > 0) {
      this.sameIndex--;
      this.sameTranslateX = this.sameIndex * this.itemWidth;
    }
  }
  goToDetail(slug: any) {
    console.log("🚀 This is! __ slug:", slug)
    this.router.navigate(['/detail-product', slug?.slug
    ], {
      queryParams: {
        category: slug?.category,
      }
    });
  }
  loadRecentlyViewed() {
    const items = this.recentlyViewedService.getAll();
    this.sanPhamDaXem = items.map((p: any) => ({
      id: p.productId,
      brand: p.brandName || '',
      name: p.name,
      slug: p.slug,
      image: p.mainImageUrl || 'assets/no-image.png',
      oldPrice: p.price,
      price: p.salePrice ?? p.price,
      discount: p.salePrice ? Math.round(((p.price - p.salePrice) / p.price) * 100) : 0,
      isHot: p.isHot ?? false,
      category: this.slugCategoryName
    }));
  }
  getSameProduct() {
    this.productService.getSameProduct(this.product.productId).subscribe({
      next: (res) => {
        this.listSameProduct = res;
        console.log("🚀 This is! __  this.listSameProduct:", this.listSameProduct)
      },
      error: (err) => {
        console.error('❌ Lỗi khi lấy sản phẩm theo slug:', err);
        this.loadingService.hide(); // ✅ tắt loading nếu lỗi
      },
    })
  }
  private fetchProducts() {
    this.loadingService.show();
    const body: any = {
      pageNumber: 1,
      pageSize: 100,
      typeId: this.product?.typeId,
      isActive: 1,
    };

    this.productService.getPaged(body).subscribe({
      next: (res: any) => {
        console.log("🚀 This is! __ res:", res)
        if (res?.items?.length) {
          const data = res?.items?.map((items: any) => {
            return {
              ...items,
              category: this.slugCategoryName,
            }
          })
          this.listSameProduct = data?.filter((items: any) => items?.productId !== this.product?.productId)
        }

      },
      error: () => this.loadingService.hide(),
      complete: () => this.loadingService.hide(),
    });
  }
  nextSlideTT() {
    const total = this.sanPhamTuongTu.length;
    const visible = 4;

    if (total <= visible) return;

    if (this.sameIndex < this.maxProductTTIndex) {
      this.sameIndex++;
      this.sameTranslateX = this.sameIndex * this.itemWidth;
    }
  }
  get maxProductIndex() {
    return Math.max(this.sanPhamDaXem.length - 4, 0);
  }
  get maxProductTTIndex() {
    return Math.max(this.sanPhamTuongTu.length - 4, 0);
  }
  selectVariant(product: any, variant: any) {
    this.selectedOption = variant;

    const isMainVariant = variant?.sku === product?.sku;
    console.log('isMainVariant:', isMainVariant);

    if (isMainVariant) {
      // Quay lại gallery gốc
      this.product.galleryUrls = [...this.originalGalleryUrls];
    } else {
      // Dùng ảnh variant
      this.product.galleryUrls = variant?.variantImgUrl
        ? [variant.variantImgUrl]
        : [];
    }

    console.log('Gallery hiện tại:', this.product.galleryUrls);
  }



  youtubeUrl: any
  loadProduct(slug: string) {
    this.loadingService.show(); // ✅ bật loading khi bắt đầu load

    this.productService.getBySlug(slug).subscribe({
      next: (res: any) => {
        console.log("🚀 This is! __ res:", res)
        const galleryUrls: string[] = res?.galleryUrls || [];
        const allImages = res?.mainImageUrl
          ? [res.mainImageUrl, ...galleryUrls] // mainImageUrl ở đầu
          : galleryUrls;
        this.product = {
          ...res,
          galleryUrls: allImages,
          isActive: 1,
        };
        this.recentlyViewedService.add({
          ...res,
          category: this.slugCategoryName
        });
        this.setYoutube(res?.description || '');
        this.recentlyViewed = this.recentlyViewedService.getAll();
        this.selectedImage = this.product?.mainImageUrl || null;
        this.originalGalleryUrls = [...(this.product.galleryUrls || [])];
        if (this.product.variants?.length > 0) {
          this.selectedOption = this.product.variants[0];
          this.selectedImage = null;
        }
        // this.getSameProduct();
        this.fetchProducts()
        this.loadOtherPaged()

      },
      error: (err) => {
        console.error('❌ Lỗi khi lấy sản phẩm theo slug:', err);
        this.loadingService.hide();
      },
      complete: () => {
        this.loadingService.hide();
      },
    });
  }
  youtubeEmbedUrl?: SafeResourceUrl;
  extractYoutubeUrl(html: string): string | null {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.querySelector('oembed[url]')?.getAttribute('url') ?? null;
  }
  setYoutube(html: string) {
    const url = this.extractYoutubeUrl(html);
    if (!url) return;

    const videoId = url.includes('youtu.be')
      ? url.replace('https://youtu.be/', '').split('?')[0]
      : new URL(url).searchParams.get('v');

    if (!videoId) return;

    this.youtubeEmbedUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${videoId}`
      );
  }
  increaseQty() {
    this.quantity++;
  }
  calcDiscount(price: number, salePrice: number): number {
    if (!price || !salePrice || price <= salePrice) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  }

  decreaseQty() {
    if (this.quantity > 1) this.quantity--;
  }
  itemWidthSimilar = 296 + 28; // width card + padding (giống bên trên là được)
  translateXSimilar = 0;

  sanPhamTuongTu = [
    {
      id: 1,
      name: 'Bồn cầu INAX AC-969VN (AC969VN) 1 khối Aqua',
      brand: 'INAX',
      image: 'assets/boncau.png',
      oldPrice: 6200000,
      price: 4420000,
      discount: 29,
      isHot: true,
      slug: 'bon-cau-inax-ac-969vn'
    },
    {
      id: 2,
      name: 'Chậu Lavabo treo tường AL-2298V',
      brand: 'INAX',
      image: 'assets/chaurualavabo.png',
      oldPrice: 3450000,
      price: 2680000,
      discount: 22,
      isHot: true,
      slug: 'chau-lavabo-al-2298v'
    },
    {
      id: 3,
      name: 'Sen tắm nóng lạnh TBG07302V',
      brand: 'INAX',
      image: 'assets/sentam.png',
      oldPrice: 5900000,
      price: 4420000,
      discount: 25,
      isHot: false,
      slug: 'sen-tam-tbg07302v'
    },
    {
      id: 4,
      name: 'Vòi Lavabo LFV-502S',
      brand: 'INAX',
      image: 'assets/voilavabo.png',
      oldPrice: 2450000,
      price: 1980000,
      discount: 19,
      isHot: false,
      slug: 'voi-lavabo-lfv-502s'
    }
  ];
  prevSimilarSlide() {
    this.translateXSimilar = Math.max(this.translateXSimilar - this.itemWidthSimilar, 0);
  }
  @ViewChild('variantContainer', { static: false })
  variantContainer!: ElementRef<HTMLDivElement>;

  scrollVariants(direction: 'prev' | 'next') {
    const container = this.variantContainer.nativeElement;
    const scrollAmount = 160; // = width button + gap

    container.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  }
  nextSimilarSlide() {
    const maxTranslate =
      Math.max(0, this.sanPhamTuongTu.length * this.itemWidthSimilar - this.itemWidthSimilar * 4);
    this.translateXSimilar = Math.min(this.translateXSimilar + this.itemWidthSimilar, maxTranslate);
  }

  get currentStock(): number {
    const variantStock = this.selectedOption?.stockQuantity;
    const productStock = this.product?.stockQuantity;

    return (variantStock ?? productStock ?? 0);
  }
  // ===== SLIDER: SẢN PHẨM ĐÃ XEM =====
  viewedIndex = 0;
  viewedTranslateX = 0;
  viewedItemWidth = 300;

  get maxViewedIndex() {
    return Math.max(this.sanPhamDaXem.length - 4, 0);
  }

  prevViewedSlide() {
    if (this.viewedIndex > 0) {
      this.viewedIndex--;
      this.viewedTranslateX = this.viewedIndex * this.viewedItemWidth;
    }
  }

  nextViewedSlide() {
    if (this.viewedIndex < this.maxViewedIndex) {
      this.viewedIndex++;
      this.viewedTranslateX = this.viewedIndex * this.viewedItemWidth;
    }
  }

  // ===== SLIDER: SẢN PHẨM TƯƠNG TỰ =====
  sameIndex = 0;
  sameTranslateX = 0;
  sameItemWidth = 300;

  get maxSameIndex() {
    return Math.max(this.listSameProduct.length - 4, 0);
  }

  prevSameSlide() {
    if (this.sameIndex > 0) {
      this.sameIndex--;
      this.sameTranslateX = this.sameIndex * this.sameItemWidth;
    }
  }

  nextSameSlide() {
    if (this.sameIndex < this.maxSameIndex) {
      this.sameIndex++;
      this.sameTranslateX = this.sameIndex * this.sameItemWidth;
    }
  }

  goHome() {
    this.router.navigate(['/'])
  }
  goCart() {
    this.router.navigate(['/cart'])

  }
}

