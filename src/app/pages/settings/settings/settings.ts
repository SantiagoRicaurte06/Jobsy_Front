import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'jobsy-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class SettingsPage {
  readonly guardado = signal(false);

  // ---- Notificaciones ----
  readonly notifEmail = signal(true);
  readonly notifPush = signal(true);
  readonly notifOfertas = signal(true);
  readonly notifMensajes = signal(true);
  readonly notifPromos = signal(false);

  // ---- Privacidad ----
  readonly perfilPublico = signal(true);
  readonly mostrarTelefono = signal(false);
  readonly mostrarCalificaciones = signal(true);

  // ---- Preferencias ----
  readonly idioma = signal('es');
  readonly moneda = signal('COP');
  readonly tema = signal('claro');

  // ---- Seguridad ----
  readonly passwordActual = signal('');
  readonly passwordNueva = signal('');
  readonly passwordConfirm = signal('');
  readonly errorPassword = signal('');
  readonly dobleFactor = signal(false);

  guardar(): void {
    this.guardado.set(true);
    setTimeout(() => this.guardado.set(false), 2500);
  }

  cambiarPassword(): void {
    if (this.passwordNueva().length < 8) {
      this.errorPassword.set('La nueva contrasena debe tener al menos 8 caracteres.');
      return;
    }
    if (this.passwordNueva() !== this.passwordConfirm()) {
      this.errorPassword.set('Las contrasenas no coinciden.');
      return;
    }

    this.errorPassword.set('');
    this.passwordActual.set('');
    this.passwordNueva.set('');
    this.passwordConfirm.set('');
    this.guardar();
  }
}
