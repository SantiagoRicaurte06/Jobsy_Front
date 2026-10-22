import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckoutBase } from '../checkout-base';
import * as R from '../../../../core/validation/reglas';

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
    // Persona natural: cedula; juridica: NIT de 9 o 10 digitos (con o sin digito de verificacion).
    const doc = this.documento().replace(/[. ]/g, '');
    const invalido = R.primero(
      this.tipoPersona() === 'juridica'
        ? (/^[0-9]{9,10}(-[0-9])?$/.test(doc) ? null : 'El NIT debe tener 9 o 10 digitos, por ejemplo 900123456-7.')
        : R.documento(doc, true),
      R.correo(this.email()),
    );
    if (invalido) {
      this.error.set(invalido);
      return;
    }
    this.error.set('');
    // PSE devuelve una URL del portal del banco; la base la sigue.
    this.pagarCon('pse', {
      banco: this.banco(),
      tipoCuenta: this.tipoPersona() === 'juridica' ? 'corriente' : 'ahorros',
      correo: this.email(),
    });
  }
}
