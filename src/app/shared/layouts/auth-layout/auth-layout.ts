import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LogoComponent } from '../../components/logo/logo';
import { IconComponent } from '../../components/icon/icon';

/**
 * Layout de acceso y registro: a la izquierda el campo azul con lo que
 * Jobsy promete; a la derecha, sobre crema, el formulario de la página.
 */
@Component({
  selector: 'jobsy-auth-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, LogoComponent, IconComponent],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayoutComponent {
  readonly year = new Date().getFullYear();
}
