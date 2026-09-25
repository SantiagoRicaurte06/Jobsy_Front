import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon/icon';
import { CheckoutBase } from '../checkout-base';

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
    if (numero.length < 13 || !this.titular() || !this.cvv()) {
      this.error.set('Revisa el numero, el titular y el CVV.');
      return;
    }
    // Del numero solo salen los cuatro ultimos digitos: el resto no viaja.
    this.pagarCon('tarjeta', {
      titular: this.titular(),
      ultimos4: numero.slice(-4),
    });
  }
}
