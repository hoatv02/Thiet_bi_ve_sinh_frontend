import { Injectable } from '@angular/core';
import { BaseService } from './base/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {

  /**
   * ✅ Lấy dữ liệu tổng quan dashboard
   * API: /api/Dashboard/summary
   */
  public getSummary(): Observable<any> {
    return this.httpGet<any>('Dashboard/summary');
  }
}
