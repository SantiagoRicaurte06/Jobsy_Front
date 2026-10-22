import { Component, OnInit, computed, inject, signal, DestroyRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CartService, OrderService, ProductService } from '../../../core/services';
import { Order, OrderStatus, PaymentMethod } from '../../../core/models';
import { CopPipe } from '../../../shared/pipes';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { IconComponent } from '../../../shared/components/icon/icon';
import { refrescarMientrasVisible } from '../../../core/utils/refresco';

type Filtro = 'todos' | 'en_curso' | 'entregados' | 'cancelados';

const ETIQUETA: Record<OrderStatus, string> = {
  pendiente: 'Pago pendiente',
  pagado: 'Pagado',
  procesando: 'Preparando',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
  reembolsado: 'Reembolsado',
};

const METODO: Record<PaymentMethod, string> = {
  pse: 'PSE',
  tarjeta: 'Tarjeta',
  nequi: 'Nequi',
  daviplata: 'Daviplata',
  saldo_jobsy: 'Saldo Jobsy',
};

/** Seguimiento de un pedido que sigue su curso normal. */
const PASOS: OrderStatus[] = ['pagado', 'procesando', 'enviado', 'entregado'];

/**
 * Historial de compras de la tienda.
 *
 * Antes los pedidos eran una tabla dentro de "Mi cuenta" y el pago terminaba
 * alli, sin decir que habia pasado con la compra.
 */
@Component({
  selector: 'jobsy-my-orders',
  standalone: true,
  imports: [RouterLink, DatePipe, CopPipe, EmptyStateComponent, LoadingSpinnerComponent, IconComponent],
  templateUrl: './mis-pedidos.html',
  styleUrl: './mis-pedidos.scss',
})
export class MyOrdersPage implements OnInit {
  private destroyRef = inject(DestroyRef);
  private orders = inject(OrderService);
  private products = inject(ProductService);
  private cart = inject(CartService);
  private router = inject(Router);
  private ruta = inject(ActivatedRoute);

  readonly pedidos = signal<Order[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly aviso = signal('');
  readonly filtro = signal<Filtro>('todos');
  readonly abierto = signal<string | null>(null);
  readonly ocupado = signal<string | null>(null);
  /** Numero del pedido recien pagado, que llega desde la pantalla de pago. */
  readonly recien = signal<string | null>(null);

  readonly pasos = PASOS;

  readonly visibles = computed(() => {
    const f = this.filtro();
    return this.pedidos().filter((p) => f === 'todos' || this.grupo(p.estado) === f);
  });

  readonly conteo = computed(() => {
    const c: Record<Filtro, number> = { todos: 0, en_curso: 0, entregados: 0, cancelados: 0 };
    for (const p of this.pedidos()) {
      c.todos++;
      c[this.grupo(p.estado)]++;
    }
    return c;
  });

  readonly totalGastado = computed(() =>
    this.pedidos()
      .filter((p) => this.grupo(p.estado) !== 'cancelados' && p.estado !== 'pendiente')
      .reduce((n, p) => n + p.total, 0),
  );

  ngOnInit(): void {
    const numero = this.ruta.snapshot.queryParamMap.get('pedido');
    this.recien.set(numero);
    this.cargar(numero);
    // El estado del envio lo cambia la tienda: se ve sin recargar.
    refrescarMientrasVisible(this.destroyRef, () => this.cargar(null));
  }

  /** Lee los pedidos; con `destacar` abre ese (o el mas reciente si no hay ninguno abierto). */
  private cargar(destacar: string | null): void {
    this.orders.myOrders().subscribe({
      next: (lista) => {
        const ordenados = [...(lista ?? [])].sort((a, b) => b.fecha.localeCompare(a.fecha));
        this.pedidos.set(ordenados);
        // El recien pagado se muestra abierto; si no, el mas reciente.
        if (destacar !== null || this.cargando()) {
          const destacado = ordenados.find((p) => p.numero === destacar) ?? ordenados[0];
          if (destacado) this.abierto.set(destacado.id);
        }
        this.cargando.set(false);
      },
      error: (e: HttpErrorResponse) => {
        if (this.cargando()) this.error.set(e.error?.error?.mensaje ?? 'No pudimos cargar tus pedidos.');
        this.cargando.set(false);
      },
    });
  }

  grupo(estado: OrderStatus): Exclude<Filtro, 'todos'> {
    if (estado === 'entregado') return 'entregados';
    if (estado === 'cancelado' || estado === 'reembolsado') return 'cancelados';
    return 'en_curso';
  }

  alternar(id: string): void {
    this.abierto.update((a) => (a === id ? null : id));
  }

  cerrarAviso(): void {
    this.recien.set(null);
    this.router.navigate([], { queryParams: {}, replaceUrl: true });
  }

  /** Vuelve a meter en el carrito lo de un pedido, con los precios de hoy. */
  repetir(p: Order): void {
    this.ocupado.set(p.id);
    forkJoin(p.items.map((i) => this.products.getById(i.productId).pipe(catchError(() => of(undefined))))).subscribe(
      (productos) => {
        let agregados = 0;
        productos.forEach((prod, i) => {
          if (prod && prod.stock !== 0) {
            this.cart.add(prod, p.items[i].cantidad);
            agregados++;
          }
        });
        this.ocupado.set(null);
        if (!agregados) {
          this.aviso.set('Los productos de ese pedido ya no estan disponibles.');
          return;
        }
        this.router.navigate(['/tienda/carrito']);
      },
    );
  }

  etiqueta(estado: OrderStatus): string {
    return ETIQUETA[estado] ?? estado;
  }

  metodo(m: PaymentMethod | ''): string {
    return m ? (METODO[m] ?? m) : '—';
  }

  unidades(p: Order): number {
    return p.items.reduce((n, i) => n + i.cantidad, 0);
  }

  /** Indice del paso alcanzado en el seguimiento, o -1 si el pedido no sigue el curso normal. */
  paso(estado: OrderStatus): number {
    return PASOS.indexOf(estado);
  }

  badgeClass(estado: OrderStatus): string {
    if (estado === 'entregado' || estado === 'pagado') return 'pildora_exito';
    if (estado === 'enviado' || estado === 'procesando') return 'pildora_info';
    if (estado === 'cancelado') return 'pildora_error';
    return 'pildora_aviso';
  }
}
