import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services';
import { CopPipe } from '../../../shared/pipes';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'jobsy-cart',
  standalone: true,
  imports: [RouterLink, CopPipe, EmptyStateComponent],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartPage {
  readonly cart = inject(CartService);
}
