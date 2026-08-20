
import { Component, inject, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationService, AuthService } from '../../../core/services';
import { StepProgressComponent } from '../../../shared/components/step-progress/step-progress';
import { readonly } from '@angular/forms/signals';

@Component({
  selector: 'jobsy-step-location',
  standalone: true,
  imports: [FormsModule, StepProgressComponent],
  templateUrl: './step-location.html',
  styleUrl: './step-location.scss',
})
export class StepLocationPage {
  private registration = inject(RegistrationService);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly steps = this.registration.steps;

  readonly ciudad = signal(this.registration.draft().ciudad || 'Yopal');
  readonly barrio = signal(this.registration.draft().barrio);
  readonly distanciaKm = signal(this.registration.draft().distanciaKm);
  readonly fotoPreview = signal(this.registration.draft().fotoUrl);
  readonly loading = signal(false);
  readonly error = signal('');
  
  readonly Ciudades = ['Yopal', 'Aguazul', 'Tauramena', 'Villanueva', 'Monterrey'];

  onlife(event: Event): void {
    const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
    if(!file) return;

  
    // TEMPORAL: preview local. El backend real subira el archivo a storage.
    this.fotoPreview.set(URL.createObjectURL(file));
  }

  back(): void {
    this.router.navigate(['/registro/paso-2']);
  }

  finish(): void {
    if (!this.barrio()) {
      this.error.set('Indica tu barrio o zona.');
      return;
    }

    this.registration.patch({
      ciudad: this.ciudad(),
      barrio: this.barrio(),
      distanciaKm: this.distanciaKm(),
      fotoUrl: this.fotoPreview(),
    });

    const draft = this.registration.draft();
    this.loading.set(true);

    this.auth
      .register({
        nombre: draft.nombre,
        apellido: draft.apellido,
        email: draft.email,
        password: draft.password,
        rol: draft.rol ?? 'empleado',
      })
      .subscribe({
        next: () => {
          this.registration.reset();
          this.router.navigate(['/registro/cuenta-creada']);
        },
        error: () => {
          this.error.set('No pudimos crear tu cuenta. Intenta de nuevo.');
          this.loading.set(false);
        },
      });

  }  
}