import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private cartItems = new BehaviorSubject<any[]>([]);
    private cartCount = new BehaviorSubject<number>(0);

    // Observable để các component subscribe
    cartItems$ = this.cartItems.asObservable();
    cartCount$ = this.cartCount.asObservable();

    constructor(private notification: NzNotificationService) {
        // Load lại dữ liệu từ localStorage
        const stored = localStorage.getItem('cart');
        if (stored) {
            const parsed = JSON.parse(stored);
            this.cartItems.next(parsed);
            this.cartCount.next(parsed.length);
        }
    }

    addToCart(product: any) {
        const current = this.cartItems.value;

        const isExist = current.some(item => item.name === product.name);

        if (isExist) {
            this.notification.warning(
                'Sản phẩm đã tồn tại',
                'Sản phẩm này đã có trong giỏ hàng!',
                { nzDuration: 2500 }
            );
            return;
        }

        const productWithLastQuantity = {
            ...product,
            lastQuantity: product.stockQuantity
        };

        // ✅ Nếu chưa có → thêm mới
        const updated = [...current, productWithLastQuantity];
        this.cartItems.next(updated);
        this.cartCount.next(updated.length);
        localStorage.setItem('cart', JSON.stringify(updated));

        // 🟢 Thông báo thành công
        this.notification.success(
            'Thành công',
            'Đã thêm sản phẩm vào giỏ hàng!',
            { nzDuration: 2000 }
        );
    }

    removeItem(index: number) {
        const current = [...this.cartItems.value];
        current.splice(index, 1);
        this.cartItems.next(current);
        this.cartCount.next(current.length);
        localStorage.setItem('cart', JSON.stringify(current));
        this.notification.info(
            'Đã xóa sản phẩm',
            'Sản phẩm đã được xóa khỏi giỏ hàng',
            { nzDuration: 2000 }
        );
    }

    // 🧹 Xóa toàn bộ
    clearCart() {
        this.cartItems.next([]);
        this.cartCount.next(0);
        localStorage.removeItem('cart');
        this.notification.info(
            'Giỏ hàng trống',
            'Tất cả sản phẩm đã được xóa khỏi giỏ hàng',
            { nzDuration: 2000, nzPlacement: 'bottomRight' }
        );
    }
    /** 🔁 Cập nhật giỏ hàng (sau khi thay đổi qty / xóa item) */
    updateCart(updatedCart: any[]) {
        this.cartItems.next([...updatedCart]);
        this.cartCount.next(this.getTotalQuantity(updatedCart));
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    }

    /** 🧮 Tính tổng số lượng trong giỏ */
    private getTotalQuantity(items: any[]): number {
        return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    }
}
