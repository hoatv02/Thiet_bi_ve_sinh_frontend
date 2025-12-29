import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base/base.service';
import { CategoryRequest } from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class BannerService extends BaseService {

    // Lấy toàn bộ danh mục
    public getList<T>(): Observable<T> {
        return this.httpGet('Banner/GetBanner');
    }
    // Cập nhật danh mục
    public update<T>(body: any): Observable<T> {
        return this.httpPost(`Banner/UpdateBanner`, body);
    }

}
