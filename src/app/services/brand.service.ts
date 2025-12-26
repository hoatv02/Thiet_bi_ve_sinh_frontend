import { Injectable } from '@angular/core';
import { BaseService } from './base/base.service';
import { Observable, shareReplay, tap } from 'rxjs';
import { BrandRequest } from '../models/brand.model';

@Injectable({ providedIn: 'root' })
export class BrandService extends BaseService {
  private brandCache$?: Observable<any[]>;

  private clearCache() {
    this.brandCache$ = undefined;
  }

  public getAll(): Observable<any[]> {
    if (!this.brandCache$) {
      this.brandCache$ = this.httpGet<any[]>('brand').pipe(shareReplay(1));
    }
    return this.brandCache$;
  }

  public create<T>(formData: FormData): Observable<T> {
    return this.httpPost<T>('Brand/create', formData).pipe(
      tap(() => this.clearCache())
    );
  }

  public update<T>(id: number, formData: FormData): Observable<T> {
    return this.httpPost<T>('Brand/update', formData).pipe(
      tap(() => this.clearCache())
    );
  }

  public delete<T>(id: number): Observable<T> {
    return this.httpPost<T>('Brand/delete', id).pipe(
      tap(() => this.clearCache())
    );
  }

  public add<T>(body: BrandRequest): Observable<T> {
    return this.httpPost<T>('brand', body).pipe(
      tap(() => this.clearCache())
    );
  }
}
