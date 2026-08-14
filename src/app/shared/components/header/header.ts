import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService, CartService } from '../../../core/services';
import { LogoComponent } from '../logo/logo';

/** Cabecera del sitio publico. Cambia segun haya sesion iniciada o no. */
@Component({
  selector: 'jobsy-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LogoComponent],
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

  /** Menu movil y menu de usuario. */
  readonly menuOpen = signal(false);
  readonly userMenuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update((v) => !v);
  }

  closeMenus(): void {
    this.menuOpen.set(false);
    this.userMenuOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.closeMenus();
    this.router.navigate(['/']);
  }
}
