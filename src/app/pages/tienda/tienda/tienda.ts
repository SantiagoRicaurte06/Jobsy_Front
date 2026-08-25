import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService, CartService } from '../../../core/services';
import { Product, Category } from '../../../core/models';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'jobsy-store',
  standalone: true,
  imports: [
    RouterLink,
    ProductCardComponent,
    PaginationComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './tienda.html',
  styleUrl: './tienda.scss',
})
export class StorePage implements OnInit {
  private productService = inject(ProductService);
  readonly cart = inject(CartService);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  readonly page = signal(1);
  readonly totalPages = signal(1);
  readonly total = signal(0);
  readonly categoriaActiva = signal<string | null>(null);
  readonly added = signal<string | null>(null);

  ngOnInit(): void {
    this.productService.categories().subscribe((c) => this.categories.set(c));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.productService.list(this.categoriaActiva() ?? undefined, this.page(), 9).subscribe((res) => {
      this.products.set(res.items);
      this.totalPages.set(res.totalPages);
      this.total.set(res.total);
      this.loading.set(false);
    });
  }

  filtrarCategoria(nombre: string | null): void {
    this.categoriaActiva.set(nombre);
    this.page.set(1);
    this.load();
  }

  changePage(p: number): void {
    this.page.set(p);
    this.load();
  }

  agregar(product: Product): void {
    this.cart.add(product);

    // Confirmacion breve junto al producto.
    this.added.set(product.id);
    setTimeout(() => this.added.set(null), 1500);
  }
}
