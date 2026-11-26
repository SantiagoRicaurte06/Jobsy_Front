import { Component, inject, computed, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { AuthService, AdminStore, ReportService } from '../../../core/services';
import { LogoComponent } from '../../components/logo/logo';
import { IconComponent } from '../../components/icon/icon';

/** Layout del panel de administracion: sidebar azul oscuro + contenido. */
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
    // Contadores del menu, la campana y el tablero: antes solo se cargaban al
    // abrir Reportes, y en el resto del panel salian en 0.
    this.reportService.cargar(true, true);
  }

  /** Los contadores del menu salen del almacen, asi que se actualizan solos. */
  readonly groups = computed(() => [
    {
      title: 'Principal',
      items: [
        { path: '/admin/dashboard', label: 'Dashboard', icon: 'chart-column', badge: null },
        { path: '/admin/analiticas', label: 'Analiticas', icon: 'trending-up', badge: null },
      ],
    },
    {
      title: 'Tienda',
      items: [
        { path: '/admin/productos', label: 'Productos', icon: 'package', badge: this.store.totalProductos() },
        { path: '/admin/categorias', label: 'Categorias', icon: 'folder', badge: null },
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

  private url = toSignal(
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd), map(() => this.router.url)),
    { initialValue: this.router.url },
  );

  /** Seccion actual para la miga de pan, segun la ruta. */
  readonly seccion = computed(() => {
    const ruta = this.url().split('?')[0];
    for (const g of this.groups()) {
      const item = g.items.find((i) => ruta.startsWith(i.path));
      if (item) return { grupo: g.title, label: item.label };
    }
    return { grupo: 'Admin', label: 'Dashboard' };
  });

  // ---- Avisos de la campana: lo que el admin tiene pendiente ----
  readonly avisosAbiertos = signal(false);
  readonly avisos = computed(() => [
    ...(this.reportService.reportesAbiertos() > 0
      ? [{ texto: `${this.reportService.reportesAbiertos()} reporte(s) de soporte por atender`, ruta: '/admin/reportes', icon: 'flag' }]
      : []),
    ...(this.store.stockCritico() > 0
      ? [{ texto: `${this.store.stockCritico()} producto(s) con stock critico`, ruta: '/admin/inventario', icon: 'triangle-alert' }]
      : []),
  ]);

  buscar(termino: string): void {
    this.router.navigate(['/admin/productos'], { queryParams: { q: termino.trim() || null } });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
