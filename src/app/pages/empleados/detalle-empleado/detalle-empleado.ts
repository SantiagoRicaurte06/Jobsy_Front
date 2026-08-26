import { Component, inject, input, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../../../core/services';
import { Employee } from '../../../core/models';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'jobsy-employee-detail',
  standalone: true,
  imports: [RouterLink, RatingStarsComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './detalle-empleado.html',
  styleUrl: './detalle-empleado.scss',
})
export class EmployeeDetailPage implements OnInit {
  private employeeService = inject(EmployeeService);

  readonly id = input.required<string>();

  readonly employee = signal<Employee | undefined>(undefined);
  readonly loading = signal(true);

  /** TEMPORAL: resenas de ejemplo hasta que exista el endpoint real. */
  readonly reviews = signal([
    { autor: 'Familia Rodriguez', estrellas: 5, texto: 'Excelente trabajo, muy puntual y detallista.', fecha: 'Hace 2 semanas' },
    { autor: 'Pedro G.', estrellas: 5, texto: 'Dejo la casa impecable. La volveria a contratar.', fecha: 'Hace 1 mes' },
    { autor: 'Ana M.', estrellas: 4, texto: 'Muy buena actitud y cumplida con los horarios.', fecha: 'Hace 2 meses' },
  ]);

  // ---- Formulario "deja tu resena" ----
  readonly nuevaCalificacion = signal(0);
  readonly nuevoComentario = signal('');

  ngOnInit(): void {
    this.employeeService.getById(this.id()).subscribe((e) => {
      this.employee.set(e);
      this.loading.set(false);
    });
  }

  /**
   * Publica la resena del usuario.
   * TEMPORAL: la agrega en memoria; falta el POST real a Usuarios_Api.
   */
  enviarResena(event: Event): void {
    event.preventDefault();
    if (this.nuevaCalificacion() === 0) return;

    this.reviews.update((lista) => [
      {
        autor: 'Tu',
        estrellas: this.nuevaCalificacion(),
        texto: this.nuevoComentario().trim() || 'Sin comentario.',
        fecha: 'Ahora',
      },
      ...lista,
    ]);

    this.nuevaCalificacion.set(0);
    this.nuevoComentario.set('');
  }
}
