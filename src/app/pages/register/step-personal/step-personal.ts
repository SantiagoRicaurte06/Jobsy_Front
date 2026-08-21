
import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { RegistrationService } from "../../../core/services";
import { StepProgressComponent } from "../../../shared/components/step-progress/step-progress";

@Component ({
  selector: 'jobsy-step-personal',
  standalone: true,
  imports: [FormsModule, StepProgressComponent],
  templateUrl: './step-personal.html',
  styleUrl: './step-personal.scss',
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

  readonly nacionalidades = ['Colombiana', 'Venzolana', 'Ecuatoriana', 'Peruana', 'Otra'];
  readonly generos = ['Femenino', 'Maculino', 'No binario', 'Prefiero no decirlo'];

  back():void {
    this.router.navigate(['/registro/checklist']);
  }

  next():void {
    if (!this.genero() || !this.fechaNacimiento() || !this.documento()) {
      this.error.set('Completa Todos Los Campos Para Continuar.');
      return;
    }

    this.registration.patch({
      nacionalidad: this.nacionalidad(),
      genero: this.genero(),
      fechaNacimiento: this.fechaNacimiento(),
      documento: this.documento(),
    });
    this.router.navigate(['/registro/paso-2']);
  }
}