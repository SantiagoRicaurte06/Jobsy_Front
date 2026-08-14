import { Component, input, computed } from '@angular/core';

/** Estrellas de calificacion (0-5), con el valor numerico al lado. */
@Component({
  selector: 'jobsy-rating-stars',
  standalone: true,
  imports: [],
  templateUrl: './rating-stars.html',
  styleUrl: './rating-stars.scss',
})
export class RatingStarsComponent {
  readonly value = input.required<number>();
  readonly showValue = input(true);
  readonly reviews = input<number | null>(null);

  /** [true, true, true, false, false] segun el redondeo del valor. */
  readonly stars = computed(() => {
    const rounded = Math.round(this.value());
    return Array.from({ length: 5 }, (_, i) => i < rounded);
  });
}
