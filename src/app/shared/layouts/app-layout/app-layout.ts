import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { IconComponent } from '../../components/icon/icon';

interface ItemMenu {
  path: string;
  label: string;
  icon: string;
}

/**
 * Layout del area privada: header + menu lateral del usuario + contenido.
 *
 * El menu depende del rol: el empleador gestiona sus ofertas y las
 * postulaciones que recibe; la empleada sus postulaciones y su hoja de vida.
 */
@Component({
  selector: 'jobsy-app-layout',
  standalone: true,
  imports: [IconComponent, RouterOutlet, RouterLink, RouterLinkActive, HeaderComponent, FooterComponent],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
})
export class AppLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  /** La guarda de rol manda aqui con ?aviso=sin-permiso cuando falta permiso. */
  readonly sinPermiso = toSignal(
    inject(ActivatedRoute).queryParamMap.pipe(map((q) => q.get('aviso') === 'sin-permiso')),
    { initialValue: false },
  );

  cerrarAviso(): void {
    this.router.navigate([], { queryParams: { aviso: null }, queryParamsHandling: 'merge', replaceUrl: true });
  }

  readonly menu = computed<ItemMenu[]>(() => {
    const rol = this.auth.user()?.rol;
    const propios: ItemMenu[] =
      rol === 'empleador'
        ? [
            { path: '/app/mis-ofertas', label: 'Mis ofertas', icon: 'briefcase' },
            { path: '/app/contrataciones', label: 'Contrataciones', icon: 'calendar' },
            { path: '/publicar-oferta', label: 'Publicar oferta', icon: 'square-pen' },
          ]
        : rol === 'empleado'
          ? [
              { path: '/app/mis-postulaciones', label: 'Mis postulaciones', icon: 'clipboard-list' },
              { path: '/app/contrataciones', label: 'Mis trabajos', icon: 'calendar' },
              { path: '/app/hoja-de-vida', label: 'Hoja de vida', icon: 'file-text' },
            ]
          : [];
    return [
      { path: '/app/inicio', label: 'Inicio', icon: 'house' },
      ...propios,
      { path: '/app/perfil', label: 'Perfil', icon: 'user' },
      { path: '/app/pedidos', label: 'Mis pedidos', icon: 'package' },
      { path: '/app/reportes', label: 'Reportes', icon: 'chart-column' },
      { path: '/app/cuenta', label: 'Cuenta', icon: 'credit-card' },
      { path: '/app/configuracion', label: 'Configuracion', icon: 'settings' },
    ];
  });
}
