import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Product, Category } from '../models';
import { AdminService, ProductPayload } from './admin.service';
import { ProductService } from './product.service';
import { environment } from '../../../environments/environment';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../../mocks';

/**
 * Estado del panel de administracion.
 *
 * Antes mantenia productos y categorias en localStorage: lo que editaba el
 * administrador no salia de su navegador, no llegaba a la base y no se veia en
 * la tienda. Ahora cada cambio va al servidor y la lista se refresca con lo
 * que este responde, que es la version que vale.
 *
 * Los metodos siguen siendo sincronos para no cambiar las pantallas: aplican
 * el cambio en la lista de inmediato y lo deshacen si el servidor lo rechaza,
 * dejando el motivo en `error`.
 */
@Injectable({ providedIn: 'root' })
export class AdminStore {
  private admin = inject(AdminService);
  private productos = inject(ProductService);

  private _products = signal<Product[]>([]);
  private _categories = signal<Category[]>([]);
  private _cargando = signal(false);
  private _error = signal<string | null>(null);

  readonly products = this._products.asReadonly();
  readonly categories = this._categories.asReadonly();
  readonly cargando = this._cargando.asReadonly();
  /** Ultimo rechazo del servidor (sin stock, categoria con productos...). */
  readonly error = this._error.asReadonly();

  // ---- Metricas derivadas: se recalculan solas al editar ----
  readonly totalProductos = computed(() => this._products().length);

  readonly unidadesTotales = computed(() =>
    this._products().reduce((suma, p) => suma + p.stock, 0),
  );

  readonly valorInventario = computed(() =>
    this._products().reduce((suma, p) => suma + p.stock * p.precio, 0),
  );

  readonly stockCritico = computed(() => this._products().filter((p) => p.stock <= 2).length);
  readonly stockBajo = computed(
    () => this._products().filter((p) => p.stock > 2 && p.stock <= 10).length,
  );

  /** Productos ordenados de menor a mayor stock: los que urge reponer. */
  readonly porReponer = computed(() =>
    [...this._products()].sort((a, b) => a.stock - b.stock).slice(0, 5),
  );

  constructor() {
    this.cargar();
  }

  /** Trae catalogo y categorias del servidor. */
  cargar(): void {
    if (environment.useMocks) {
      this._products.set(structuredClone(MOCK_PRODUCTS));
      this._categories.set(structuredClone(MOCK_CATEGORIES));
      return;
    }
    this._cargando.set(true);
    forkJoin({
      productos: this.admin.products(),
      categorias: this.productos.categories(),
    }).subscribe({
      next: ({ productos, categorias }) => {
        this._products.set(productos ?? []);
        this._categories.set(categorias ?? []);
        this._cargando.set(false);
        this._error.set(null);
      },
      error: (e: HttpErrorResponse) => {
        this._cargando.set(false);
        this._error.set(mensaje(e, 'No pudimos cargar el catalogo.'));
      },
    });
  }

  limpiarError(): void {
    this._error.set(null);
  }

  // ============================================================
  //  Productos
  // ============================================================

  /**
   * Da de alta un producto.
   *
   * Devuelve una fila provisional para que la pantalla pueda seguir; el id
   * definitivo lo pone el servidor y llega con la respuesta.
   */
  addProduct(data: Omit<Product, 'id'>): Product {
    const provisional: Product = { ...data, id: `nuevo-${Date.now()}` };
    this._products.update((list) => [provisional, ...list]);

    this.escribir(this.admin.createProduct(aPayload(data)), (creado) =>
      this._products.update((list) => list.map((p) => (p.id === provisional.id ? creado : p))),
    );
    return provisional;
  }

  updateProduct(id: string, cambios: Partial<Product>): void {
    const antes = this._products();
    this._products.update((list) => list.map((p) => (p.id === id ? { ...p, ...cambios } : p)));

    this.escribir(
      this.admin.updateProduct(id, aPayload(cambios)),
      (actualizado) =>
        this._products.update((list) => list.map((p) => (p.id === id ? actualizado : p))),
      antes,
    );
  }

  deleteProduct(id: string): void {
    const antes = this._products();
    this._products.update((list) => list.filter((p) => p.id !== id));
    this.escribir(this.admin.deleteProduct(id), undefined, antes);
  }

  /** Suma (o resta, con delta negativo) unidades al stock. */
  adjustStock(id: string, delta: number): void {
    const antes = this._products();
    this._products.update((list) =>
      list.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)),
    );
    this.escribir(
      this.admin.adjustStock(id, delta),
      (actualizado) =>
        this._products.update((list) => list.map((p) => (p.id === id ? actualizado : p))),
      antes,
    );
  }

  // ============================================================
  //  Categorias
  // ============================================================

  addCategory(nombre: string): Category {
    const provisional: Category = {
      id: `nueva-${Date.now()}`,
      nombre,
      slug: slugify(nombre),
      cantidadProductos: 0,
    };
    this._categories.update((list) => [...list, provisional]);

    this.escribirCategoria(this.admin.createCategory(nombre), (creada) =>
      this._categories.update((list) =>
        list.map((c) => (c.id === provisional.id ? { ...creada, cantidadProductos: 0 } : c)),
      ),
    );
    return provisional;
  }

  /**
   * Renombra una categoria.
   *
   * Los productos la referencian por id en la base, pero el modelo del
   * frontend los guarda por nombre, asi que aqui hay que arrastrarlos.
   */
  renameCategory(id: string, nombre: string): void {
    const antesCat = this._categories();
    const antesProd = this._products();
    const anterior = antesCat.find((c) => c.id === id)?.nombre;

    this._categories.update((list) =>
      list.map((c) => (c.id === id ? { ...c, nombre, slug: slugify(nombre) } : c)),
    );
    if (anterior) {
      this._products.update((list) =>
        list.map((p) => (p.categoria === anterior ? { ...p, categoria: nombre } : p)),
      );
    }

    this.escribirCategoria(this.admin.renameCategory(id, nombre), undefined, antesCat, antesProd);
  }

  deleteCategory(id: string): void {
    const antes = this._categories();
    this._categories.update((list) => list.filter((c) => c.id !== id));
    this.escribirCategoria(this.admin.deleteCategory(id), undefined, antes);
  }

  // ============================================================
  //  Internos
  // ============================================================

  private escribir<T>(
    peticion: Observable<T>,
    alLlegar?: (valor: T) => void,
    revertirA?: Product[],
  ): void {
    peticion.subscribe({
      next: (valor) => {
        alLlegar?.(valor);
        this._error.set(null);
        // El conteo por categoria lo lleva el servidor.
        this.recargarCategorias();
      },
      error: (e: HttpErrorResponse) => {
        if (revertirA) this._products.set(revertirA);
        else this.cargar();
        this._error.set(mensaje(e, 'No pudimos guardar el cambio.'));
      },
    });
  }

  private escribirCategoria<T>(
    peticion: Observable<T>,
    alLlegar?: (valor: T) => void,
    revertirCat?: Category[],
    revertirProd?: Product[],
  ): void {
    peticion.subscribe({
      next: (valor) => {
        alLlegar?.(valor);
        this._error.set(null);
      },
      error: (e: HttpErrorResponse) => {
        if (revertirCat) this._categories.set(revertirCat);
        if (revertirProd) this._products.set(revertirProd);
        this._error.set(mensaje(e, 'No pudimos guardar la categoria.'));
      },
    });
  }

  private recargarCategorias(): void {
    if (environment.useMocks) return;
    this.productos.categories().subscribe({
      next: (cats) => this._categories.set(cats ?? []),
      error: () => {},
    });
  }
}

/** Traduce el modelo del frontend al cuerpo que espera el servidor. */
function aPayload(p: Partial<Product>): ProductPayload {
  const out: ProductPayload = {};
  if (p.nombre !== undefined) out.nombre = p.nombre;
  if (p.categoria !== undefined) out.categoria = p.categoria;
  if (p.descripcion !== undefined) out.descripcion = p.descripcion;
  if (p.precio !== undefined) out.precio = p.precio;
  if (p.stock !== undefined) out.stock = p.stock;
  if (p.imagenUrl !== undefined) out.imagenUrl = p.imagenUrl ?? '';
  if (p.estado !== undefined) out.estado = p.estado;
  return out;
}

/** Mensaje del servidor si lo hay; si no, uno generico. */
function mensaje(e: HttpErrorResponse, porDefecto: string): string {
  return e.error?.error?.mensaje ?? porDefecto;
}

/** "Insumos de Aseo" -> "insumos-de-aseo". NFD + filtro quita las tildes. */
function slugify(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .split('')
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code < 0x0300 || code > 0x036f; // descarta marcas de acento
    })
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
