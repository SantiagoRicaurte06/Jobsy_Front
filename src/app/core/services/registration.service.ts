import { Injectable } from '@angular/core';

/**
 * Estado del asistente de registro.
 *
 * Acumula lo que el usuario va rellenando en /registro/* (datos personales,
 * modalidad de trabajo, ubicacion y foto) y se limpia al terminar.
 */
@Injectable({ providedIn: 'root' })
export class RegistrationService {
  // TODO: signal con el borrador, metodo patch() para ir guardando cada paso
  // y reset() al completar el registro.
}
