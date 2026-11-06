import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon/icon';
import { CheckoutBase } from '../checkout-base';
import * as R from '../../../../core/validation/reglas';

@Component({
  selector: 'jobsy-card',
  standalone: true,
  imports: [IconComponent, FormsModule],
  templateUrl: './tarjeta.html',
  styleUrl: './tarjeta.scss',
})
export class CardPage extends CheckoutBase {
  readonly numero = signal('');
  readonly titular = signal('');
  readonly vencimiento = signal('');
  readonly cvv = signal('');
  readonly cuotas = signal(1);
  readonly guardar = signal(false);

  readonly opcionesCuotas = [1, 3, 6, 12, 24, 36];

  pagar(): void {
    const numero = this.numero().replace(/\D/g, '');
    const invalido = R.primero(
      /^\d{13,19}$/.test(numero) && luhn(numero) ? null : 'El numero de tarjeta no es valido.',
      R.nombrePersona('El nombre del titular', this.titular()),
      vencimientoValido(this.vencimiento()) ? null : 'La fecha de vencimiento debe ser MM/AA y no estar vencida.',
      /^\d{3,4}$/.test(this.cvv().trim()) ? null : 'El CVV debe tener 3 o 4 digitos.',
    );
    if (invalido) {
      this.error.set(invalido);
      return;
    }
    this.error.set('');
    // Del numero solo salen los cuatro ultimos digitos: el resto no viaja.
    this.pagarCon('tarjeta', {
      titular: this.titular().trim(),
      ultimos4: numero.slice(-4),
    });
  }
}

/** Digito de control de las tarjetas (algoritmo de Luhn): descarta numeros mal tecleados. */
function luhn(numero: string): boolean {
  let suma = 0;
  for (let i = 0; i < numero.length; i++) {
    let d = Number(numero[numero.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    suma += d;
  }
  return suma % 10 === 0;
}

/** "MM/AA" con un mes real y que no haya pasado ya. */
function vencimientoValido(valor: string): boolean {
  const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(valor.trim());
  if (!m) return false;
  const vence = `20${m[2]}-${m[1]}`;
  return vence >= R.mesActual() && vence <= R.hoyISO(0, 20).slice(0, 7);
}
