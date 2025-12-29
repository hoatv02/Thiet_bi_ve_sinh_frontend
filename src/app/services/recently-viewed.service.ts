import { Injectable } from '@angular/core';
import { ProductResponse } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class RecentlyViewedService {
  private storageKey = 'recently_viewed_products';
  private maxItems = 10;

  getAll(): ProductResponse[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  add(product: ProductResponse) {
    console.log("🚀 This is! __ product:", product)
    let items = this.getAll();

    // Xoá trùng (nếu đã tồn tại)
    items = items.filter(p => p.productId !== product.productId);

    // Thêm lên đầu
    items.unshift(product);

    // Giới hạn số lượng
    if (items.length > this.maxItems) {
      items = items.slice(0, this.maxItems);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  clear() {
    localStorage.removeItem(this.storageKey);
  }
}
