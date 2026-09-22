import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services';
import { CopPipe } from '../../../shared/pipes';
import { IconComponent } from '../../../shared/components/icon/icon';

/** Contenedor del checkout: pestanas de metodo de pago + resumen del pedido. */
@Component({
  selector: 'jobsy-checkout',
  standalone: true,
  imports: [IconComponent, RouterOutlet, RouterLink, RouterLinkActive, CopPipe],
  templateUrl: './pago.html',
  styleUrl: './pago.scss',
})
export class CheckoutPage {
  readonly cart = inject(CartService);

  readonly methods = [
    { path: 'pse', icon: 'landmark', label: 'PSE' },
    { path: 'tarjeta', icon: 'credit-card', label: 'Tarjeta' },
    { path: 'billetera', icon: 'smartphone', label: 'Billetera' },
    { path: 'saldo', icon: 'banknote', label: 'Saldo Jobsy' },
  ];
}
