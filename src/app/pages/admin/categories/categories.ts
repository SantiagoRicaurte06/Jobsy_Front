import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminStore } from '../../../core/services';
import { Category } from '../../../core/models';
import { ModalComponent } from '../../../shared/components/modal/modal';

@Component({
  selector: 'jobsy-admin-categories',
  standalone: true,
  imports: [FormsModule, ModalComponent],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class AdminCategoriesPage {
  private store = inject(AdminStore);

  readonly categories = this.store.categories;

  readonly nueva = signal('');
  readonly error = signal('');
  readonly aviso = signal('');

  /** Id de la categoria que se esta renombrando en linea. */
  readonly editandoId = signal<string | null>(null);
  readonly nombreEditado = signal('');

  /** Categoria pendiente de confirmar borrado. */
  readonly porBorrar = signal<Category | null>(null);

  // ============ Alta ============
  agregar(): void {
    const nombre = this.nueva().trim();
    if (!nombre) return;

    if (this.existe(nombre)) {
      this.error.set('Ya existe una categoria con ese nombre.');
      return;
    }

    this.store.addCategory(nombre);
    this.nueva.set('');
    this.error.set('');
    this.avisar(`Categoria "${nombre}" creada.`);
  }

  // ============ Edicion en linea ============
  empezarEdicion(c: Category): void {
    this.editandoId.set(c.id);
    this.nombreEditado.set(c.nombre);
    this.error.set('');
  }

  cancelarEdicion(): void {
    this.editandoId.set(null);
  }

  confirmarEdicion(c: Category): void {
    const nombre = this.nombreEditado().trim();
    if (!nombre) return;

    if (nombre !== c.nombre && this.existe(nombre)) {
      this.error.set('Ya existe una categoria con ese nombre.');
      return;
    }

    this.store.renameCategory(c.id, nombre);
    this.editandoId.set(null);
    this.avisar(`Renombrada a "${nombre}". Los productos se actualizaron.`);
  }

  // ============ Borrado ============
  pedirBorrado(c: Category): void {
    this.porBorrar.set(c);
  }

  confirmarBorrado(): void {
    const c = this.porBorrar();
    if (!c) return;

    this.store.deleteCategory(c.id);
    this.avisar(`Categoria "${c.nombre}" eliminada.`);
    this.porBorrar.set(null);
  }

  private existe(nombre: string): boolean {
    return this.categories().some((c) => c.nombre.toLowerCase() === nombre.toLowerCase());
  }

  private avisar(texto: string): void {
    this.aviso.set(texto);
    setTimeout(() => this.aviso.set(''), 2800);
  }
}
