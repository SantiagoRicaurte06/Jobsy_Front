import { RecargaSaldoComponent } from '../../../shared/components/recarga-saldo/recarga-saldo';
import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { WalletService, SavedPaymentMethod, PaymentOption } from '../../../core/services';
import { IconComponent } from '../../../shared/components/icon/icon';
import * as R from '../../../core/validation/reglas';

/** Icono por metodo. El servidor devuelve el nombre, no como pintarlo. */
const ICONOS: Record<string, string> = {
  tarjeta: 'credit-card',
  pse: 'landmark',
  nequi: 'smartphone',
  daviplata: 'smartphone',
  saldo_jobsy: 'banknote',
};

const ETIQUETAS: Record<string, string> = {
  tarjeta: 'Tarjeta',
  pse: 'PSE',
  nequi: 'Nequi',
  daviplata: 'Daviplata',
  saldo_jobsy: 'Saldo Jobsy',
};

/**
 * Metodos de pago guardados.
 *
 * La pantalla mostraba tres tarjetas escritas en el codigo y sus botones no
 * hacian nada; el de agregar tampoco existia.
 */
@Component({
  selector: 'jobsy-payment-methods',
  standalone: true,
  imports: [IconComponent, FormsModule, RecargaSaldoComponent],
  templateUrl: './metodos-pago.html',
  styleUrl: './metodos-pago.scss',
})
export class PaymentMethodsPage implements OnInit {
  private wallet = inject(WalletService);

  readonly methods = signal<SavedPaymentMethod[]>([]);
  readonly opciones = signal<PaymentOption[]>([]);
  readonly saldoJobsy = signal(0);
  readonly recargando = signal(false);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly aviso = signal('');

  // ---- Alta ----
  readonly formAbierto = signal(false);
  readonly metodoId = signal('');
  readonly alias = signal('');
  readonly numeroCuenta = signal('');
  readonly esPrincipal = signal(false);
  readonly guardando = signal(false);

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    forkJoin({
      saldo: this.wallet.balance(),
      guardados: this.wallet.savedMethods(),
      opciones: this.wallet.options(),
    }).subscribe({
      next: ({ saldo, guardados, opciones }) => {
        this.saldoJobsy.set(saldo.disponible);
        this.methods.set(guardados ?? []);
        // El saldo Jobsy no se guarda como metodo: es la cuenta misma.
        this.opciones.set(
          (opciones ?? []).filter((o) => o.disponible && o.nombre !== 'saldo_jobsy'),
        );
        this.cargando.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(e.error?.error?.mensaje ?? 'No pudimos cargar tus métodos de pago.');
      },
    });
  }

  // ---- Presentacion ----

  icono(m: SavedPaymentMethod): string {
    return ICONOS[this.nombreMetodo(m.metodoId)] ?? 'credit-card';
  }

  titulo(m: SavedPaymentMethod): string {
    return m.alias || this.etiqueta(this.nombreMetodo(m.metodoId));
  }

  etiqueta(nombre: string): string {
    return ETIQUETAS[nombre] ?? nombre;
  }

  private nombreMetodo(metodoId: string): string {
    return this.opciones().find((o) => o.id === metodoId)?.nombre ?? '';
  }

  // ---- Acciones ----

  abrirForm(): void {
    this.formAbierto.set(true);
    this.metodoId.set(this.opciones()[0]?.id ?? '');
    this.alias.set('');
    this.numeroCuenta.set('');
    this.esPrincipal.set(false);
    this.error.set('');
  }

  cerrarForm(): void {
    this.formAbierto.set(false);
    this.error.set('');
  }

  guardar(): void {
    if (!this.metodoId() || !this.numeroCuenta().trim()) {
      this.error.set('Elige un método y escribe el número de la cuenta.');
      return;
    }
    const invalido = R.primero(
      R.texto('El nombre para identificarlo', this.alias(), 2, 40),
      /^[0-9]{6,20}$/.test(this.numeroCuenta().replace(/[ -]/g, '')) ? null : 'El número de cuenta debe tener entre 6 y 20 dígitos.',
    );
    if (invalido) {
      this.error.set(invalido);
      return;
    }
    this.guardando.set(true);
    this.wallet
      .saveMethod({
        metodoId: this.metodoId(),
        alias: this.alias().trim(),
        numeroCuenta: this.numeroCuenta().trim(),
        esPrincipal: this.esPrincipal(),
      })
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.formAbierto.set(false);
          this.avisar('Método guardado.');
          this.cargar();
        },
        error: (e: HttpErrorResponse) => {
          this.guardando.set(false);
          this.error.set(e.error?.error?.mensaje ?? 'No pudimos guardar el método.');
        },
      });
  }

  /**
   * Hacer principal vuelve a guardar el metodo con esa marca.
   *
   * Hay que pedir el numero otra vez: el servidor solo devuelve los ultimos
   * digitos, asi que el frontend no lo tiene para reenviarlo.
   */
  hacerPrincipal(m: SavedPaymentMethod): void {
    this.abrirForm();
    this.metodoId.set(m.metodoId);
    this.alias.set(m.alias);
    this.esPrincipal.set(true);
    this.error.set('Confirma el número de la cuenta para marcarla como principal.');
  }

  eliminar(id: string): void {
    const antes = this.methods();
    this.methods.update((list) => list.filter((m) => m.id !== id));
    this.wallet.deleteMethod(id).subscribe({
      next: () => this.avisar('Método eliminado.'),
      error: (e: HttpErrorResponse) => {
        this.methods.set(antes);
        this.error.set(e.error?.error?.mensaje ?? 'No pudimos eliminar el método.');
      },
    });
  }

  private avisar(texto: string): void {
    this.aviso.set(texto);
    setTimeout(() => this.aviso.set(''), 2800);
  }

  alRecargar(monto: number): void {
    this.recargando.set(false);
    this.aviso.set(`Recargaste $${monto.toLocaleString('es-CO')} a tu saldo Jobsy.`);
    this.cargar();
  }
}
