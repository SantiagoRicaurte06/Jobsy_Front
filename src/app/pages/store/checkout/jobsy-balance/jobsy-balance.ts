import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService, CartService } from '../../../../core/services';

@Component({
  selector: 'jobsy-balance',
  standalone: true,
  imports: [],
  templateUrl: './jobsy-balance.html',
  styleUrl: './jobsy-balance.scss',
})
export class JobsyBalancePage {
  private orderService = inject(OrderService);
  readonly cart = inject(CartService);
  private router = inject(Router);

  /** TEMPORAL: el saldo real vendra de suscripciones_API / Tienda_APi. */
  readonly saldo = signal(150000);
  readonly procesando = signal(false);

  readonly suficiente = computed(() => this.saldo() >= this.cart.total());
  readonly restante = computed(() => this.saldo() - this.cart.total());
  readonly faltante = computed(() => this.cart.total() - this.saldo());

  /** Movimientos recientes de la cuenta Jobsy. */
  readonly movimientos = [
    { concepto: 'Recarga desde Nequi', monto: 100000, fecha: '5 mar 2026' },
    { concepto: 'Pago servicio limpieza', monto: -60000, fecha: '2 mar 2026' },
    { concepto: 'Bono de bienvenida', monto: 110000, fecha: '1 mar 2026' },
  ];

  pagar(): void {
    if (!this.suficiente()) return;

    this.procesando.set(true);
    this.orderService.checkout(this.cart.items(), 'saldo_jobsy').subscribe(() => {
      this.cart.clear();
      this.router.navigate(['/app/cuenta']);
    });
  }

  formatear(valor: number): string {
    const signo = valor < 0 ? '-' : '+';
    return `${signo}$${Math.abs(valor).toLocaleString('es-CO')}`;
  }
}
