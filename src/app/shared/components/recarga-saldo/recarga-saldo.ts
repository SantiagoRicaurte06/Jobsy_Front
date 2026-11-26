import { Component, inject, output, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { WalletService } from '../../../core/services';
import { IconComponent } from '../icon/icon';

const MIN = 10000;
const MAX = 2000000;

/** Formulario para recargar el saldo Jobsy con tarjeta. Emite `recargado` al aprobarse. */
@Component({
  selector: 'jobsy-recarga-saldo',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './recarga-saldo.html',
  styleUrl: './recarga-saldo.scss',
})
export class RecargaSaldoComponent {
  private wallet = inject(WalletService);

  readonly recargado = output<number>();
  readonly cancelar = output<void>();

  readonly montos = [20000, 50000, 100000, 200000];
  readonly monto = signal(50000);
  readonly titular = signal('');
  readonly numero = signal('');
  readonly venc = signal('');
  readonly cvv = signal('');
  readonly enviando = signal(false);
  readonly error = signal('');

  /** Validacion local de la tarjeta; el numero completo nunca sale del navegador. */
  private invalido(): string | null {
    const n = this.numero().replace(/\D/g, '');
    if (this.monto() < MIN || this.monto() > MAX) return 'La recarga debe estar entre $10.000 y $2.000.000.';
    if (this.titular().trim().length < 3) return 'Escribe el nombre del titular como aparece en la tarjeta.';
    if (n.length < 13 || n.length > 19 || !luhn(n)) return 'El numero de tarjeta no es valido.';
    const m = /^(\d{2})\/(\d{2})$/.exec(this.venc().trim());
    if (!m || +m[1] < 1 || +m[1] > 12) return 'La fecha de vencimiento debe ser MM/AA.';
    const fin = new Date(2000 + +m[2], +m[1]); // primer dia del mes siguiente
    if (fin <= new Date()) return 'La tarjeta esta vencida.';
    if (!/^\d{3,4}$/.test(this.cvv())) return 'El CVV tiene 3 o 4 digitos.';
    return null;
  }

  recargar(event: Event): void {
    event.preventDefault();
    const malo = this.invalido();
    if (malo) {
      this.error.set(malo);
      return;
    }
    this.enviando.set(true);
    this.error.set('');
    const n = this.numero().replace(/\D/g, '');
    this.wallet.recargar(this.monto(), this.titular().trim(), n.slice(-4)).subscribe({
      next: (r) => {
        this.enviando.set(false);
        if (r.estado !== 'aprobado') {
          this.error.set(r.mensaje || 'El banco no aprobo la recarga.');
          return;
        }
        this.recargado.emit(this.monto());
      },
      error: (e: HttpErrorResponse) => {
        this.enviando.set(false);
        this.error.set(e.error?.error?.mensaje ?? 'No pudimos recargar tu saldo.');
      },
    });
  }
}

/** Digito de control de las tarjetas (algoritmo de Luhn). */
export function luhn(n: string): boolean {
  let suma = 0;
  for (let i = 0; i < n.length; i++) {
    let d = +n[n.length - 1 - i];
    if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; }
    suma += d;
  }
  return suma % 10 === 0;
}
