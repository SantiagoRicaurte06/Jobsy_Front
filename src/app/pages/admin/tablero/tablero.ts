import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService, AdminStats, AdminStore, ReportService } from '../../../core/services';
import { Order } from '../../../core/models';
import { CopPipe } from '../../../shared/pipes';
import { BarChartComponent, BarDatum } from '../../../shared/components/bar-chart/bar-chart';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'jobsy-admin-dashboard',
  standalone: true,
  imports: [RouterLink, CopPipe, BarChartComponent, LoadingSpinnerComponent],
  templateUrl: './tablero.html',
  styleUrl: './tablero.scss',
})
export class AdminDashboardPage implements OnInit {
  private adminService = inject(AdminService);
  private store = inject(AdminStore);
  private reportService = inject(ReportService);

  readonly stats = signal<AdminStats | undefined>(undefined);
  readonly recentOrders = signal<Order[]>([]);
  readonly loading = signal(true);

  // Estos vienen del almacen editable: reflejan lo que acabas de cambiar.
  readonly topProducts = this.store.products;
  readonly totalProductos = this.store.totalProductos;
  readonly stockCritico = this.store.stockCritico;
  readonly valorInventario = this.store.valorInventario;
  readonly reportesAbiertos = this.reportService.reportesAbiertos;
  readonly porReponer = this.store.porReponer;

  /** TEMPORAL: serie de ventas de ejemplo. */
  readonly ventas: BarDatum[] = [
    { label: 'Ene', value: 620 },
    { label: 'Feb', value: 810 },
    { label: 'Mar', value: 940 },
    { label: 'Abr', value: 720 },
    { label: 'May', value: 1180, destacado: true },
    { label: 'Jun', value: 890 },
    { label: 'Jul', value: 500, proyectado: true },
    { label: 'Ago', value: 560, proyectado: true },
  ];

  /** Se recalcula solo cuando editas productos o reportes. */
  readonly resumen = computed(() => [
    { label: 'Productos', value: String(this.totalProductos()), delta: 'en catalogo', tone: 'up' },
    { label: 'Reportes abiertos', value: String(this.reportesAbiertos()), delta: 'por atender', tone: this.reportesAbiertos() > 0 ? 'down' : 'up' },
    { label: 'Stock critico', value: String(this.stockCritico()), delta: this.stockCritico() > 0 ? 'Reponer ya' : 'Todo en orden', tone: this.stockCritico() > 0 ? 'down' : 'up' },
    { label: 'Satisfaccion', value: '98%', delta: '+2% este mes', tone: 'up' },
  ]);

  readonly actividad = [
    { icon: '\u{2705}', text: 'Nueva postulacion de Maria Gonzalez en Casa Familiar Grande', time: 'Hace 5 min' },
    { icon: '\u{1F4E6}', text: 'Pedido #PED-0147 enviado - Kit de Limpieza Profesional', time: 'Hace 22 min' },
    { icon: '\u{26A0}', text: 'Stock bajo en Guantes Industriales x5 - quedan 2 unidades', time: 'Hace 1 hora' },
    { icon: '\u{1F464}', text: 'Nuevo cliente registrado: Pedro Gomez - Yopal, Casanare', time: 'Hace 2 horas' },
    { icon: '\u{2B50}', text: 'Martha C. recibio una nueva resena de 5 estrellas', time: 'Hace 3 horas' },
  ];

  ngOnInit(): void {
    this.adminService.stats().subscribe((s) => {
      this.stats.set(s);
      this.loading.set(false);
    });

    this.adminService.recentOrders(4).subscribe((o) => this.recentOrders.set(o));
  }

  estadoClass(estado: string): string {
    if (estado === 'entregado' || estado === 'publicado') return 'pildora_exito';
    if (estado === 'enviado') return 'pildora_info';
    if (estado === 'cancelado') return 'pildora_error';
    return 'pildora_aviso';
  }
}
