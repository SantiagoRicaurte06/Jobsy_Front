
import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { RegistrationService } from "../../../core/services";
import * as R from "../../../core/validation/reglas";
import { StepProgressComponent } from "../../../shared/components/step-progress/step-progress";

@Component ({
  selector: 'jobsy-step-personal',
  standalone: true,
  imports: [FormsModule, StepProgressComponent],
  templateUrl: './paso-personal.html',
  styleUrl: './paso-personal.scss',
})
export class StepPersonalPage {
  private registration = inject(RegistrationService);
  private router = inject(Router);

  readonly steps = this.registration.steps;

  readonly nacionalidad = signal(this.registration.draft().nacionalidad || 'Colombiana');
  readonly genero = signal(this.registration.draft().genero);
  readonly fechaNacimiento = signal(this.registration.draft().fechaNacimiento);
  readonly documento = signal(this.registration.draft().documento);
  readonly error = signal('');

  /** Limites del selector de fecha: entre 18 y 80 anos. */
  readonly fechaMax = R.hoyISO(0, -R.LIMITES.edadMin);
  readonly fechaMin = R.hoyISO(0, -R.LIMITES.edadMax);

  readonly nacionalidades = ['Colombiana', 'Venezolana', 'Ecuatoriana', 'Peruana', 'Otra'];
  readonly generos = ['Femenino', 'Masculino', 'No binario', 'Prefiero no decirlo'];

  back():void {
    this.router.navigate(['/registro/checklist']);
  }

  next():void {
    if (!this.genero() || !this.fechaNacimiento() || !this.documento()) {
      this.error.set('Completa todos los campos para continuar.');
      return;
    }
    // Sin puntos ni espacios: "1.234.567.890" se guarda como 1234567890.
    const documento = this.documento().replace(/[. ]/g, '');
    const invalido = R.primero(
      R.fechaNacimiento(this.fechaNacimiento()),
      R.documento(documento, this.nacionalidad() === 'Colombiana'),
    );
    if (invalido) {
      this.error.set(invalido);
      return;
    }
    this.error.set('');

    this.registration.patch({
      nacionalidad: this.nacionalidad(),
      genero: this.genero(),
      fechaNacimiento: this.fechaNacimiento(),
      documento,
    });

    const siguiente = this.registration.rol() === 'empleador' ? '/registro/paso-3' : '/registro/paso-2';
    this.router.navigate([siguiente]);
  }
}