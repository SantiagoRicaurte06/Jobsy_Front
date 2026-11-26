import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { WalletService, PaymentRecord } from '../../../../core/services';
import { CheckoutBase } from '../checkout-base';
import { RecargaSaldoComponent } from '../../../../shared/components/recarga-saldo/recarga-saldo';

@Component({
  selector: 'jobsy-balance',
  standalone: true,
  imports: [RecargaSaldoComponent],
  templateUrl: './saldo.html',
  styleUrl: './saldo.scss',
})
export class BalancePage extends CheckoutBase implements OnInit {
  private wallet = inject(WalletService);

  readonly saldo = signal(0);
  readonly cargando = signal(true);
  /** Movimientos reales de la cuenta; antes eran tres lineas de ejemplo. */
  readonly movimientos = signal<PaymentRecord[]>([]);

  readonly suficiente = computed(() => this.saldo() >= this.cart.total());
  readonly restante = computed(() => this.saldo() - this.cart.total());
  readonly faltante = computed(() => this.cart.total() - this.saldo());

  readonly recargando = signal(false);

  ngOnInit(): void {
    this.cargarSaldo();
  }

  /** Tras recargar se vuelve a pedir saldo y movimientos al servidor. */
  alRecargar(): void {
    this.recargando.set(false);
    this.cargarSaldo();
  }

  private cargarSaldo(): void {
    forkJoin({ saldo: this.wallet.balance(), pagos: this.wallet.payments() }).subscribe({
      next: ({ saldo, pagos }) => {
        this.saldo.set(saldo.disponible);
        this.movimientos.set((pagos ?? []).slice(0, 5));
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('No pudimos consultar tu saldo.');
      },
    });
  }

  pagar(): void {
    if (!this.suficiente()) return;
    this.pagarCon('saldo_jobsy');
  }

  /** "aprobado" suma, el resto resta o queda pendiente. */
  concepto(m: PaymentRecord): string {
    const metodo = m.metodo ? ` con ${m.metodo}` : '';
    if (m.concepto) return `${m.concepto}${metodo}`;
    return m.pedidoId ? `Pedido ${m.pedidoId}${metodo}` : `Movimiento${metodo}`;
  }

  /** Las recargas suman al saldo; los pagos restan. */
  formatear(m: PaymentRecord): string {
    return `${m.concepto ? '+' : '-'}$${Math.abs(m.monto).toLocaleString('es-CO')}`;
  }

  cuando(fecha: string): string {
    const d = new Date(fecha);
    return isNaN(d.getTime())
      ? fecha
      : d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
