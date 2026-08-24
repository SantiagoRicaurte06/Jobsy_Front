import { Component, inject, input, signal, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ProductService, CartService } from '../../../core/services';
import { Product } from '../../../core/models';
import { CopPipe } from '../../../shared/pipes';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'jobsy-product-detail',
  standalone: true,
  imports: [RouterLink, CopPipe, RatingStarsComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetailPage implements OnInit {
  private productService = inject(ProductService);
  private cart = inject(CartService);
  private router = inject(Router);

  readonly id = input.required<string>();

  readonly product = signal<Product | undefined>(undefined);
  readonly loading = signal(true);
  readonly cantidad = signal(1);

  ngOnInit(): void {
    this.productService.getById(this.id()).subscribe((p) => {
      this.product.set(p);
      this.loading.set(false);
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
    if (irAlCarrito) this.router.navigate(['/tienda/carrito']);
  }
}
