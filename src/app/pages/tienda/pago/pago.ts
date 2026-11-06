import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService, DeliveryService, ProfileService } from '../../../core/services';
import { DeliveryInfo } from '../../../core/models';
import { CopPipe } from '../../../shared/pipes';
import { IconComponent } from '../../../shared/components/icon/icon';
import * as R from '../../../core/validation/reglas';

/**
 * Checkout en dos pasos: primero a quien y a donde se entrega, despues el
 * metodo de pago (pestanas) con el resumen del pedido al lado.
 *
 * Antes se pasaba directo al pago y el pedido no tenia a donde enviarse.
 */
@Component({
  selector: 'jobsy-checkout',
  standalone: true,
  imports: [IconComponent, FormsModule, RouterOutlet, RouterLink, RouterLinkActive, CopPipe],
  templateUrl: './pago.html',
  styleUrl: './pago.scss',
})
export class CheckoutPage implements OnInit {
  readonly cart = inject(CartService);
  readonly entrega = inject(DeliveryService);
  private perfil = inject(ProfileService);

  readonly methods = [
    { path: 'pse', icon: 'landmark', label: 'PSE' },
    { path: 'tarjeta', icon: 'credit-card', label: 'Tarjeta' },
    { path: 'billetera', icon: 'smartphone', label: 'Billetera' },
    { path: 'saldo', icon: 'banknote', label: 'Saldo Jobsy' },
  ];

  readonly ciudades = R.CIUDADES;
  readonly ejemploDireccion = R.EJEMPLO_DIRECCION;

  // ---- Formulario de entrega ----
  readonly nombre = signal('');
  readonly telefono = signal('');
  readonly direccion = signal('');
  readonly detalle = signal('');
  readonly barrio = signal('');
  readonly ciudad = signal('Yopal');
  readonly notas = signal('');
  readonly recordar = signal(true);
  readonly intentado = signal(false);

  readonly errores = computed(() => ({
    nombre: R.nombrePersona('El nombre de quien recibe', this.nombre()),
    telefono: R.telefono(this.telefono()),
    direccion: R.direccion(this.direccion()),
    detalle: R.texto('El detalle', this.detalle(), 0, 150),
    barrio: R.texto('El barrio', this.barrio(), 0, 100),
    ciudad: (R.CIUDADES as readonly string[]).includes(this.ciudad()) ? null : 'Elige una ciudad de la lista.',
    notas: R.texto('Las indicaciones', this.notas(), 0, 300),
  }));

  ngOnInit(): void {
    const guardados = this.entrega.datos();
    if (guardados) {
      this.llenar(guardados);
      return;
    }
    // Primera compra: se parte de los datos del perfil.
    this.perfil.me().subscribe((u) => {
      if (!u || this.nombre()) return;
      this.nombre.set(`${u.nombre ?? ''} ${u.apellido ?? ''}`.trim());
      this.telefono.set(u.telefono ?? '');
      if (u.ciudad && (R.CIUDADES as readonly string[]).includes(u.ciudad)) this.ciudad.set(u.ciudad);
    });
  }

  private llenar(d: DeliveryInfo): void {
    this.nombre.set(d.nombre);
    this.telefono.set(d.telefono);
    this.direccion.set(d.direccion);
    this.detalle.set(d.detalle ?? '');
    this.barrio.set(d.barrio ?? '');
    this.ciudad.set(d.ciudad);
    this.notas.set(d.notas ?? '');
  }

  continuar(): void {
    this.intentado.set(true);
    if (Object.values(this.errores()).some((e) => e)) return;
    this.entrega.confirmar(
      {
        nombre: this.nombre().trim(),
        telefono: this.telefono().trim(),
        direccion: this.direccion().trim(),
        detalle: this.detalle().trim() || undefined,
        barrio: this.barrio().trim() || undefined,
        ciudad: this.ciudad(),
        notas: this.notas().trim() || undefined,
      },
      this.recordar(),
    );
  }

  cambiar(): void {
    const d = this.entrega.datos();
    if (d) this.llenar(d);
    this.entrega.editar();
  }
}
