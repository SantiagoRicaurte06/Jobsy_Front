import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services';
import { IconComponent } from '../../../shared/components/icon/icon';

interface Paso {
  icon: string;
  title: string;
  path: string;
}

const PASOS_EMPLEADO: Paso[] = [
  { icon: 'file-text', title: 'Completa tu hoja de vida', path: '/app/hoja-de-vida' },
  { icon: 'search', title: 'Mira las ofertas de tu zona', path: '/empleos' },
  { icon: 'calendar', title: 'Marca los días que puedes trabajar', path: '/app/disponibilidad' },
];

const PASOS_EMPLEADOR: Paso[] = [
  { icon: 'plus', title: 'Publica tu primera oferta', path: '/publicar-oferta' },
  { icon: 'users', title: 'Busca personas verificadas', path: '/empleados' },
  { icon: 'settings', title: 'Revisa los datos de tu cuenta', path: '/app/configuracion' },
];

/**
 * Cierre del registro. El asistente deja la sesión abierta: lo que sigue
 * depende del rol. Si no se pudo entrar, se ofrece iniciar sesión.
 */
@Component({
  selector: 'jobsy-account-created',
  standalone: true,
  imports: [IconComponent, RouterLink],
  templateUrl: './cuenta-creada.html',
  styleUrl: './cuenta-creada.scss',
})
export class AccountCreatedPage {
  private auth = inject(AuthService);

  readonly conSesion = this.auth.isLoggedIn;
  readonly nombre = computed(() => this.auth.user()?.nombre?.split(' ')[0] ?? null);
  readonly nextSteps = computed(() => (this.auth.role() === 'empleador' ? PASOS_EMPLEADOR : PASOS_EMPLEADO));
}
