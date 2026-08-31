import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminStore } from '../../../core/services';
import { Product } from '../../../core/models';
import { CopPipe } from '../../../shared/pipes';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { IconComponent } from '../../../shared/components/icon/icon';

type StockFilter = 'todos' | 'critico' | 'bajo' | 'ok';

@Component({
  selector: 'jobsy-admin-inventory',
  standalone: true,
  imports: [IconComponent, FormsModule, CopPipe, ModalComponent],
  templateUrl: './inventario.html',
  styleUrl: './inventario.scss',
})
export class AdminInventoryPage {
  private store = inject(AdminStore);

  readonly products = this.store.products;
  readonly unidadesTotales = this.store.unidadesTotales;
  readonly valorInventario = this.store.valorInventario;
  readonly criticos = this.store.stockCritico;
  readonly bajos = this.store.stockBajo;

  readonly filtro = signal<StockFilter>('todos');
  readonly aviso = signal('');

  /** Producto cuyo stock se esta ajustando a mano. */
  readonly ajustando = signal<Product | null>(null);
  readonly nuevoStock = signal(0);

  readonly filtros: { value: StockFilter; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'critico', label: 'Stock critico' },
    { value: 'bajo', label: 'Stock bajo' },
    { value: 'ok', label: 'Stock normal' },
  ];

  readonly visibles = computed(() => {
    const f = this.filtro();
    return this.products().filter((p) => {
      if (f === 'critico') return p.stock <= 2;
      if (f === 'bajo') return p.stock > 2 && p.stock <= 10;
      if (f === 'ok') return p.stock > 10;
      return true;
    });
  });

  // ---- Ajustes rapidos ----
  sumar(p: Product, cantidad: number): void {
    this.store.adjustStock(p.id, cantidad);
    this.avisar(`${cantidad > 0 ? '+' : ''}${cantidad} en "${p.nombre}".`);
  }

  // ---- Ajuste manual ----
  abrirAjuste(p: Product): void {
    this.ajustando.set(p);
    this.nuevoStock.set(p.stock);
  }

  guardarAjuste(): void {
    const p = this.ajustando();
    if (!p) return;

    const valor = Math.max(0, this.nuevoStock());
    this.store.updateProduct(p.id, { stock: valor });
    this.avisar(`"${p.nombre}" queda en ${valor} unidades.`);
    this.ajustando.set(null);
  }

  nivel(stock: number): { clase: string; texto: string } {
    if (stock <= 2) return { clase: 'pildora_error', texto: 'Critico' };
    if (stock <= 10) return { clase: 'pildora_aviso', texto: 'Bajo' };
    return { clase: 'pildora_exito', texto: 'Normal' };
  }

  /** Porcentaje visual de la barra, tomando 50 unidades como referencia. */
  porcentaje(stock: number): number {
    return Math.min(Math.round((stock / 50) * 100), 100);
  }

  private avisar(texto: string): void {
    this.aviso.set(texto);
    setTimeout(() => this.aviso.set(''), 2500);
  }
}
