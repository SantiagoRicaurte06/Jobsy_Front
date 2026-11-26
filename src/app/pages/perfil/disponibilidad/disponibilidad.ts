import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { EmployeeService, ScheduleSlot } from '../../../core/services';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { IconComponent } from '../../../shared/components/icon/icon';

const DIAS = [
  { value: 'lun', label: 'Lunes' }, { value: 'mar', label: 'Martes' }, { value: 'mie', label: 'Miercoles' },
  { value: 'jue', label: 'Jueves' }, { value: 'vie', label: 'Viernes' }, { value: 'sab', label: 'Sabado' },
  { value: 'dom', label: 'Domingo' },
];

/** El empleado define en que dias y horas puede trabajar; es lo que ven los empleadores al agendar. */
@Component({
  selector: 'jobsy-availability',
  standalone: true,
  imports: [LoadingSpinnerComponent, IconComponent],
  templateUrl: './disponibilidad.html',
  styleUrl: './disponibilidad.scss',
})
export class AvailabilityPage implements OnInit {
  private employees = inject(EmployeeService);

  readonly dias = DIAS;
  readonly franjas = signal<ScheduleSlot[]>([]);
  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly guardado = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    this.employees.myAvailability().subscribe({
      next: (f) => { this.franjas.set(f ?? []); this.cargando.set(false); },
      error: () => { this.error.set('No pudimos cargar tu disponibilidad.'); this.cargando.set(false); },
    });
  }

  de(dia: string): ScheduleSlot[] {
    return this.franjas().filter((f) => f.dia === dia);
  }

  agregar(dia: string): void {
    this.franjas.update((l) => [...l, { dia, horaInicio: '08:00', horaFin: '12:00' }]);
    this.guardado.set(false);
  }

  quitar(f: ScheduleSlot): void {
    this.franjas.update((l) => l.filter((x) => x !== f));
    this.guardado.set(false);
  }

  cambiar(f: ScheduleSlot, campo: 'horaInicio' | 'horaFin', valor: string): void {
    this.franjas.update((l) => l.map((x) => (x === f ? { ...x, [campo]: valor } : x)));
    this.guardado.set(false);
  }

  guardar(): void {
    const mala = this.franjas().find((f) => !f.horaInicio || !f.horaFin || f.horaFin <= f.horaInicio);
    if (mala) {
      this.error.set(`Revisa la franja del ${DIAS.find((d) => d.value === mala.dia)?.label}: la hora de fin debe ser posterior a la de inicio.`);
      return;
    }
    this.guardando.set(true);
    this.error.set('');
    this.employees.setMyAvailability(this.franjas()).subscribe({
      next: (f) => { this.franjas.set(f ?? []); this.guardando.set(false); this.guardado.set(true); },
      error: (e: HttpErrorResponse) => {
        this.guardando.set(false);
        this.error.set(e.error?.error?.mensaje ?? 'No pudimos guardar tu disponibilidad.');
      },
    });
  }
}
