import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
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
        { path: '/admin/reportes', label: 'Reportes', icon: 'flag', badge: this.store.reportesAbiertos() || null },
      ],
    },
  ]);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
