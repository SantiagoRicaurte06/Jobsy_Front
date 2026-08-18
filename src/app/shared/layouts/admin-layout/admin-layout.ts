import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService, AdminStore } from '../../../core/services';
import { LogoComponent } from '../../components/logo/logo';

/** Layout del panel de administracion: sidebar azul oscuro + contenido. */
@Component({
  selector: 'jobsy-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LogoComponent],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private store = inject(AdminStore);

  readonly user = this.auth.user;

  /** Los contadores del menu salen del almacen, asi que se actualizan solos. */
  readonly groups = computed(() => [
    {
      title: 'Principal',
      items: [
        { path: '/admin/dashboard', label: 'Dashboard', icon: '\u{1F4CA}', badge: null },
        { path: '/admin/analiticas', label: 'Analiticas', icon: '\u{1F4C8}', badge: null },
      ],
    },
    {
      title: 'Tienda',
      items: [
        { path: '/admin/productos', label: 'Productos', icon: '\u{1F4E6}', badge: this.store.totalProductos() },
        { path: '/admin/categorias', label: 'Categorias', icon: '\u{1F5C2}', badge: null },
        { path: '/admin/inventario', label: 'Inventario', icon: '\u{1F4CB}', badge: this.store.stockCritico() || null },
      ],
    },
    {
      title: 'Soporte',
      items: [
        { path: '/admin/reportes', label: 'Reportes', icon: '\u{1F6A9}', badge: this.store.reportesAbiertos() || null },
      ],
    },
  ]);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
