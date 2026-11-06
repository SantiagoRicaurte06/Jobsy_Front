import { Injectable, signal } from '@angular/core';
import { DeliveryInfo } from '../models';

const CLAVE = 'jobsy.entrega';

/**
 * Datos de entrega del checkout en curso.
 *
 * Los llena el paso "Datos de entrega" y los leen las pantallas de pago al
 * cobrar. Se recuerdan en este navegador para no escribirlos en cada compra.
 */
@Injectable({ providedIn: 'root' })
export class DeliveryService {
  private readonly _datos = signal<DeliveryInfo | null>(leer());
  /** Si el usuario ya reviso y confirmo los datos de esta compra. */
  private readonly _confirmados = signal(false);

  readonly datos = this._datos.asReadonly();
  readonly confirmados = this._confirmados.asReadonly();

  confirmar(datos: DeliveryInfo, recordar: boolean): void {
    this._datos.set(datos);
    this._confirmados.set(true);
    try {
      if (recordar) localStorage.setItem(CLAVE, JSON.stringify(datos));
      else localStorage.removeItem(CLAVE);
    } catch {
      // Sin almacenamiento solo se pierde el autocompletado.
    }
  }

  /** Vuelve al paso de entrega (boton "Cambiar") o empieza otra compra. */
  editar(): void {
    this._confirmados.set(false);
  }
}

function leer(): DeliveryInfo | null {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) ?? 'null');
  } catch {
    return null;
  }
}
