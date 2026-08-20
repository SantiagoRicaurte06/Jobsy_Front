import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService, CartService } from '../../../../core/services';

@Component({
  selector: 'jobsy-pse',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pse.html',
  styleUrl: './pse.scss',
})
export class PsePage {
  private orderService = inject(OrderService);
  private cart = inject(CartService);
  private router = inject(Router);

  readonly banco = signal('');
  readonly tipoPersona = signal('natural');
  readonly tipoDocumento = signal('CC');
  readonly documento = signal('');
  readonly email = signal('');
  readonly procesando = signal(false);

  readonly bancos = [
    'Bancolombia', 'Banco de Bogota', 'Davivienda', 'BBVA Colombia',
    'Banco de Occidente', 'Nequi', 'Banco Popular', 'Scotiabank Colpatria',
  ];

  pagar(): void {
    if (!this.banco() || !this.documento()) return;

    this.procesando.set(true);
    this.orderService.checkout(this.cart.items(), 'pse').subscribe(() => {
      this.cart.clear();
      this.router.navigate(['/app/cuenta']);
    });
  }
}
