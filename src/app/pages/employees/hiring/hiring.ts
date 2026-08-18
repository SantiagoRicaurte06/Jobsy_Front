import { Component, inject, input, signal, OnInit, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../core/services';
import { Employee, WorkModality } from '../../../core/models';
import { CopPipe } from '../../../shared/pipes';
import { StepProgressComponent } from '../../../shared/components/step-progress/step-progress';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'jobsy-hiring',
  standalone: true,
  imports: [FormsModule, CopPipe, StepProgressComponent, LoadingSpinnerComponent],
  templateUrl: './hiring.html',
  styleUrl: './hiring.scss',
})
export class HiringPage implements OnInit {
  private employeeService = inject(EmployeeService);
  private router = inject(Router);

  readonly id = input.required<string>();

  readonly steps = ['Modalidad', 'Fecha y hora', 'Confirmar'];
  readonly step = signal(0);

  readonly employee = signal<Employee | undefined>(undefined);
  readonly loading = signal(true);
  readonly done = signal(false);

  readonly modalidad = signal<WorkModality>('por_horas');
  readonly fecha = signal('');
  readonly horaInicio = signal('08:00');
  readonly horas = signal(4);
  readonly tarifaHora = signal(30000);
  readonly direccion = signal('');

  readonly modalidades: { value: WorkModality; label: string; text: string }[] = [
    { value: 'por_horas', label: 'Por horas', text: 'Pagas solo las horas trabajadas.' },
    { value: 'jornada_completa', label: 'Jornada completa', text: 'Dia completo de trabajo.' },
    { value: 'fin_de_semana', label: 'Fin de semana', text: 'Sabados y domingos.' },
    { value: 'presencial', label: 'Contrato fijo', text: 'Vinculacion estable mensual.' },
  ];

  readonly total = computed(() => this.horas() * this.tarifaHora());

  ngOnInit(): void {
    this.employeeService.getById(this.id()).subscribe((e) => {
      this.employee.set(e);
      this.loading.set(false);
    });
  }

  next(): void {
    this.step.update((s) => Math.min(s + 1, this.steps.length - 1));
  }

  back(): void {
    this.step.update((s) => Math.max(s - 1, 0));
  }

  confirmar(): void {
    // TEMPORAL: aqui iria la llamada real al backend de contratacion.
    this.done.set(true);
  }

  goHome(): void {
    this.router.navigate(['/empleados']);
  }
}
