import { Injectable } from '@angular/core';
import { BaseService } from './base/base.service';
import { Observable, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TypeService extends BaseService {

  private typesCacheAll$?: Observable<any[]>;   // cache cho /type/all
  private typesCache$?: Observable<any[]>;      // cache cho /type

  constructor(protected override http: HttpClient) {
    super(http);
  }

  public getAll(): Observable<any[]> {
    if (this.typesCache$) {
      return this.typesCache$;
    }

    this.typesCache$ = this.httpGet<any[]>('type').pipe(
      shareReplay(1)
    );

    return this.typesCache$;
  }

  public getTypesList<T extends any[]>(): Observable<T> {
    if (!this.typesCacheAll$) {
      this.typesCacheAll$ = this.httpGet<T>('Type/all').pipe(
        shareReplay(1)
      );
    }

    return this.typesCacheAll$ as Observable<T>;
  }


  public getList(): Observable<any[]> {
    return this.httpGet<any[]>('Type');
  }


  public getById(id: number): Observable<any> {
    return this.httpGet<any>(`Type/${id}`);
  }


  public create(body: any): Observable<any> {
    this.clearCache();
    return this.httpPost<any>('Type/create', body);
  }


  public update(id: number, body: any): Observable<any> {
    this.clearCache();
    return this.httpPost<any>(`Type/update/${id}`, body);
  }


  public delete(id: number): Observable<any> {
    this.clearCache();
    return this.httpPost<any>(`Type/delete/${id}`, {});
  }

   private clearCache(): void {
    this.typesCacheAll$ = undefined;
    this.typesCache$ = undefined;
  }
}
