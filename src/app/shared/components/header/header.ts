import { Component, effect, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService, CartService, Notification, NotificationService } from '../../../core/services';
import { LogoComponent } from '../logo/logo';
import { IconComponent } from '../icon/icon';

/** Cabecera del sitio publico. Cambia segun haya sesion iniciada o no. */
@Component({
  selector: 'jobsy-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LogoComponent, IconComponent, DatePipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  readonly cart = inject(CartService);

  readonly isLoggedIn = this.auth.isLoggedIn;
  readonly user = this.auth.user;
  readonly role = this.auth.role;

  readonly avisos = inject(NotificationService);

  /** Menu movil, menu de usuario y bandeja de avisos. */
  readonly menuOpen = signal(false);
  readonly userMenuOpen = signal(false);
  readonly avisosOpen = signal(false);

  constructor() {
    // Con sesion se carga la bandeja y se refresca cada minuto: asi al
    // empleador le aparecen las postulaciones nuevas sin recargar la pagina.
    effect((onCleanup) => {
      if (!this.isLoggedIn()) {
        this.avisos.clear();
        return;
      }
      this.avisos.refresh();
      const intervalo = setInterval(() => this.avisos.refresh(), 60_000);
      onCleanup(() => clearInterval(intervalo));
    });
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update((v) => !v);
    this.avisosOpen.set(false);
  }

  toggleAvisos(): void {
    this.avisosOpen.update((v) => !v);
    this.userMenuOpen.set(false);
    if (this.avisosOpen()) this.avisos.refresh();
  }

  /** Marca el aviso como leido y lleva a donde apunta. */
  abrirAviso(n: Notification): void {
    if (!n.leida) this.avisos.markRead(n.id);
    this.closeMenus();
    if (n.destino) this.router.navigateByUrl(n.destino);
  }

  closeMenus(): void {
    this.menuOpen.set(false);
    this.userMenuOpen.set(false);
    this.avisosOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.closeMenus();
    this.router.navigate(['/']);
  }
}
