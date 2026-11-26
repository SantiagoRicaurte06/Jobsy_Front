import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models';
import { CartService } from '../../../core/services';
import { CopPipe } from '../../pipes';

import { IconComponent } from '../icon/icon';

/**
 * Tarjeta de producto de la tienda. Si el producto ya está en el carrito,
 * el botón "Agregar" se vuelve un control de cantidad en la misma tarjeta.
 */
@Component({
  selector: 'jobsy-product-card',
  standalone: true,
  imports: [IconComponent, RouterLink, CopPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCardComponent {
  readonly product = input.required<Product>();

  readonly agregar = output<Product>();

  private cart = inject(CartService);

  readonly cantidad = computed(
    () => this.cart.items().find((i) => i.product.id === this.product().id)?.cantidad ?? 0,
  );

  cambiar(delta: number): void {
    this.cart.updateQuantity(this.product().id, this.cantidad() + delta);
  }
}
