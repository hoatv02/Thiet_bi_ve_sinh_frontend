import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base/base.service';
import { PagedResult } from '../models/paged-result.model';
import { ExportProductRequest, PagedProductRequest } from '../models/product.model';

export interface ProductResponse {
  productId: number;
  name: string;
  slug: string;
  sku?: string;
  brandId?: number;
  categoryId?: number;
  description?: string;
  shortDescription?: string;
  price: number;
  discountPercent?: number;
  salePrice: number;
  stockQuantity: number;
  mainImageUrl?: string;
  galleryImages?: string[];
  createdAt?: string;
  updatedAt?: string;
  brandName?: string;
  categoryName?: string;
  isHot?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  // 🔹 Lấy toàn bộ sản phẩm
  getAll(): Observable<ProductResponse[]> {
    return this.httpGet<ProductResponse[]>('product');
  }

  // 🔹 Lấy sản phẩm theo ID
  getById(id: number): Observable<ProductResponse> {
    return this.httpGet<ProductResponse>(`product/${id}`);
  }
  getBySlug(slug: string): Observable<ProductResponse> {
    return this.httpGet<ProductResponse>(`product/slug/${slug}`);
  }

  // 🔹 Tạo mới sản phẩm
  create(data: any): Observable<ProductResponse> {
    return this.httpPost<ProductResponse>('product', data);
  }

  // 🔹 Cập nhật sản phẩm
  update(id: number, data: any): Observable<ProductResponse> {
    return this.httpPut<ProductResponse>(`product/${id}`, data);
  }

  // 🔹 Xóa sản phẩm
  delete(id: number, revert: boolean): Observable<void> {
    return this.httpDelete<void>(`product/${id}/${revert}`);
  }
  // 🔹 Xóa sản phẩm
  deleteBySelect(body: any): Observable<void> {
    return this.httpPost<void>(`product/deletemany`, body);
  }
  searchProducts(query: string): Observable<ProductResponse[]> {
    if (!query || query.trim() === '') {
      return of([]);
    }

    const body = { keyword: query.trim() };
    return this.httpPost<ProductResponse[]>('product/search', body);
  }

  // 🔹 Lấy danh sách phân trang theo API `/api/Product/paged`
  getPaged(body: PagedProductRequest): Observable<PagedResult<ProductResponse>> {
    return this.httpPost<PagedResult<ProductResponse>>('product/paged', body);
  }
  // 🔹 Lấy danh sách phân trang theo API `/api/Product/paged`
  getOtherProduct(body: PagedProductRequest): Observable<PagedResult<ProductResponse>> {
    return this.httpPost<PagedResult<ProductResponse>>('product/otherpaged', body);
  }

  getDeletedPaged(pageNumber: number, pageSize: number): Observable<PagedResult<ProductResponse>> {
    const body = {
      pageNumber,
      pageSize,
    };

    return this.httpPost<PagedResult<ProductResponse>>('product/deleted', body);
  }

  exportExcel(body: ExportProductRequest): Observable<Blob> {
    return this.httpPostFile('product/export', body);
  }
  // admin 

  createProduct(formData: FormData): Observable<any> {
    return this.httpPost<any>('Product', formData);
  }

  updateProduct(formData: FormData, id: number): Observable<any> {
    return this.httpPost<any>(`product/update/${id}`, formData)
  }
  updateActiveStatus(productId: number, isActive: 0 | 1): Observable<any> {
    const body = { productId, isActive };
    return this.httpPost<any>('Product/active', body);
  }
  applyDiscount(body: any): Observable<any> {
    return this.httpPost<any>('Product/apply-discount', body);
  }
  getSameProduct(id: any): Observable<any> {
    return this.httpGet<any>(`product/get-same-product/${id}`);
  }
}
