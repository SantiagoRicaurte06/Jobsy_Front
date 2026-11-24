import { Component, inject, input, signal, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ProductService, CartService } from '../../../core/services';
import { Product } from '../../../core/models';
import { CopPipe } from '../../../shared/pipes';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { IconComponent } from '../../../shared/components/icon/icon';

/**
 * Detalle de un producto de la tienda.
 *
 * Antes tenía reseñas de producto, pero el middleware no las guarda: vivían
 * solo en el navegador y venían precargadas con opiniones inventadas. Se
 * retiraron; la calificación que se muestra es la que manda la API.
 */
@Component({
  selector: 'jobsy-product-detail',
  standalone: true,
  imports: [IconComponent, RouterLink, CopPipe, RatingStarsComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './detalle-producto.html',
  styleUrl: './detalle-producto.scss',
})
export class ProductDetailPage implements OnInit {
  private productService = inject(ProductService);
  private cart = inject(CartService);
  private router = inject(Router);

  readonly id = input.required<string>();

  /** Envío fijo por pedido; el mismo valor que aplica el middleware. */
  readonly envio = 8000;

  readonly product = signal<Product | undefined>(undefined);
  readonly cargando = signal(true);
  readonly cantidad = signal(1);
  readonly agregado = signal(false);

  ngOnInit(): void {
    this.productService.getById(this.id()).subscribe({
      next: (p) => {
        this.product.set(p);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  cambiarCantidad(delta: number): void {
    const max = this.product()?.stock ?? 1;
    this.cantidad.update((c) => Math.min(Math.max(c + delta, 1), max));
  }

  agregar(irAlCarrito = false): void {
    const p = this.product();
    if (!p) return;

    this.cart.add(p, this.cantidad());
    if (irAlCarrito) {
      this.router.navigate(['/tienda/carrito']);
      return;
    }
    this.agregado.set(true);
    setTimeout(() => this.agregado.set(false), 2500);
  }
}
