import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WalletService } from '../../../../core/services';
import { PaymentMethod } from '../../../../core/models';
import { CheckoutBase } from '../checkout-base';
import * as R from '../../../../core/validation/reglas';

/** Color de marca de cada billetera, para el punto de color de la lista. */
const COLORES: Record<string, string> = {
  nequi: '#8B5CF6',
  daviplata: '#E30613',
};

const NOMBRES: Record<string, string> = {
  nequi: 'Nequi',
  daviplata: 'Daviplata',
};

@Component({
  selector: 'jobsy-digital-wallet',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './billetera.html',
  styleUrl: './billetera.scss',
})
export class DigitalWalletPage extends CheckoutBase implements OnInit {
  private wallet = inject(WalletService);

  readonly billetera = signal<PaymentMethod | ''>('');
  readonly telefono = signal('');

  /**
   * Billeteras que la plataforma acepta ahora mismo.
   *
   * Antes la lista estaba escrita en el codigo (nequi, daviplata, movii,
   * dale) y el pago se enviaba como "billetera", que no es ninguno de los
   * metodos que el servidor conoce: siempre fallaba. Movii y Dale no existen
   * en la tabla, asi que no se ofrecen.
   */
  readonly billeteras = signal<{ value: PaymentMethod; color: string; label: string }[]>([]);

  ngOnInit(): void {
    this.wallet.options().subscribe({
      next: (opciones) => {
        const disponibles = (opciones ?? [])
          .filter((o) => o.disponible && NOMBRES[o.nombre])
          .map((o) => ({
            value: o.nombre as PaymentMethod,
            color: COLORES[o.nombre] ?? '#666666',
            label: NOMBRES[o.nombre],
          }));
        this.billeteras.set(disponibles);
        this.billetera.set(disponibles[0]?.value ?? '');
      },
      error: () => this.error.set('No pudimos cargar las billeteras disponibles.'),
    });
  }

  pagar(): void {
    const elegida = this.billetera();
    if (!elegida) {
      this.error.set('Elige una billetera.');
      return;
    }
    if (!this.telefono()) {
      this.error.set('Escribe el telefono de tu billetera.');
      return;
    }
    const invalido = R.telefono(this.telefono());
    if (invalido) {
      this.error.set(invalido);
      return;
    }
    this.error.set('');
    this.pagarCon(elegida, { correo: this.telefono() });
  }
}
