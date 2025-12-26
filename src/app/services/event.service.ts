import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base/base.service';
import { PagedResult } from '../models/paged-result.model';

export interface EventResponse {
  eventId: number;
  name: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  bannerImage?: string;
  status: string;
  isFeatured: boolean;
  isLive: boolean;
  day?: string;
  month?: string;
  rangePrice?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseService {
  constructor(http: HttpClient) {
    super(http);
  }

  // Lấy toàn bộ event
  getAll(): Observable<EventResponse[]> {
    return this.httpGet<EventResponse[]>('event');
  }

  // Lấy event theo ID
  getById(id: number): Observable<EventResponse> {
    return this.httpGet<EventResponse>(`event/${id}`);
  }

  // Tạo mới event
  create(data: any): Observable<EventResponse> {
    return this.httpPost<EventResponse>('event', data);
  }

  // Cập nhật event
  update(id: number, data: any): Observable<EventResponse> {
    return this.httpPut<EventResponse>(`event/${id}`, data);
  }

  // Xóa event
  delete(id: number): Observable<void> {
    return this.httpDelete<void>(`event/${id}`);
  }

  // Lấy featured event
  getFeatured(): Observable<EventResponse[]> {
    return this.httpGet<EventResponse[]>('event/featured');
  }

  getPaged(pageNumber: number, pageSize: number, searchText?: string) {
    const body = {
      pageNumber,
      pageSize,
      searchText: searchText?.trim() || null
    };

    return this.httpPost<PagedResult<EventResponse>>('event/paged', body);
  }
}
