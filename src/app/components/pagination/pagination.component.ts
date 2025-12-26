import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  @Input() pageNumber = 1;
  @Input() pageSize = 10;
  @Input() totalItem = 0;

  // options 10, 20, 50, 100
  @Input() pageSizeOptions: number[] = [10, 20, 50, 100];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  totalPages = 1;
  pagesToShow: number[] = [];

  ngOnChanges() {
    this.calculatePagination();
  }

  calculatePagination() {
    this.totalPages = Math.max(Math.ceil(this.totalItem / this.pageSize) || 1, 1);

    // nếu pageNumber vượt quá totalPages (vd: đổi pageSize)
    if (this.pageNumber > this.totalPages) this.pageNumber = this.totalPages;
    if (this.pageNumber < 1) this.pageNumber = 1;

    const maxPagesToShow = 5;
    let startPage = Math.max(this.pageNumber - 2, 1);
    let endPage = Math.min(startPage + maxPagesToShow - 1, this.totalPages);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }

    this.pagesToShow = [];
    for (let i = startPage; i <= endPage; i++) this.pagesToShow.push(i);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.pageNumber = page;
    this.pageChange.emit(this.pageNumber);
    this.calculatePagination();
  }

  previousPage() {
    if (this.pageNumber > 1) this.goToPage(this.pageNumber - 1);
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) this.goToPage(this.pageNumber + 1);
  }

  onPageSizeChange(size: number) {
    this.pageSize = Number(size);
    this.pageSizeChange.emit(this.pageSize);

    // thường đổi pageSize thì reset về trang 1 cho chuẩn UX
    this.pageNumber = 1;
    this.pageChange.emit(this.pageNumber);

    this.calculatePagination();
  }
}
