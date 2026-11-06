import { Component, inject, input, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { EmployeeService, AuthService } from '../../../core/services';
import { Employee, EmployeeReview } from '../../../core/models';
import { ScheduleSlot } from '../../../core/services';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'jobsy-employee-detail',
  standalone: true,
  imports: [IconComponent, RouterLink, RatingStarsComponent, LoadingSpinnerComponent, EmptyStateComponent, DatePipe],
  templateUrl: './detalle-empleado.html',
  styleUrl: './detalle-empleado.scss',
})
export class EmployeeDetailPage implements OnInit {
  private employeeService = inject(EmployeeService);
  private auth = inject(AuthService);

  readonly id = input.required<string>();

  /** Solo los usuarios con sesion pueden dejar una calificacion. */
  readonly isLoggedIn = this.auth.isLoggedIn;

  readonly employee = signal<Employee | undefined>(undefined);
  readonly cargando = signal(true);

  /** Resenas recibidas, tal como las guarda el servidor. */
  readonly resenas = signal<EmployeeReview[]>([]);

  /** Franjas en las que esa persona puede trabajar. */
  readonly disponibilidad = signal<ScheduleSlot[]>([]);

  // ---- Formulario "deja tu resena" ----
  readonly nuevaCalificacion = signal(0);
  readonly nuevoComentario = signal('');
  readonly enviandoResena = signal(false);
  readonly errorResena = signal('');

  ngOnInit(): void {
    this.employeeService.getById(this.id()).subscribe({
      next: (e) => {
        this.employee.set(e);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });

    this.employeeService.reviews(this.id()).subscribe({
      next: (r) => this.resenas.set(r ?? []),
      error: () => this.resenas.set([]),
    });

    this.employeeService.availability(this.id()).subscribe({
      next: (d) => this.disponibilidad.set(d ?? []),
      error: () => this.disponibilidad.set([]),
    });
  }

  setCalificacion(n: number): void {
    this.nuevaCalificacion.set(n);
  }

  /**
   * Publica la resena.
   *
   * El servidor solo la acepta de alguien que haya trabajado con esta
   * persona; si no, lo dice. Antes se guardaba en localStorage y la veia
   * unicamente quien la escribio.
   */
  enviarResena(event: Event): void {
    event.preventDefault();

    const usuario = this.auth.user();
    if (!usuario || this.nuevaCalificacion() === 0) return;

    const comentario = this.nuevoComentario().trim();
    if (!comentario) {
      this.errorResena.set('Escribe un comentario.');
      return;
    }

    this.enviandoResena.set(true);
    this.errorResena.set('');

    this.employeeService
      .addReview({
        sobreUsuarioId: this.id(),
        calificacion: this.nuevaCalificacion(),
        comentario,
      })
      .subscribe({
        next: (creada) => {
          this.resenas.update((list) => [creada, ...list]);
          this.nuevaCalificacion.set(0);
          this.nuevoComentario.set('');
          this.enviandoResena.set(false);
        },
        error: (e: HttpErrorResponse) => {
          this.enviandoResena.set(false);
          this.errorResena.set(
            e.error?.error?.mensaje ?? 'Solo puedes valorar a alguien con quien hayas trabajado.',
          );
        },
      });
  }
}
