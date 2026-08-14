import { Component, input } from '@angular/core';

@Component({
  selector: 'jobsy-rating-stars',
  standalone: true,
  imports: [],
  templateUrl: './rating-stars.html',
  styleUrl: './rating-stars.scss',
})
export class RatingStarsComponent {
  /** Calificacion de 0 a 5. */
  readonly value = input.required<number>();

  /** Numero de resenas; null lo oculta. */
  readonly reviews = input<number | null>(null);

  /** Si se muestra el valor numerico junto a las estrellas. */
  readonly showValue = input(true);

  // TODO: maquetar las estrellas a partir de value().
}
