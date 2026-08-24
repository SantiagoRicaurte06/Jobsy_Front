import { Component, inject, input, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JobService, ApplicationService } from '../../../core/services';
import { Job } from '../../../core/models';
import { CopPipe } from '../../../shared/pipes';
import { StepProgressComponent } from '../../../shared/components/step-progress/step-progress';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'jobsy-apply-wizard',
  standalone: true,
  imports: [FormsModule, RouterLink, CopPipe, StepProgressComponent, LoadingSpinnerComponent],
  templateUrl: './asistente-postulacion.html',
  styleUrl: './asistente-postulacion.scss',
})
export class ApplyWizardPage implements OnInit {
  private jobService = inject(JobService);
  private applicationService = inject(ApplicationService);
  private router = inject(Router);

  readonly id = input.required<string>();

  readonly steps = ['Revisar oferta', 'Tu disponibilidad', 'Mensaje', 'Confirmar'];
  readonly step = signal(0);

  readonly job = signal<Job | undefined>(undefined);
  readonly loading = signal(true);
  readonly sending = signal(false);

  // ---- Datos del formulario ----
  readonly dias = signal<string[]>([]);
  readonly horaInicio = signal('08:00');
  readonly horaFin = signal('16:00');
  readonly tarifa = signal<number | null>(null);
  readonly mensaje = signal('');
  readonly aceptaCondiciones = signal(false);
  readonly error = signal('');

  readonly diasSemana = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

  ngOnInit(): void {
    this.jobService.getById(this.id()).subscribe((job) => {
      this.job.set(job);
      this.tarifa.set(job?.precioHora ?? null);
      this.loading.set(false);
    });
  }

  toggleDia(d: string): void {
    this.dias.update((list) => (list.includes(d) ? list.filter((x) => x !== d) : [...list, d]));
  }

  next(): void {
    this.error.set('');

    if (this.step() === 1 && !this.dias().length) {
      this.error.set('Selecciona al menos un dia disponible.');
      return;
    }
    if (this.step() === 2 && this.mensaje().length < 20) {
      this.error.set('Escribe un mensaje de al menos 20 caracteres.');
      return;
    }

    this.step.update((s) => Math.min(s + 1, this.steps.length - 1));
  }

  back(): void {
    this.error.set('');
    this.step.update((s) => Math.max(s - 1, 0));
  }

  submit(): void {
    if (!this.aceptaCondiciones()) {
      this.error.set('Debes aceptar las condiciones para postularte.');
      return;
    }

    this.sending.set(true);
    this.applicationService.apply(this.id(), this.mensaje()).subscribe({
      next: () => this.router.navigate(['/app/mis-postulaciones']),
      error: () => {
        this.error.set('No pudimos enviar tu postulacion. Intenta de nuevo.');
        this.sending.set(false);
      },
    });
  }
}
