import { Component, inject, input, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmployeeService, AuthService } from '../../../core/services';
import { Employee, EmployeeReview } from '../../../core/models';
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
  private auth = inject(AuthService);

  readonly id = input.required<string>();

  /** Solo los usuarios con sesion pueden dejar una calificacion. */
  readonly isLoggedIn = this.auth.isLoggedIn;

  readonly employee = signal<Employee | undefined>(undefined);
  readonly loading = signal(true);

  /** Resenas de ejemplo que trae el perfil. */
  readonly seedReviews: EmployeeReview[] = [
    { autor: 'Familia Rodriguez', estrellas: 5, texto: 'Excelente trabajo, muy puntual y detallista.', fecha: 'Hace 2 semanas' },
    { autor: 'Pedro G.', estrellas: 5, texto: 'Dejo la casa impecable. La volveria a contratar.', fecha: 'Hace 1 mes' },
    { autor: 'Ana M.', estrellas: 4, texto: 'Muy buena actitud y cumplida con los horarios.', fecha: 'Hace 2 meses' },
  ];

  /** Resenas que el usuario ha dejado (persisten en localStorage). */
  readonly savedReviews = signal<EmployeeReview[]>([]);

  /** Lista completa que se muestra: primero las nuevas, luego las de ejemplo. */
  readonly resenas = computed(() => [...this.savedReviews(), ...this.seedReviews]);

  // ---- Formulario "deja tu calificacion" ----
  readonly nuevaCalificacion = signal(0);
  readonly nuevoComentario = signal('');

  ngOnInit(): void {
    this.employeeService.getById(this.id()).subscribe((e) => {
      this.employee.set(e);
      this.loading.set(false);
    });

    this.savedReviews.set(this.employeeService.getReviews(this.id()));
  }

  setCalificacion(n: number): void {
    this.nuevaCalificacion.set(n);
  }

  /** Guarda la resena en localStorage y la muestra al instante. */
  enviarResena(event: Event): void {
    event.preventDefault();

    const usuario = this.auth.user();
    if (!usuario || this.nuevaCalificacion() === 0) return;

    const apellido = usuario.apellido ? ` ${usuario.apellido.charAt(0)}.` : '';
    const review: EmployeeReview = {
      autor: `${usuario.nombre}${apellido}`,
      estrellas: this.nuevaCalificacion(),
      texto: this.nuevoComentario().trim() || 'Sin comentario.',
      fecha: 'Ahora',
    };

    this.employeeService.addReview(this.id(), review);
    this.savedReviews.update((list) => [review, ...list]);

    this.nuevaCalificacion.set(0);
    this.nuevoComentario.set('');
  }
}
