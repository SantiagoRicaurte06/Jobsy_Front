import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

/**
 * Preferencias de privacidad y avisos (usuarios.configuraciones).
 *
 * Son las columnas que existen en la tabla. Idioma, moneda y tema no estan:
 * la pantalla los ofrece pero no hay donde guardarlos, asi que siguen siendo
 * una preferencia del navegador.
 */
export interface UserSettings {
  perfilPublico: boolean;
  mostrarCorreo: boolean;
  mostrarTelefono: boolean;
  hvVisible: boolean;
  aparecerBusquedas: boolean;
  mostrarUbicacion: boolean;
  dobleFactor: boolean;
  notifCorreo: boolean;
  notifPlataforma: boolean;
  notifNuevasOfertas: boolean;
  notifActualizaciones: boolean;
  notifMensajes: boolean;
  notifPostulaciones: boolean;
}

/**
 * Usuarios_Api — preferencias de la cuenta y contrasena.
 *
 * La pantalla de configuracion guardaba todo en memoria: el boton de guardar
 * solo encendia un indicador verde, y el formulario de contrasena validaba
 * pero no cambiaba nada.
 */
@Injectable({ providedIn: 'root' })
export class SettingsService {
  private api = inject(ApiService);
  private path = environment.endpoints.usuarios;

  load(): Observable<UserSettings> {
    return this.api.get<UserSettings>(`${this.path}/configuracion`);
  }

  save(settings: UserSettings): Observable<UserSettings> {
    return this.api.put<UserSettings>(`${this.path}/configuracion`, settings);
  }

  /** El servidor exige la contrasena actual aunque haya sesion abierta. */
  changePassword(passwordActual: string, passwordNueva: string): Observable<void> {
    return this.api.put<void>(`${this.path}/password`, { passwordActual, passwordNueva });
  }

  /**
   * Da de baja la cuenta.
   *
   * El servidor la desactiva en vez de borrarla: las contrataciones, pedidos y
   * resenas de otras personas cuelgan de ella. Deja de poder entrar y de
   * aparecer en los listados.
   */
  deleteAccount(password: string): Observable<void> {
    return this.api.post<void>(`${this.path}/baja`, { password });
  }
}
