import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SettingsService, UserSettings, AuthService } from '../../../core/services';
import { IconComponent } from '../../../shared/components/icon/icon';

/** Valores de partida mientras llega la respuesta del servidor. */
const POR_DEFECTO: UserSettings = {
  perfilPublico: true,
  mostrarCorreo: false,
  mostrarTelefono: false,
  hvVisible: true,
  aparecerBusquedas: true,
  mostrarUbicacion: false,
  dobleFactor: false,
  notifCorreo: true,
  notifPlataforma: true,
  notifNuevasOfertas: true,
  notifActualizaciones: false,
  notifMensajes: true,
  notifPostulaciones: true,
};

/**
 * Preferencias de la cuenta.
 *
 * Antes todo vivia en memoria: el boton de guardar solo encendia un indicador
 * verde, el formulario de contrasena validaba sin cambiar nada y el boton de
 * eliminar la cuenta no hacia nada.
 */
@Component({
  selector: 'jobsy-settings',
  standalone: true,
  imports: [IconComponent, FormsModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.scss',
})
export class SettingsPage implements OnInit {
  private settings = inject(SettingsService);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly valores = signal<UserSettings>({ ...POR_DEFECTO });
  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly guardado = signal(false);
  readonly error = signal('');

  // ---- Seguridad ----
  readonly passwordActual = signal('');
  readonly passwordNueva = signal('');
  readonly passwordConfirm = signal('');
  readonly errorPassword = signal('');
  readonly passwordCambiada = signal(false);

  // ---- Baja ----
  readonly confirmandoBaja = signal(false);
  readonly passwordBaja = signal('');
  readonly errorBaja = signal('');

  ngOnInit(): void {
    this.settings.load().subscribe({
      next: (v) => {
        this.valores.set(v);
        this.cargando.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(e.error?.error?.mensaje ?? 'No pudimos cargar tus preferencias.');
      },
    });
  }

  /** Cambia una preferencia concreta del objeto. */
  set<K extends keyof UserSettings>(campo: K, valor: UserSettings[K]): void {
    this.valores.update((v) => ({ ...v, [campo]: valor }));
  }

  guardar(): void {
    this.guardando.set(true);
    this.error.set('');
    this.settings.save(this.valores()).subscribe({
      next: (v) => {
        this.valores.set(v);
        this.guardando.set(false);
        this.guardado.set(true);
        setTimeout(() => this.guardado.set(false), 2500);
      },
      error: (e: HttpErrorResponse) => {
        this.guardando.set(false);
        this.error.set(e.error?.error?.mensaje ?? 'No pudimos guardar tus preferencias.');
      },
    });
  }

  cambiarPassword(): void {
    this.passwordCambiada.set(false);

    if (this.passwordNueva().length < 8) {
      this.errorPassword.set('La nueva contrasena debe tener al menos 8 caracteres.');
      return;
    }
    if (this.passwordNueva() !== this.passwordConfirm()) {
      this.errorPassword.set('Las contrasenas no coinciden.');
      return;
    }
    this.errorPassword.set('');

    this.settings.changePassword(this.passwordActual(), this.passwordNueva()).subscribe({
      next: () => {
        this.passwordActual.set('');
        this.passwordNueva.set('');
        this.passwordConfirm.set('');
        this.passwordCambiada.set(true);
        setTimeout(() => this.passwordCambiada.set(false), 3000);
      },
      error: (e: HttpErrorResponse) =>
        this.errorPassword.set(e.error?.error?.mensaje ?? 'No pudimos cambiar tu contrasena.'),
    });
  }

  // ---- Baja de la cuenta ----

  pedirBaja(): void {
    this.confirmandoBaja.set(true);
    this.passwordBaja.set('');
    this.errorBaja.set('');
  }

  cancelarBaja(): void {
    this.confirmandoBaja.set(false);
  }

  confirmarBaja(): void {
    if (!this.passwordBaja()) {
      this.errorBaja.set('Escribe tu contrasena para confirmar.');
      return;
    }
    this.settings.deleteAccount(this.passwordBaja()).subscribe({
      next: () => {
        this.auth.logout();
        this.router.navigate(['/']);
      },
      error: (e: HttpErrorResponse) =>
        this.errorBaja.set(e.error?.error?.mensaje ?? 'No pudimos dar de baja tu cuenta.'),
    });
  }
}
