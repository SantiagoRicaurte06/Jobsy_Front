import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckoutBase } from '../checkout-base';

@Component({
  selector: 'jobsy-pse',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pse.html',
  styleUrl: './pse.scss',
})
export class PsePage extends CheckoutBase {
  readonly banco = signal('');
  readonly tipoPersona = signal('natural');
  readonly tipoDocumento = signal('CC');
  readonly documento = signal('');
  readonly email = signal('');

  readonly bancos = [
    'Bancolombia', 'Banco de Bogota', 'Davivienda', 'BBVA Colombia',
    'Banco de Occidente', 'Nequi', 'Banco Popular', 'Scotiabank Colpatria',
  ];

  pagar(): void {
    if (!this.banco() || !this.documento()) {
      this.error.set('Elige tu banco y escribe tu documento.');
      return;
    }
    // PSE devuelve una URL del portal del banco; la base la sigue.
    this.pagarCon('pse', {
      banco: this.banco(),
      tipoCuenta: this.tipoPersona() === 'juridica' ? 'corriente' : 'ahorros',
      correo: this.email(),
    });
  }
}
