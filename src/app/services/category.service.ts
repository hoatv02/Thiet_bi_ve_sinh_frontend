import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base/base.service';
import { CategoryRequest } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseService {

  // Lấy toàn bộ danh mục
  public getList<T>(): Observable<T> {
    return this.httpGet('category');
  }

  // Lấy danh mục theo TypeId hoặc Id
  public getByTypeId<T>(id: number | string): Observable<T> {
    return this.httpGet(`category/${id}`);
  }

  // Thêm mới danh mục
  public create<T>(body: any): Observable<any> {
    return this.httpPost('category', body);
  }

  // Cập nhật danh mục
  public update<T>(id: number, body: any): Observable<T> {
    return this.httpPost(`category/update/${id}`, body);
  }

  // Xóa danh mục
  public delete<T>(id: number): Observable<T> {
    return this.httpDelete(`category/${id}`);
  }
}
