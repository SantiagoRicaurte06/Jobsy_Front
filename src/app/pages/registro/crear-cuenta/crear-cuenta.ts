
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegistrationService } from '../../../core/services';
import { LogoComponent } from '../../../shared/components/logo/logo';

@Component ({
  selector: 'jobsy-create-account',
  standalone: true,
  imports: [FormsModule, RouterLink, LogoComponent],
  templateUrl: './crear-cuenta.html',
  styleUrl: './crear-cuenta.scss',
})
export class CreateAccountPage {
  private registration = inject(RegistrationService);
  private router = inject(Router);

  readonly nombre = signal('');
  readonly apellido = signal('')
  readonly email = signal('')
  readonly password = signal('')
  readonly confirm = signal('')
  readonly acepta = signal(false);
  readonly error = signal('');

  submit(): void {
    if (!this.nombre() || !this.apellido() || !this.email() || !this.password()) {
      this.error.set('Completa Todos Los Cambios.');
      return;
    }
    if (this.password().length < 8) {
      this.error.set('La contrasena debe tener al menos 8 caracteres.');
      return;
    }
    if (this.password() !== this.confirm()) {
      this.error.set('Las contrasenas no coinciden.');
      return;
    }
    if (!this.acepta()) {
      this.error.set('Debes Aceptar Los Terminos Y Condidcones.');
      return;
    }

    this.registration.patch({
      nombre: this.nombre(),
      apellido: this.apellido(),
      email: this.email(),
      password: this.password(),
    });
    this.router.navigate(['/registro/rol']);
  }    
}
