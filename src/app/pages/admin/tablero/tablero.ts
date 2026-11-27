import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService, AdminStats, AdminStore, ReportService } from '../../../core/services';
import { Order } from '../../../core/models';
import { CopPipe } from '../../../shared/pipes';
import { BarChartComponent, BarDatum } from '../../../shared/components/bar-chart/bar-chart';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { IconComponent } from '../../../shared/components/icon/icon';
import { ConfirmacionComponent } from '../../../shared/components/confirmacion/confirmacion';

@Component({
  selector: 'jobsy-admin-dashboard',
  standalone: true,
  imports: [IconComponent, RouterLink, CopPipe, BarChartComponent, LoadingSpinnerComponent, DatePipe, ConfirmacionComponent],
  templateUrl: './tablero.html',
  styleUrl: './tablero.scss',
})
export class AdminDashboardPage implements OnInit {
  private adminService = inject(AdminService);
  private store = inject(AdminStore);
  private reportService = inject(ReportService);

  readonly stats = signal<AdminStats | undefined>(undefined);
  readonly recentOrders = signal<Order[]>([]);
  readonly cargando = signal(true);
  readonly recargando = signal(false);
  /** Momento real de la última carga (antes era un texto fijo de marzo). */
  readonly cargadoEn = signal(new Date());
  /** Pedido que espera confirmación de reembolso. */
  readonly porReembolsar = signal<Order | null>(null);

  // Estos vienen del almacen editable: reflejan lo que acabas de cambiar.
  readonly topProducts = this.store.products;
  readonly totalProductos = this.store.totalProductos;
  readonly stockCritico = this.store.stockCritico;
  readonly valorInventario = this.store.valorInventario;
  readonly reportesAbiertos = this.reportService.reportesAbiertos;
  readonly porReponer = this.store.porReponer;

  readonly ano = new Date().getFullYear();

  /** Ventas del año por mes, en miles de pesos; el mes en curso va resaltado. */
  readonly ventas = signal<BarDatum[]>([]);

  /** Se recalcula solo cuando editas productos o reportes. */
  readonly resumen = computed(() => {
    return [
      { label: 'Productos', value: String(this.totalProductos()), delta: 'en catálogo', tone: 'up' },
      { label: 'Reportes abiertos', value: String(this.reportesAbiertos()), delta: 'por atender', tone: this.reportesAbiertos() > 0 ? 'down' : 'up' },
      { label: 'Stock critico', value: String(this.stockCritico()), delta: this.stockCritico() > 0 ? 'Reponer ya' : 'Todo en orden', tone: this.stockCritico() > 0 ? 'down' : 'up' },
    ];
  });

  /** Actividad armada con lo que hay en la base: pedidos, stock y reportes. */
  readonly actividad = computed(() => [
    ...this.recentOrders().map((o) => ({
      icon: 'package',
      text: `Pedido ${o.numero} ${o.estado}${o.items[0] ? ' - ' + o.items[0].nombre : ''}`,
      fecha: o.fecha as string | undefined,
    })),
    ...this.porReponer()
      .filter((p) => p.stock <= 10)
      .map((p) => ({ icon: 'triangle-alert', text: `Stock bajo en ${p.nombre} - quedan ${p.stock} unidades`, fecha: undefined })),
    ...(this.reportesAbiertos() > 0
      ? [{ icon: 'bell', text: `${this.reportesAbiertos()} reporte(s) de soporte por atender`, fecha: undefined }]
      : []),
  ]);

  /** Mensaje del ultimo reembolso o del motivo por el que no se pudo. */
  readonly avisoReembolso = signal('');
  readonly reembolsando = signal<string | null>(null);

  ngOnInit(): void {
    this.cargar();
  }

  /** Carga (o recarga) todo el tablero desde el servidor. */
  cargar(): void {
    this.recargando.set(true);
    this.adminService.stats().subscribe({
      next: (s) => {
        this.stats.set(s);
        this.cargadoEn.set(new Date());
        this.cargando.set(false);
        this.recargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.recargando.set(false);
      },
    });

    this.adminService.recentOrders(4).subscribe((o) => this.recentOrders.set(o));

    const mesActual = new Date().getMonth();
    this.adminService.salesByMonth().subscribe((puntos) =>
      this.ventas.set(
        puntos.map((p, i) => ({ label: p.mes, value: Math.round(p.ventas / 1000), destacado: i === mesActual })),
      ),
    );
  }

  /** Solo se reembolsa lo que ya se cobro. */
  reembolsable(o: Order): boolean {
    return o.estado === 'pagado' || o.estado === 'enviado' || o.estado === 'entregado';
  }

  reembolsar(o: Order): void {
    this.porReembolsar.set(o);
  }

  confirmarReembolso(o: Order, motivo: string): void {
    this.porReembolsar.set(null);
    this.reembolsando.set(o.id);
    this.adminService.refundOrder(o.id, motivo || 'Reembolso desde el panel').subscribe({
      next: (r) => {
        this.recentOrders.update((lista) => lista.map((x) => (x.id === o.id ? { ...x, estado: 'reembolsado' as const } : x)));
        this.avisoReembolso.set(r.mensaje);
        this.reembolsando.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.avisoReembolso.set(err?.error?.error?.mensaje ?? 'No se pudo reembolsar el pedido.');
        this.reembolsando.set(null);
      },
    });
  }

  estadoClass(estado: string): string {
    if (estado === 'entregado' || estado === 'publicado') return 'pildora_exito';
    if (estado === 'enviado') return 'pildora_info';
    if (estado === 'cancelado') return 'pildora_error';
    return 'pildora_aviso';
  }
}
