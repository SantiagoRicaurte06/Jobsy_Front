import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models';
import { CopPipe } from '../../pipes';
import { RatingStarsComponent } from '../rating-stars/rating-stars';

/** Tarjeta de producto de la tienda. */
@Component({
  selector: 'jobsy-product-card',
  standalone: true,
  imports: [RouterLink, CopPipe, RatingStarsComponent],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCardComponent {
  readonly product = input.required<Product>();

  readonly agregar = output<Product>();
}
