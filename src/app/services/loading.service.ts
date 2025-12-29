import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  /** Bật loading */
  show() {
    this.loading.next(true);
  }

  /** Tắt loading */
  hide() {
    this.loading.next(false);
  }

  /** Đặt trạng thái loading trực tiếp */
  setLoading(isLoading: boolean) {
    this.loading.next(isLoading);
  }
}
