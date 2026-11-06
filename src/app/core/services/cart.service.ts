import { Injectable, signal, computed, effect, inject, untracked } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, concat, of, EMPTY } from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';
import { Product, CartItem } from '../models';
import { StorageService, StorageKeys } from './storage.service';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

const ENVIO_FIJO = 8000;

/** Carrito tal como lo devuelve el middleware (GET/POST/PUT/DELETE /tienda/carrito). */
interface CarritoRemoto {
  items: { product: Product; cantidad: number; subtotal: number; precioCambio?: boolean }[];
  subtotal: number;
  envio: number;
  total: number;
}

/**
 * Carrito de compras.
 *
 * Sin sesion vive en localStorage. Con sesion y backend real se guarda en la
 * base (tienda.carritos): al iniciar sesion lo que hubiera en el navegador se
 * suma al carrito guardado, y desde ahi cada cambio pasa por el middleware,
 * que devuelve el carrito completo con los precios vigentes del catalogo.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private storage = inject(StorageService);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private path = `${environment.endpoints.tienda}/carrito`;

  private _items = signal<CartItem[]>(this.storage.get<CartItem[]>(StorageKeys.cart, []));
  private _aviso = signal<string | null>(null);
  private _precioCambio = signal(false);

  readonly items = this._items.asReadonly();
  /** Ultimo problema al sincronizar (sin stock, producto retirado...). */
  readonly aviso = this._aviso.asReadonly();
  /** Algun precio cambio desde que el producto se anadio. */
  readonly precioCambio = this._precioCambio.asReadonly();
  readonly count = computed(() => this._items().reduce((n, i) => n + i.cantidad, 0));
  readonly subtotal = computed(() => this._items().reduce((n, i) => n + i.product.precio * i.cantidad, 0));
  readonly envio = computed(() => (this._items().length ? ENVIO_FIJO : 0));
  readonly total = computed(() => this.subtotal() + this.envio());
  readonly isEmpty = computed(() => this._items().length === 0);

  private get remoto(): boolean {
    return !environment.useMocks && this.auth.isLoggedIn();
  }

  constructor() {
    // Persiste el carrito en localStorage ante cualquier cambio.
    effect(() => this.storage.set(StorageKeys.cart, this._items()));

    // Al iniciar sesion se fusiona lo que el visitante tenia con el carrito
    // guardado; al cerrarla se vacia la copia local para que el siguiente
    // usuario no la herede.
    //
    // Al abrir o recargar la pagina con la sesion ya iniciada NO se fusiona:
    // la copia local es el espejo del carrito guardado, y volver a subirla
    // sumaba las mismas unidades en cada recarga (1, 2, 3...). Solo se lee.
    let habiaSesion: boolean | null = null;
    effect(() => {
      const sesion = this.auth.isLoggedIn();
      if (sesion === habiaSesion) return;
      const primeraVez = habiaSesion === null;
      habiaSesion = sesion;
      untracked(() => {
        if (sesion && !environment.useMocks) {
          if (primeraVez) this.recargar();
          else this.fusionar();
        } else if (!sesion && !primeraVez) this._items.set([]);
      });
    });
  }

  add(product: Product, cantidad = 1): void {
    const anterior = this._items();
    this._items.update((items) => {
      const found = items.find((i) => i.product.id === product.id);
      if (found) return items.map((i) => (i.product.id === product.id ? { ...i, cantidad: i.cantidad + cantidad } : i));
      return [...items, { product, cantidad }];
    });
    if (this.remoto) {
      this.sincronizar(this.api.post<CarritoRemoto>(this.path, { productoId: product.id, cantidad }), anterior);
    }
  }

  updateQuantity(productId: string, cantidad: number): void {
    if (cantidad <= 0) return this.remove(productId);
    const anterior = this._items();
    this._items.update((items) => items.map((i) => (i.product.id === productId ? { ...i, cantidad } : i)));
    if (this.remoto) {
      this.sincronizar(this.api.put<CarritoRemoto>(`${this.path}/${productId}`, { cantidad }), anterior);
    }
  }

  remove(productId: string): void {
    const anterior = this._items();
    this._items.update((items) => items.filter((i) => i.product.id !== productId));
    if (this.remoto) {
      this.sincronizar(this.api.delete<CarritoRemoto>(`${this.path}/${productId}`), anterior);
    }
  }

  /** Vacia el carrito, tambien el guardado en la base. */
  clear(): void {
    const anterior = this._items();
    this._items.set([]);
    if (this.remoto) this.sincronizar(this.api.delete<CarritoRemoto>(this.path), anterior);
  }

  cerrarAviso(): void {
    this._aviso.set(null);
  }

  /** Trae el carrito guardado y reemplaza la copia local. */
  private recargar(): void {
    this.api.get<CarritoRemoto>(this.path).subscribe({
      next: (c) => this.adoptar(c),
      error: () => this._aviso.set('No pudimos recuperar tu carrito guardado.'),
    });
  }

  /** Sube lo que hubiera en el navegador y adopta el carrito resultante. */
  private fusionar(): void {
    const locales = untracked(this._items);
    const subidas: Observable<CarritoRemoto | null>[] = locales.map((i) =>
      this.api
        .post<CarritoRemoto>(this.path, { productoId: i.product.id, cantidad: i.cantidad })
        // Un producto que ya no existe o sin stock no debe tumbar el resto.
        .pipe(catchError(() => of(null))),
    );
    concat(...subidas, this.api.get<CarritoRemoto>(this.path))
      .pipe(last(), map((c) => c as CarritoRemoto))
      .subscribe({
        next: (c) => this.adoptar(c),
        error: () => this._aviso.set('No pudimos recuperar tu carrito guardado.'),
      });
  }

  private sincronizar(peticion: Observable<CarritoRemoto>, anterior: CartItem[]): void {
    peticion
      .pipe(
        tap((c) => this.adoptar(c)),
        catchError((e: HttpErrorResponse) => {
          this._items.set(anterior);
          this._aviso.set(e.error?.error?.mensaje ?? 'No pudimos actualizar tu carrito.');
          return EMPTY;
        }),
      )
      .subscribe();
  }

  private adoptar(c: CarritoRemoto): void {
    this._items.set((c.items ?? []).map((l) => ({ product: l.product, cantidad: l.cantidad })));
    this._precioCambio.set((c.items ?? []).some((l) => l.precioCambio));
    this._aviso.set(null);
  }
}
