
import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { RegistrationService } from "../../../core/services";
import { WorkModality } from "../../../core/models";
import { StepProgressComponent } from "../../../shared/components/step-progress/step-progress";
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'jobsy-step-work',
  standalone: true,
  imports: [IconComponent, FormsModule, StepProgressComponent],
  templateUrl: './paso-trabajo.html',
  styleUrl: './paso-trabajo.scss'
})
export class StepWorkPage {
  private registration = inject(RegistrationService);
  private router = inject(Router);

  readonly steps = this.registration.steps;

  readonly modalidades = signal<WorkModality[]>(this.registration.draft().modalidades);
  readonly especialidades = signal<string[]>(this.registration.draft().especialidades);
  readonly experiencia = signal(this.registration.draft().experiencia);
  readonly error = signal('');

  readonly opcionesModalidad: { value: WorkModality; icon: string; label: string; text: string }[] = [
    { value: 'por_horas', icon: 'timer', label: 'Por horas', text: 'Trabajos puntuales de pocas horas.' },
    { value: 'jornada_completa', icon: 'calendar', label: 'Jornada completa', text: 'Dias completos de trabajo.' },
    { value: 'fin_de_semana', icon: 'sun', label: 'Fin de semana', text: 'Solo sabados y domingos.' },
    { value: 'presencial', icon: 'house', label: 'Presencial fijo', text: 'Contrato estable en un hogar.' },
  ];

  readonly opcionesEspecialidad = [
    'Limpieza profunda', 'Cocina', 'Planchado', 'Zonas verdes',
    'Cuidado de ninos', 'Cuidado de adultos', 'Mascotas', 'Bioseguridad'
  ];

  toggleModalidad(m: WorkModality): void {
    this.modalidades.update((list) =>
      list.includes(m) ? list.filter((x) => x !== m) : [...list, m],
    );
  }

  toggleEspecialidades(e: string): void {
    this.especialidades.update((list) =>
      list.includes(e) ? list.filter((x) => x !==e) : [...list, e],
    );
  }

  back(): void {
    this.router.navigate(['/registro/paso-1']);
  }

  next(): void {
    if (!this.modalidades().length) {
      this.error.set('Elige Al Menos Una Modalidad De Trabajo.');
      return;
    }

    this.registration.patch({
      modalidades: this.modalidades(),
      especialidades: this.especialidades(),
      experiencia: this.experiencia(),
    });
    this.router.navigate(['/registro/paso-3'])
  }
}