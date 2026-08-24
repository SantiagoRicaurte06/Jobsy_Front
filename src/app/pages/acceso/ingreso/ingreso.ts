import { Component, inject, signal } from '@angular/core';
import { LogoComponent } from '../../../shared/components/logo/logo';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'jobsy-login',
  standalone: true,
  imports: [FormsModule, LogoComponent, RouterLink],
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
  readonly loading = signal(false);
  readonly error = signal('');

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  submit(): void {
    if (!this.usuario() || !this.password()) {
      this.error.set('Ingresa tu usuario y contraseña.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.auth.login({ usuario: this.usuario(), password: this.password() }).subscribe({
      next: () => this.redirect(),
      error: () => {
        this.error.set('Usuario o contrasena incorrectos.');
        this.loading.set(false);
      },
    });
  }

  google(): void {
    this.loading.set(true);
    this.auth.loginWithGoogle().subscribe({
      next: () => this.redirect(),
      error: () => this.loading.set(false),
    });
  }

  private redirect(): void {
    const target = this.route.snapshot.queryParamMap.get('redirect') ?? '/auth/exito';
    this.router.navigateByUrl(target);
  }
}
