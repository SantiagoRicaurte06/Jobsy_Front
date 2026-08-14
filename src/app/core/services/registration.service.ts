import { Injectable, signal, computed } from '@angular/core';
import { UserRole } from '../models';

/**
 * Estado del asistente de registro.
 *
 * Acumula lo que el usuario va rellenando en /registro/* (datos personales,
 * modalidad de trabajo, ubicacion y foto) y se limpia al terminar.
 */
@Injectable({ providedIn: 'root' })
export class RegistrationService {
  /** Rol elegido en el paso "Seleccionar rol". */
  private _rol = signal<UserRole | null>(null);
  readonly rol = computed(() => this._rol());

  /** Pasos que muestra la barra de progreso. */
  readonly steps = ['Datos personales', 'Modalidad de trabajo', 'Ubicacion y foto'];

  setRol(rol: UserRole | null): void {
    this._rol.set(rol);
  }

  reset(): void {
    this._rol.set(null);
  }

  // TODO: signal con el resto del borrador (datos personales, modalidad,
  // ubicacion) y un patch() para ir guardando cada paso.
}
