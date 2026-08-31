import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService, CartService } from '../../../../core/services';
import { IconComponent } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'jobsy-digital-wallet',
  standalone: true,
  imports: [IconComponent, FormsModule],
  templateUrl: './billetera.html',
  styleUrl: './billetera.scss',
})
export class DigitalWalletPage {
  private orderService = inject(OrderService);
  private cart = inject(CartService);
  private router = inject(Router);

  readonly billetera = signal('nequi');
  readonly telefono = signal('');
  readonly procesando = signal(false);

  /** Cada billetera se distingue por su color de marca (punto de color). */
  readonly billeteras = [
    { value: 'nequi', color: '#8B5CF6', label: 'Nequi' },
    { value: 'daviplata', color: '#E30613', label: 'Daviplata' },
    { value: 'movii', color: '#FFD100', label: 'Movii' },
    { value: 'dale', color: '#0047BB', label: 'Dale!' },
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
