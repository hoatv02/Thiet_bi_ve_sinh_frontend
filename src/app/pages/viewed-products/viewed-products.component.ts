import { Component } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { TypeService } from '../../services/type.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-viewed-products',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, PaginationComponent, RouterModule],
  templateUrl: './viewed-products.component.html',
  styleUrl: './viewed-products.component.css'
})
export class ViewedProductsComponent {
  products: any[] = []
  sortOption = 'default';

  goHome() {
    this.router.navigate(['/'])
  }
  goCart() {
    this.router.navigate(['/cart'])

  }
  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private router: Router,
    private loadingService: LoadingService,
    private activeRoute: ActivatedRoute,
    private typeService: TypeService,
  ) {

    this.products =
      JSON.parse(localStorage.getItem('recently_viewed_products') || 'null');
    console.log("🚀 This is! __  this.products:", this.products)

  }
  goToDetail(slug: string) {
    console.log("🚀 This is! __ slug:", slug)
    this.router.navigate(['/detail-product', slug]);
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
