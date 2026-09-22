import { Component, input, output, signal, computed } from '@angular/core';

/**
 * Estrellas de calificacion (0-5).
 *
 * Por defecto es de solo lectura y muestra el valor numerico al lado.
 * Con [editable]="true" se vuelve un control: cada estrella es un boton,
 * previsualiza al pasar el mouse y emite (valueChange) al hacer clic.
 */
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

  /** Cuando es true, el usuario puede fijar la calificacion con clic. */
  readonly editable = input(false);

  /** Se emite con la calificacion elegida (1-5) al hacer clic en una estrella. */
  readonly valueChange = output<number>();

  /** Estrella bajo el cursor mientras se califica (0 = ninguna). */
  private readonly hover = signal(0);

  /** Lo que se pinta: la previsualizacion del hover manda sobre el valor real. */
  private readonly displayValue = computed(() => this.hover() || this.value());

  /** [true, true, true, false, false] segun el redondeo del valor mostrado. */
  readonly stars = computed(() => {
    const rounded = Math.round(this.displayValue());
    return Array.from({ length: 5 }, (_, i) => i < rounded);
  });

  setRating(n: number): void {
    this.valueChange.emit(n);
  }

  previewRating(n: number): void {
    this.hover.set(n);
  }

  clearPreview(): void {
    this.hover.set(0);
  }
}
