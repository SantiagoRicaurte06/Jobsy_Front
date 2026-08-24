import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services';
import { CopPipe } from '../../../shared/pipes';

/** Contenedor del checkout: pestanas de metodo de pago + resumen del pedido. */
@Component({
  selector: 'jobsy-checkout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CopPipe],
  templateUrl: './pago.html',
  styleUrl: './pago.scss',
})
export class CheckoutPage {
  readonly cart = inject(CartService);

  readonly methods = [
    { path: 'pse', icon: '\u{1F3E6}', label: 'PSE' },
    { path: 'tarjeta', icon: '\u{1F4B3}', label: 'Tarjeta' },
    { path: 'billetera', icon: '\u{1F4F1}', label: 'Billetera' },
    { path: 'saldo', icon: '\u{1F4B0}', label: 'Saldo Jobsy' },
  ];
}
