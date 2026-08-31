import { Component, signal } from '@angular/core';
import { IconComponent } from '../../../shared/components/icon/icon';

interface SavedMethod {
  id: string;
  tipo: 'tarjeta' | 'billetera' | 'banco';
  icono: string;
  titulo: string;
  detalle: string;
  principal: boolean;
}

@Component({
  selector: 'jobsy-payment-methods',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './metodos-pago.html',
  styleUrl: './metodos-pago.scss',
})
export class PaymentMethodsPage {
  /** TEMPORAL: metodos guardados de ejemplo. Vendran de suscripciones_API. */
  readonly methods = signal<SavedMethod[]>([
    {
      id: 'pm-1',
      tipo: 'tarjeta',
      icono: 'credit-card',
      titulo: 'Visa terminada en 4242',
      detalle: 'Vence 08/2029',
      principal: true,
    },
    {
      id: 'pm-2',
      tipo: 'billetera',
      icono: 'smartphone',
      titulo: 'Nequi',
      detalle: '300 *** 4567',
      principal: false,
    },
    {
      id: 'pm-3',
      tipo: 'banco',
      icono: 'landmark',
      titulo: 'Bancolombia',
      detalle: 'Cuenta de ahorros *** 8891',
      principal: false,
    },
  ]);

  readonly saldoJobsy = signal(150000);

  hacerPrincipal(id: string): void {
    this.methods.update((list) => list.map((m) => ({ ...m, principal: m.id === id })));
  }

  eliminar(id: string): void {
    this.methods.update((list) => list.filter((m) => m.id !== id));
  }
}
