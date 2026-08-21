import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService, CartService } from '../../../../core/services';

@Component({
  selector: 'jobsy-digital-wallet',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './digital-wallet.html',
  styleUrl: './digital-wallet.scss',
})
export class DigitalWalletPage {
  private orderService = inject(OrderService);
  private cart = inject(CartService);
  private router = inject(Router);

  readonly billetera = signal('nequi');
  readonly telefono = signal('');
  readonly procesando = signal(false);

  readonly billeteras = [
    { value: 'nequi', icon: '\u{1F49C}', label: 'Nequi' },
    { value: 'daviplata', icon: '\u{1F534}', label: 'Daviplata' },
    { value: 'movii', icon: '\u{1F7E1}', label: 'Movii' },
    { value: 'dale', icon: '\u{1F535}', label: 'Dale!' },
  ];

  pagar(): void {
    if (!this.telefono()) return;

    this.procesando.set(true);
    this.orderService.checkout(this.cart.items(), 'billetera').subscribe(() => {
      this.cart.clear();
      this.router.navigate(['/app/cuenta']);
    });
  }
}
