import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

/** Contenedor de la seccion Cuenta: pestanas + contenido. */
@Component({
  selector: 'jobsy-account',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class AccountPage {
  readonly tabs = [
    { path: 'informacion', label: 'Informacion' },
    { path: 'plan', label: 'Plan' },
    { path: 'metodos-pago', label: 'Metodos de pago' },
  ];
}
