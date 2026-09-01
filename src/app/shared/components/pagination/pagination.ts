import { Component, input, output, computed } from '@angular/core';
import { IconComponent } from '../icon/icon';

/** Paginacion numerica con flechas de anterior/siguiente. */
@Component({
  selector: 'jobsy-pagination',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class PaginationComponent {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();

  readonly pageChange = output<number>();

  readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1),
  );

  readonly canPrev = computed(() => this.page() > 1);
  readonly canNext = computed(() => this.page() < this.totalPages());

  go(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.page()) return;
    this.pageChange.emit(page);
  }
}
