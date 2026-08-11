import { Injectable, signal, computed } from '@angular/core';
import { Product, CartItem } from '../models';

const ENVIO_FIJO = 8000;

/** Carrito de compras — estado local del cliente (Tienda_APi al confirmar). */
@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().reduce((n, i) => n + i.cantidad, 0));
  readonly subtotal = computed(() => this._items().reduce((n, i) => n + i.product.precio * i.cantidad, 0));
  readonly envio = computed(() => (this._items().length ? ENVIO_FIJO : 0));
  readonly total = computed(() => this.subtotal() + this.envio());
  readonly isEmpty = computed(() => this._items().length === 0);

  add(product: Product, cantidad = 1): void {
    this._items.update((items) => {
      const found = items.find((i) => i.product.id === product.id);
      if (found) return items.map((i) => (i.product.id === product.id ? { ...i, cantidad: i.cantidad + cantidad } : i));
      return [...items, { product, cantidad }];
    });
  }

  updateQuantity(productId: string, cantidad: number): void {
    if (cantidad <= 0) return this.remove(productId);
    this._items.update((items) => items.map((i) => (i.product.id === productId ? { ...i, cantidad } : i)));
  }

  remove(productId: string): void {
    this._items.update((items) => items.filter((i) => i.product.id !== productId));
  }

  clear(): void {
    this._items.set([]);
  }
}
