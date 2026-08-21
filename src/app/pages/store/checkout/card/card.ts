import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService, CartService } from '../../../../core/services';

@Component({
  selector: 'jobsy-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class CardPage {
  private orderService = inject(OrderService);
  private cart = inject(CartService);
  private router = inject(Router);

  readonly numero = signal('');
  readonly titular = signal('');
  readonly vencimiento = signal('');
  readonly cvv = signal('');
  readonly cuotas = signal(1);
  readonly guardar = signal(false);
  readonly procesando = signal(false);

  readonly opcionesCuotas = [1, 3, 6, 12, 24, 36];

  pagar(): void {
    if (!this.numero() || !this.titular() || !this.cvv()) return;

    this.procesando.set(true);
    this.orderService.checkout(this.cart.items(), 'tarjeta').subscribe(() => {
      this.cart.clear();
      this.router.navigate(['/app/cuenta']);
    });
  }
}
