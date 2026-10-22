import { Component, inject, signal } from '@angular/core';
import { LogoComponent } from '../../../shared/components/logo/logo';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services';
import { IconComponent } from '../../../shared/components/icon/icon';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'jobsy-login',
  standalone: true,
  imports: [IconComponent, FormsModule, LogoComponent, RouterLink],
  templateUrl: './ingreso.html',
  styleUrl: './ingreso.scss',
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly usuario = signal('');
  readonly password = signal('');
  readonly showPassword = signal(false);
  readonly cargando = signal(false);
  readonly error = signal('');
  /** El acceso con Google solo existe en modo mocks: el middleware no lo implementa. */
  readonly googleDisponible = environment.useMocks;

  /** Por que se llego al login: la sesion vencio o hacia falta entrar para ver algo. */
  readonly motivo = this.route.snapshot.queryParamMap.get('motivo') === 'sesion'
    ? 'Tu sesion expiro. Inicia sesion de nuevo para continuar.'
    : this.route.snapshot.queryParamMap.get('redirect')
      ? 'Inicia sesion para continuar.'
      : '';

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  submit(): void {
    if (!this.usuario() || !this.password()) {
      this.error.set('Ingresa tu usuario y contraseña.');
      return;
    }

    this.cargando.set(true);
    this.error.set('');

    this.auth.login({ usuario: this.usuario(), password: this.password() }).subscribe({
      next: () => this.redirect(),
      error: (e: HttpErrorResponse) => {
        // Antes cualquier fallo decia "contrasena incorrecta", tambien con el
        // servidor caido o por demasiados intentos.
        if (e.status === 0) this.error.set('No pudimos conectar con el servidor. Revisa tu conexion.');
        else if (e.status === 429) this.error.set('Demasiados intentos. Espera un minuto y vuelve a intentarlo.');
        else if (e.status >= 500) this.error.set('El servicio no esta disponible en este momento. Intenta mas tarde.');
        else this.error.set(e.error?.error?.mensaje ?? 'Usuario o contrasena incorrectos.');
        this.cargando.set(false);
      },
    });
  }

  google(): void {
    this.cargando.set(true);
    this.auth.loginWithGoogle().subscribe({
      next: () => this.redirect(),
      error: () => this.cargando.set(false),
    });
  }

  private redirect(): void {
    // Solo rutas internas: "redirect" llega en la URL y la puede escribir cualquiera.
    const pedido = this.route.snapshot.queryParamMap.get('redirect') ?? '';
    const target = pedido.startsWith('/') && !pedido.startsWith('//') ? pedido : '/auth/exito';
    this.router.navigateByUrl(target);
  }
}
