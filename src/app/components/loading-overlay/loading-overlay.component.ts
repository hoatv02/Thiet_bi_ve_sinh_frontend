import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [],
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.css'
})
export class LoadingOverlayComponent {
   isLoading = false;

  constructor(private loadingService: LoadingService) {
    this.loadingService.loading$.subscribe((state) => {
      this.isLoading = state;
    });
  }

}
