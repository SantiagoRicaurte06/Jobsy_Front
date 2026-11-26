import { Component, inject, input, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
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
  private router = inject(Router);

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

  // ---- Guardar perfil ----
  readonly guardado = signal(false);
  readonly guardando = signal(false);
  readonly errorGuardado = signal('');

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.employeeService.saved().subscribe({
        next: (lista) => this.guardado.set(lista.some((e) => e.id === this.id())),
        error: () => this.guardado.set(false),
      });
    }

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

  /** Guarda o quita el perfil de la lista del usuario; sin sesion, lleva al login. */
  alternarGuardado(): void {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/auth/login'], { queryParams: { redirect: this.router.url } });
      return;
    }
    const quitar = this.guardado();
    this.guardando.set(true);
    this.errorGuardado.set('');
    const peticion: Observable<unknown> = quitar
      ? this.employeeService.unsave(this.id())
      : this.employeeService.save(this.id());
    peticion.subscribe({
      next: () => {
        this.guardado.set(!quitar);
        this.guardando.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.guardando.set(false);
        this.errorGuardado.set(e.error?.error?.mensaje ?? 'No pudimos guardar el perfil. Intenta de nuevo.');
      },
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
