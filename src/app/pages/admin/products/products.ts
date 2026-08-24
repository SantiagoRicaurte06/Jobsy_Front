import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminStore } from '../../../core/services';
import { Product, ProductStatus } from '../../../core/models';
import { CopPipe } from '../../../shared/pipes';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';

/** Valores del formulario de producto. */
interface ProductForm {
  nombre: string;
  sku: string;
  categoria: string;
  descripcion: string;
  precio: number;
  stock: number;
  estado: ProductStatus;
  imagenUrl: string;
}

const VACIO: ProductForm = {
  nombre: '', sku: '', categoria: '', descripcion: '',
  precio: 0, stock: 0, estado: 'borrador', imagenUrl: '',
};

@Component({
  selector: 'jobsy-admin-products',
  standalone: true,
  imports: [FormsModule, CopPipe, ModalComponent, EmptyStateComponent],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class AdminProductsPage {
  private store = inject(AdminStore);

  readonly products = this.store.products;
  readonly categories = this.store.categories;

  readonly busqueda = signal('');
  readonly filtroEstado = signal<ProductStatus | 'todos'>('todos');

  /** Modal de alta/edicion. `editando` guarda el id, o null si es alta. */
  readonly modalAbierto = signal(false);
  readonly editando = signal<string | null>(null);
  readonly form = signal<ProductForm>({ ...VACIO });
  readonly error = signal('');

  /** Confirmacion de borrado. */
  readonly porBorrar = signal<Product | null>(null);

  readonly aviso = signal('');

  readonly estados: ProductStatus[] = ['publicado', 'destacado', 'borrador', 'agotado'];

  readonly visibles = computed(() => {
    const q = this.busqueda().toLowerCase().trim();
    const est = this.filtroEstado();

    return this.products().filter((p) => {
      const coincideTexto =
        !q || p.nombre.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const coincideEstado = est === 'todos' || p.estado === est;
      return coincideTexto && coincideEstado;
    });
  });

  // ============ Modal ============
  nuevo(): void {
    this.editando.set(null);
    this.form.set({ ...VACIO, categoria: this.categories()[0]?.nombre ?? '' });
    this.error.set('');
    this.modalAbierto.set(true);
  }

  editar(p: Product): void {
    this.editando.set(p.id);
    this.form.set({
      nombre: p.nombre, sku: p.sku, categoria: p.categoria,
      descripcion: p.descripcion, precio: p.precio, stock: p.stock,
      estado: p.estado, imagenUrl: p.imagenUrl ?? '',
    });
    this.error.set('');
    this.modalAbierto.set(true);
  }

  cerrar(): void {
    this.modalAbierto.set(false);
  }

  /** Actualiza un campo suelto del formulario. */
  set<K extends keyof ProductForm>(campo: K, valor: ProductForm[K]): void {
    this.form.update((f) => ({ ...f, [campo]: valor }));
  }

  guardar(): void {
    const f = this.form();

    if (!f.nombre.trim()) return this.error.set('El nombre es obligatorio.');
    if (!f.categoria) return this.error.set('Elige una categoria.');
    if (f.precio <= 0) return this.error.set('El precio debe ser mayor que cero.');
    if (f.stock < 0) return this.error.set('El stock no puede ser negativo.');

    const id = this.editando();

    if (id) {
      this.store.updateProduct(id, { ...f, imagenUrl: f.imagenUrl || undefined });
      this.avisar(`"${f.nombre}" actualizado.`);
    } else {
      this.store.addProduct({
        ...f,
        sku: f.sku.trim() || this.generarSku(f.nombre),
        moneda: 'COP',
        calificacion: 0,
        imagenUrl: f.imagenUrl || undefined,
      });
      this.avisar(`"${f.nombre}" creado.`);
    }

    this.modalAbierto.set(false);
  }

  // ============ Borrado ============
  pedirBorrado(p: Product): void {
    this.porBorrar.set(p);
  }

  confirmarBorrado(): void {
    const p = this.porBorrar();
    if (!p) return;

    this.store.deleteProduct(p.id);
    this.avisar(`"${p.nombre}" eliminado.`);
    this.porBorrar.set(null);
  }

  // ============ Acciones rapidas ============
  cambiarEstado(p: Product, estado: ProductStatus): void {
    this.store.updateProduct(p.id, { estado });
  }

  reponer(p: Product): void {
    this.store.adjustStock(p.id, 20);
    this.avisar(`+20 unidades a "${p.nombre}".`);
  }

  estadoClass(estado: ProductStatus): string {
    if (estado === 'publicado') return 'badge-success';
    if (estado === 'destacado') return 'badge-info';
    if (estado === 'agotado') return 'badge-danger';
    return 'badge-warning';
  }

  private generarSku(nombre: string): string {
    const base = nombre.trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3) || 'PRD';
    return `JOBSY-${base}-${String(this.products().length + 1).padStart(3, '0')}`;
  }

  private avisar(texto: string): void {
    this.aviso.set(texto);
    setTimeout(() => this.aviso.set(''), 2800);
  }
}
