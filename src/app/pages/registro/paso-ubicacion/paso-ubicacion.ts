
import { Component, inject, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { RegistrationService, AuthService, ProfileService } from '../../../core/services';
import { environment } from '../../../../environments/environment';
import { IconComponent } from '../../../shared/components/icon/icon';
import { StepProgressComponent } from '../../../shared/components/step-progress/step-progress';
import * as R from '../../../core/validation/reglas';

@Component({
  selector: 'jobsy-step-location',
  standalone: true,
  imports: [FormsModule, IconComponent, StepProgressComponent],
  templateUrl: './paso-ubicacion.html',
  styleUrl: './paso-ubicacion.scss',
})
export class StepLocationPage {
  private registration = inject(RegistrationService);
  private auth = inject(AuthService);
  private perfil = inject(ProfileService);
  private router = inject(Router);
  /** Archivo elegido; la vista previa es local y la subida se hace al terminar. */
  private foto: File | null = null;

  readonly steps = this.registration.steps;
  readonly rol = this.registration.rol;

  readonly ciudad = signal(this.registration.draft().ciudad || 'Yopal');
  readonly barrio = signal(this.registration.draft().barrio);
  readonly distanciaKm = signal(this.registration.draft().distanciaKm);
  readonly fotoPreview = signal(this.registration.draft().fotoUrl);
  readonly cargando = signal(false);
  readonly error = signal('');
  
  readonly Ciudades = R.CIUDADES;

  onlife(event: Event): void {
    const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
    if(!file) return;


    this.foto = file;
    this.fotoPreview.set(URL.createObjectURL(file));
  }

  back(): void {
    const anterior = this.rol() === 'empleador' ? '/registro/paso-1' : '/registro/paso-2';
    this.router.navigate([anterior]);
  }

  finish(): void {
    if (!this.barrio()) {
      this.error.set('Indica tu barrio o zona.');
      return;
    }
    const invalido = R.primero(R.ciudad(this.ciudad()), R.texto('El barrio', this.barrio(), 3, 100));
    if (invalido) {
      this.error.set(invalido);
      return;
    }

    this.registration.patch({
      ciudad: this.ciudad(),
      barrio: this.barrio(),
      distanciaKm: this.distanciaKm(),
      // Con backend real la url es la que devuelve la subida; un blob: local
      // no le sirve a nadie mas.
      fotoUrl: environment.useMocks ? this.fotoPreview() : '',
    });

    const draft = this.registration.draft();
    this.cargando.set(true);

    // Envía todo el formulario; en mock queda guardado en localStorage como JSON.
    this.auth
      .register(draft)
      .pipe(switchMap(() => this.entrar(draft.email, draft.password)))
      .subscribe({
        next: () => {
          this.registration.reset();
          this.router.navigate(['/registro/cuenta-creada']);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set(err?.error?.error?.mensaje ?? 'No pudimos crear tu cuenta. Intenta de nuevo.');
          this.cargando.set(false);
        },
      });
  }

  /**
   * Entra con la cuenta recién creada para no pedir la contraseña otra vez, y
   * sube la foto si se eligió una. Si algo falla, la cuenta sigue creada: la
   * pantalla final ofrece iniciar sesión y la foto se puede poner luego.
   */
  private entrar(email: string, password: string): Observable<void> {
    const foto = environment.useMocks ? null : this.foto;
    return this.auth.login({ usuario: email, password }).pipe(
      switchMap(() => (foto ? this.perfil.uploadPhoto(foto).pipe(catchError(() => of(null))) : of(null))),
      map(() => undefined),
      catchError(() => of(undefined)),
    );
  }
}