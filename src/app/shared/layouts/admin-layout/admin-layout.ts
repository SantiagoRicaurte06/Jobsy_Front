import { Component, inject, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs/operators';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService, AdminStore, ReportService } from '../../../core/services';
import { LogoComponent } from '../../components/logo/logo';
import { IconComponent } from '../../components/icon/icon';

/** Layout del panel de administración: barra lateral en tinta + contenido. */
@Component({
  selector: 'jobsy-admin-layout',
  standalone: true,
  imports: [IconComponent, RouterOutlet, RouterLink, RouterLinkActive, LogoComponent],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private store = inject(AdminStore);
  private reportService = inject(ReportService);

  readonly user = this.auth.user;

  constructor() {
    // Contadores del menú, la campana y el tablero: antes solo se cargaban al
    // abrir Reportes, y en el resto del panel salían en 0.
    this.reportService.cargar(true, true);
  }

  /** Los contadores del menú salen del almacén, así que se actualizan solos. */
  readonly groups = computed(() => [
    {
      title: 'Resumen',
      items: [
        { path: '/admin/dashboard', label: 'Tablero', icon: 'chart-column', badge: null },
        { path: '/admin/analiticas', label: 'Analíticas', icon: 'trending-up', badge: null },
      ],
    },
    {
      title: 'Tienda',
      items: [
        { path: '/admin/productos', label: 'Productos', icon: 'package', badge: this.store.totalProductos() },
        { path: '/admin/categorias', label: 'Categorías', icon: 'folder', badge: null },
        { path: '/admin/inventario', label: 'Inventario', icon: 'clipboard-list', badge: this.store.stockCritico() || null },
      ],
    },
    {
      title: 'Soporte',
      items: [
        { path: '/admin/reportes', label: 'Reportes', icon: 'flag', badge: this.reportService.reportesAbiertos() || null },
      ],
    },
  ]);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  /** Nombre de la sección abierta, para la miga de pan. */
  readonly seccion = computed(() => {
    const url = this.url().split('?')[0];
    const item = this.groups().flatMap((g) => g.items).find((i) => url.startsWith(i.path));
    return item?.label ?? 'Tablero';
  });

  // ---- Avisos de la campana: lo que el admin tiene pendiente ----
  readonly avisosAbiertos = signal(false);
  readonly avisos = computed(() => {
    const reportes = this.reportService.reportesAbiertos();
    const stock = this.store.stockCritico();
    return [
      ...(reportes > 0
        ? [{ texto: `${reportes} ${reportes === 1 ? 'reporte' : 'reportes'} de soporte por atender`, ruta: '/admin/reportes', icon: 'flag' }]
        : []),
      ...(stock > 0
        ? [{ texto: `${stock} ${stock === 1 ? 'producto' : 'productos'} con stock crítico`, ruta: '/admin/inventario', icon: 'triangle-alert' }]
        : []),
    ];
  });

  buscar(termino: string): void {
    this.router.navigate(['/admin/productos'], { queryParams: { q: termino.trim() || null } });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
