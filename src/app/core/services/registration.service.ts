import { Injectable, signal, computed } from '@angular/core';
import { UserRole, WorkModality } from '../models';

/** Datos que se van acumulando durante el onboarding por pasos. */
export interface RegistrationDraft {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: UserRole | null;
  // Paso 1 — datos personales
  nacionalidad: string;
  genero: string;
  fechaNacimiento: string;
  documento: string;
  // Paso 2 — trabajo
  modalidades: WorkModality[];
  experiencia: string;
  especialidades: string[];
  // Paso 3 — ubicacion
  ciudad: string;
  barrio: string;
  distanciaKm: number;
  fotoUrl: string;
}

const EMPTY: RegistrationDraft = {
  nombre: '', apellido: '', email: '', password: '', rol: null,
  nacionalidad: '', genero: '', fechaNacimiento: '', documento: '',
  modalidades: [], experiencia: '', especialidades: [],
  ciudad: '', barrio: '', distanciaKm: 5, fotoUrl: '',
};

/**
 * Estado del asistente de registro.
 * Vive mientras el usuario recorre /registro/*; se limpia al terminar.
 */
@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private _draft = signal<RegistrationDraft>({ ...EMPTY });

  readonly draft = this._draft.asReadonly();
  readonly rol = computed(() => this._draft().rol);

  /** Pasos visibles en la barra de progreso. */
  readonly steps = ['Datos personales', 'Modalidad de trabajo', 'Ubicacion y foto'];

  patch(partial: Partial<RegistrationDraft>): void {
    this._draft.update((d) => ({ ...d, ...partial }));
  }

  reset(): void {
    this._draft.set({ ...EMPTY });
  }
}
