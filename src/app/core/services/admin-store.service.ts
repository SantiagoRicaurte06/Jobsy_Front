import { Injectable, signal, computed, effect } from '@angular/core';
import { Product, Category } from '../models';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../../mocks';

const STORAGE_KEY = 'jobsy_admin_data';

interface AdminData {
  products: Product[];
  categories: Category[];
}

/**
 * Estado editable del panel de administracion.
 *
 * Mantiene productos, categorias y reportes en memoria y los guarda en
 * localStorage, de modo que lo que edites siga ahi al recargar o al moverte
 * entre pantallas.
 *
 * TEMPORAL: cada metodo de escritura se reemplazara por su llamada real a
 * Tienda_APi / Catalogo_api / Soporte_API.
 */
@Injectable({ providedIn: 'root' })
export class AdminStore {
  private _products = signal<Product[]>([]);
  private _categories = signal<Category[]>([]);

  readonly products = this._products.asReadonly();
  readonly categories = this._categories.asReadonly();

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
    this.restore();

    // Cada cambio en cualquiera de las tres listas se persiste.
    effect(() => {
      const data: AdminData = {
        products: this._products(),
        categories: this._categories(),
      };
      this.almacen?.setItem(STORAGE_KEY, JSON.stringify(data));
    });
  }

  /**
   * localStorage solo existe en el navegador: en los tests y en un render de
   * servidor no esta definido. Devolvemos null y el store sigue funcionando,
   * solo que sin persistir.
   */
  private get almacen(): Storage | null {
    return typeof localStorage === 'undefined' ? null : localStorage;
  }

  // ============================================================
  //  Productos
  // ============================================================
  addProduct(data: Omit<Product, 'id'>): Product {
    const nuevo: Product = { ...data, id: `p${Date.now()}` };
    this._products.update((list) => [nuevo, ...list]);
    this.recalcularConteos();
    return nuevo;
  }

  updateProduct(id: string, cambios: Partial<Product>): void {
    this._products.update((list) =>
      list.map((p) => (p.id === id ? { ...p, ...cambios } : p)),
    );
    this.recalcularConteos();
  }

  deleteProduct(id: string): void {
    this._products.update((list) => list.filter((p) => p.id !== id));
    this.recalcularConteos();
  }

  /** Suma (o resta, con delta negativo) unidades al stock. */
  adjustStock(id: string, delta: number): void {
    this._products.update((list) =>
      list.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)),
    );
  }

  // ============================================================
  //  Categorias
  // ============================================================
  addCategory(nombre: string): Category {
    const nueva: Category = {
      id: `c${Date.now()}`,
      nombre,
      slug: this.slugify(nombre),
      cantidadProductos: 0,
    };
    this._categories.update((list) => [...list, nueva]);
    return nueva;
  }

  renameCategory(id: string, nombre: string): void {
    const anterior = this._categories().find((c) => c.id === id)?.nombre;

    this._categories.update((list) =>
      list.map((c) => (c.id === id ? { ...c, nombre, slug: this.slugify(nombre) } : c)),
    );

    // Los productos guardan la categoria por nombre: hay que arrastrarlos.
    if (anterior) {
      this._products.update((list) =>
        list.map((p) => (p.categoria === anterior ? { ...p, categoria: nombre } : p)),
      );
    }
  }

  deleteCategory(id: string): void {
    this._categories.update((list) => list.filter((c) => c.id !== id));
  }

  // ============================================================
  //  Utilidades
  // ============================================================

  /** Devuelve todo a los datos de ejemplo originales. */
  reset(): void {
    this._products.set(structuredClone(MOCK_PRODUCTS));
    this._categories.set(structuredClone(MOCK_CATEGORIES));
    this.recalcularConteos();
  }

  /** Mantiene al dia el contador de productos de cada categoria. */
  private recalcularConteos(): void {
    const productos = this._products();
    this._categories.update((list) =>
      list.map((c) => ({
        ...c,
        cantidadProductos: productos.filter((p) => p.categoria === c.nombre).length,
      })),
    );
  }

  /** "Insumos de Aseo" -> "insumos-de-aseo". NFD + filtro quita las tildes. */
  private slugify(texto: string): string {
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

  private restore(): void {
    try {
      const guardado = this.almacen?.getItem(STORAGE_KEY);
      if (guardado) {
        const data = JSON.parse(guardado) as AdminData;
        this._products.set(data.products ?? []);
        this._categories.set(data.categories ?? []);
        return;
      }
    } catch {
      // Si el JSON esta corrupto, arrancamos limpio.
    }
    this.reset();
  }
}
