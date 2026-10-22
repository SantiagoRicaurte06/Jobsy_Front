import { Component, inject, input, signal, OnInit, computed } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService, HiringService } from '../../../core/services';
import { Employee, WorkModality } from '../../../core/models';
import { CopPipe } from '../../../shared/pipes';
import { StepProgressComponent } from '../../../shared/components/step-progress/step-progress';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'jobsy-hiring',
  standalone: true,
  imports: [IconComponent, FormsModule, CopPipe, StepProgressComponent, LoadingSpinnerComponent],
  templateUrl: './contratacion.html',
  styleUrl: './contratacion.scss',
})
export class HiringPage implements OnInit {
  private employeeService = inject(EmployeeService);
  private hiring = inject(HiringService);
  private router = inject(Router);

  readonly id = input.required<string>();

  readonly steps = ['Modalidad', 'Fecha y hora', 'Confirmar'];
  readonly step = signal(0);

  readonly employee = signal<Employee | undefined>(undefined);
  readonly cargando = signal(true);
  readonly done = signal(false);
  readonly enviando = signal(false);
  readonly error = signal('');

  readonly modalidad = signal<WorkModality>('por_horas');
  readonly fecha = signal('');
  readonly horaInicio = signal('08:00');
  readonly horas = signal(4);
  readonly tarifaHora = signal(30000);
  readonly direccion = signal('');

  /**
   * Las tres modalidades del catalogo (catalogo.modalidades_trabajo).
   *
   * Habia una cuarta, "Contrato fijo", que viajaba como 'presencial': el
   * servidor no la reconoce y la contratacion habria fallado.
   */
  readonly modalidades: { value: WorkModality; label: string; text: string }[] = [
    { value: 'por_horas', label: 'Por horas', text: 'Pagas solo las horas trabajadas.' },
    { value: 'jornada_completa', label: 'Jornada completa', text: 'Dia completo de trabajo.' },
    { value: 'fin_de_semana', label: 'Fin de semana', text: 'Sabados y domingos.' },
  ];

  readonly total = computed(() => this.horas() * this.tarifaHora());

  ngOnInit(): void {
    this.employeeService.getById(this.id()).subscribe({
      next: (e) => {
        this.employee.set(e);
        // La tarifa de partida es la de esa persona, no una cifra fija.
        if (e?.tarifaHora) this.tarifaHora.set(e.tarifaHora);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('No pudimos cargar los datos de esta persona.');
      },
    });
  }

  next(): void {
    this.step.update((s) => Math.min(s + 1, this.steps.length - 1));
  }

  back(): void {
    this.step.update((s) => Math.max(s - 1, 0));
  }

  confirmar(): void {
    if (!this.direccion().trim()) {
      this.error.set('Escribe la direccion del servicio.');
      return;
    }
    if (!this.fecha()) {
      this.error.set('Elige la fecha del servicio.');
      return;
    }
    this.enviando.set(true);
    this.error.set('');

    // Contratacion directa: no hay oferta ni postulacion previas, las crea el
    // servidor a partir de esto.
    this.hiring
      .direct({
        empleadoId: this.id(),
        titulo: `Servicio con ${this.employee()?.nombre ?? 'Jobsy'}`,
        direccion: this.direccion().trim(),
        ciudad: this.employee()?.ciudad ?? '',
        fechaInicio: this.fecha(),
        horaInicio: this.horaInicio(),
        duracionHoras: this.horas(),
        tarifa: this.tarifaHora(),
        modalidad: this.modalidad(),
      })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.done.set(true);
        },
        error: (e: HttpErrorResponse) => {
          this.enviando.set(false);
          this.error.set(e.error?.error?.mensaje ?? 'No pudimos completar la contratacion.');
        },
      });
  }

  goHome(): void {
    this.router.navigate(['/empleados']);
  }
}
