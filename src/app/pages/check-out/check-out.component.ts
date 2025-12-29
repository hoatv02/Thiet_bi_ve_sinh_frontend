import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { LoadingService } from '../../services/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './check-out.component.html',
})
export class CheckoutPageComponent implements OnInit {
  cartItems: any[] = [];
  isLoading = false;
  orderSuccess = false;
  checkoutData = {
    userId: 1,
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    shippingAddress: '',
    paymentMethod: 'COD',
    discountAmount: 0,
    note: '',
  };
  policyAccepted = false;

  constructor(private cartService: CartService,
    private orderService: OrderService,
    private notification: NzNotificationService,
    private loadingService: LoadingService,
    private router: Router

  ) { }
  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });
  }
  private createEmptyCheckout() {
    return {
      userId: 1,
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      shippingAddress: '',
      paymentMethod: 'COD',
      discountAmount: 0,
      note: '',
    };
  }

  increaseQty(item: any) {
    // if(item.quantity > item.lastQuantity) {
    //   return;
    // }
    item.quantity = (item.quantity || 1) + 1;
    this.cartService.updateCart(this.cartItems);
  }

  decreaseQty(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.updateCart(this.cartItems);
    }
  }

  removeItem(item: any) {
    this.cartItems = this.cartItems.filter((p) => p !== item);
    this.cartService.updateCart(this.cartItems);
    this.notification.info('Sản phẩm đã được xóa', item.name);
  }

  getTotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + (item.salePrice || 0) * (item.quantity || 1),
      0
    );
  }
  clearCart() {
    this.cartService.clearCart();
  }
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }
  submitOrder() {
    const invalidItems = this.cartItems.filter(item => item.quantity > item.lastQuantity);
    if (invalidItems.length > 0) {
      const names = invalidItems.map(i => i.name).join(', ');
      this.notification.error(
        'Đặt hàng không thành công!',
        `Sản phẩm (${names}) vượt quá số lượng ban đầu bạn đã thêm vào giỏ. Vui lòng liên hệ qua zalo!`,
        { nzDuration: 3000 }
      );
      return;
    }

    if (this.cartItems.length === 0) {
      this.notification.warning('Giỏ hàng trống', 'Vui lòng thêm sản phẩm vào giỏ hàng.');
      return;
    }

    if (!this.policyAccepted) {
      this.notification.warning('Chính sách', 'Bạn cần đồng ý với điều khoản trước khi đặt hàng.');
      return;
    }

    if (!this.checkoutData.customerName || !this.checkoutData.customerPhone || !this.checkoutData.shippingAddress) {
      this.notification.error('Thiếu thông tin', 'Vui lòng nhập đầy đủ thông tin thanh toán!');
      return;
    }
    if (this.checkoutData.customerEmail && !this.isValidEmail(this.checkoutData.customerEmail)) {
      this.notification.error('Email không hợp lệ', 'Vui lòng nhập đúng định dạng email (ví dụ: abc@gmail.com).');
      return;
    }

    const orderBody = {
      ...this.checkoutData,
      totalAmount: this.getTotal(),
      discountAmount: 0,
      finalAmount: this.getTotal() - 0,
      items: this.cartItems.map((p) => ({
        productId: p.productId,
        variantId: p.variantId || null,
        productName: p.name,
        sku: p.sku || '',
        quantity: p.quantity || 1,
        price: p.price || 0,
        salePrice: p.salePrice || p.price || 0,
      })),
    };

    this.loadingService.show();
    this.orderService.createOrder(orderBody).subscribe({
      next: (res: any) => {
        console.log("🚀 This is! __ res:", res)
        this.loadingService.hide();
        this.orderSuccess = true;
        this.cartService.clearCart();
        this.notification.success(
          'Đặt hàng thành công 🎉',
          `Cảm ơn bạn ${this.checkoutData.customerName}! Mã đơn hàng của bạn đang được xử lý.`,
          { nzDuration: 4000 }
        );
        this.checkoutData = this.createEmptyCheckout();
        this.policyAccepted = false;

      },
      error: (error: any) => {
        this.loadingService.hide();
        this.notification.error('Đặt hàng thất bại', error?.error?.message || 'Vui lòng thử lại sau.');
      },
    });
  }

  goHome() {
    this.router.navigate(['/'])
  }
  goCart() {
    this.router.navigate(['/cart'])

  }
}

