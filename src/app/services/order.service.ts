import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base/base.service';

export interface OrderItemRequest {
  productId: number;
  variantId?: number;
  productName: string;
  sku?: string;
  quantity: number;
  price: number;
  salePrice?: number;
}
export interface OrderPagedRequest {
  pageNumber: number;
  pageSize: number;
  keyword?: string;
  status?: string;
  dateFrom?: string; // yyyy-MM-dd
  dateTo?: string;   // yyyy-MM-dd
}


export interface OrderRequest {
  userId?: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  paymentMethod?: string;
  totalAmount: number;
  discountAmount?: number;
  finalAmount?: number;
  note?: string;
  items: OrderItemRequest[];
}

export interface OrderResponse {
  orderId: number;
  orderCode?: string;
  userId?: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: OrderItemResponse[];
}

export interface OrderItemResponse {
  orderItemId: number;
  productId: number;
  productName: string;
  sku?: string;
  quantity: number;
  price: number;
  salePrice?: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  createOrder(data: OrderRequest): Observable<OrderResponse> {
    return this.httpPost<OrderResponse>('order', data);
  }

  getAllOrders(): Observable<OrderResponse[]> {
    return this.httpGet<OrderResponse[]>('order');
  }

  getById(id: number): Observable<OrderResponse> {
    return this.httpGet<OrderResponse>(`order/${id}`);
  }

  updateStatus(id: number, status: string): Observable<OrderResponse> {
    return this.httpPost<OrderResponse>(`order/${id}/status`, { status });
  }

  deleteOrder(id: number): Observable<void> {
    return this.httpDelete<void>(`order/${id}`);
  }

  getPaged(req: OrderPagedRequest): Observable<any> {
    const body = {
      pageNumber: req.pageNumber,
      pageSize: req.pageSize,
      keyword: (req.keyword ?? '').trim() || null,
      status: (req.status ?? '').trim() || null,
      dateFrom: req.dateFrom || null,
      dateTo: req.dateTo || null,
    };

    return this.httpPost<any>('order/paged', body);
  }
}
