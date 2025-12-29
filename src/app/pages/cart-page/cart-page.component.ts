import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  templateUrl: './cart-page.component.html',
})
export class CartPageComponent implements OnInit {
  cartItems: any[] = [];

  constructor(private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
  }

  // 🔹 Giảm số lượng
  decreaseQty(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeItem(item);
    }
    this.updateLocal();
  }

  // 🔹 Tăng số lượng
  increaseQty(item: any) {
    item.quantity++;
    this.updateLocal();
  }

  // 🔹 Xóa 1 sản phẩm
  removeItem(item: any) {
    const updated = this.cartItems.filter(i => i.name !== item.name);
    this.cartService.updateCart(updated);
  }
  goHome() {
    this.router.navigate(['/'])
  }
  goCart() {
    this.router.navigate(['/cart'])

  }
  // 🔹 Tính tổng tiền
  getTotal(): number {
    console.log("🚀 This is! __ this.cartItems:", this.cartItems)
    return this.cartItems.reduce(
      (sum, item) => sum + item.salePrice * item.quantity,
      0
    );
  }

  // 🔹 Cập nhật dữ liệu về service + localStorage
  private updateLocal() {
    this.cartService.updateCart(this.cartItems);
  }
}

