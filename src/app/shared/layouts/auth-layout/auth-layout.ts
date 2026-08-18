import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Layout de autenticacion: tarjeta centrada sobre fondo celeste. */
@Component({
  selector: 'jobsy-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayoutComponent {
  readonly year = new Date().getFullYear();
}
