import { Component, ElementRef, NgZone, OnInit, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/services';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'jobsy-login',
  standalone: true,
  imports: [IconComponent, FormsModule, RouterLink],
  templateUrl: './ingreso.html',
  styleUrl: './ingreso.scss',
})
export class LoginPage implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly usuario = signal('');
  readonly password = signal('');
  readonly showPassword = signal(false);
  readonly cargando = signal(false);
  readonly error = signal('');
  /** El boton de Google aparece solo si el servidor tiene un Client ID configurado. */
  readonly googleDisponible = signal(false);
  private readonly botonGoogle = viewChild<ElementRef<HTMLElement>>('botonGoogle');
  private zone = inject(NgZone);

  ngOnInit(): void {
    this.auth.googleClientId().subscribe({
      next: ({ clientId }) => { if (clientId) this.iniciarGoogle(clientId); },
      error: () => this.googleDisponible.set(false),
    });
  }

  /** Carga Google Identity Services y pinta su boton oficial. */
  private iniciarGoogle(clientId: string): void {
    const pintar = () => {
      const g = (window as unknown as { google?: GoogleId }).google;
      if (!g) return;
      g.accounts.id.initialize({
        client_id: clientId,
        callback: (r: { credential: string }) => this.zone.run(() => this.google(r.credential)),
      });
      this.googleDisponible.set(true);
      // El contenedor existe tras el siguiente render.
      setTimeout(() => {
        const el = this.botonGoogle()?.nativeElement;
        if (el) g.accounts.id.renderButton(el, { theme: 'outline', size: 'large', width: el.clientWidth || 320, text: 'continue_with', locale: 'es' });
      });
    };
    if ((window as unknown as { google?: GoogleId }).google) return pintar();
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.onload = pintar;
    document.head.appendChild(s);
  }

  /** Por que se llego al login: la sesion vencio o hacia falta entrar para ver algo. */
  readonly motivo = this.route.snapshot.queryParamMap.get('motivo') === 'sesion'
    ? 'Tu sesión expiró. Inicia sesión de nuevo para continuar.'
    : this.route.snapshot.queryParamMap.get('redirect')
      ? 'Inicia sesión para continuar.'
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
        else if (e.status >= 500) this.error.set('El servicio no esta disponible en este momento. Intenta más tarde.');
        else this.error.set(e.error?.error?.mensaje ?? 'Usuario o contraseña incorrectos.');
        this.cargando.set(false);
      },
    });
  }

  google(credencial: string): void {
    this.cargando.set(true);
    this.error.set('');
    this.auth.loginWithGoogle(credencial).subscribe({
      next: () => this.redirect(),
      error: (e: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(e.error?.error?.mensaje ?? 'No pudimos entrar con Google.');
      },
    });
  }

  private redirect(): void {
    // Solo rutas internas: "redirect" llega en la URL y la puede escribir cualquiera.
    const pedido = this.route.snapshot.queryParamMap.get('redirect') ?? '';
    const target = pedido.startsWith('/') && !pedido.startsWith('//') ? pedido : '/auth/exito';
    this.router.navigateByUrl(target);
  }
}

/** Lo que se usa de Google Identity Services (https://accounts.google.com/gsi/client). */
interface GoogleId {
  accounts: {
    id: {
      initialize(o: { client_id: string; callback: (r: { credential: string }) => void }): void;
      renderButton(el: HTMLElement, o: Record<string, unknown>): void;
    };
  };
}
