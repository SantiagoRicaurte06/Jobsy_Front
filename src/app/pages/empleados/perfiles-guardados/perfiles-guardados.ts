import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EmployeeService } from '../../../core/services';
import { Employee } from '../../../core/models';
import { EmployeeCardComponent } from '../../../shared/components/employee-card/employee-card';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { IconComponent } from '../../../shared/components/icon/icon';

/** Perfiles de empleados que el usuario guardo desde su detalle. */
@Component({
  selector: 'jobsy-saved-profiles',
  standalone: true,
  imports: [RouterLink, EmployeeCardComponent, LoadingSpinnerComponent, EmptyStateComponent, IconComponent],
  templateUrl: './perfiles-guardados.html',
  styleUrl: './perfiles-guardados.scss',
})
export class SavedProfilesPage implements OnInit {
  private employeeService = inject(EmployeeService);
  private router = inject(Router);

  readonly perfiles = signal<Employee[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  /** Id del perfil que se esta quitando, para deshabilitar su boton. */
  readonly quitando = signal<string | null>(null);

  ngOnInit(): void {
    this.employeeService.saved().subscribe({
      next: (lista) => {
        this.perfiles.set(lista ?? []);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No pudimos cargar tus perfiles guardados.');
        this.cargando.set(false);
      },
    });
  }

  quitar(e: Employee): void {
    this.quitando.set(e.id);
    this.error.set('');
    this.employeeService.unsave(e.id).subscribe({
      next: () => {
        this.perfiles.update((l) => l.filter((p) => p.id !== e.id));
        this.quitando.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.quitando.set(null);
        this.error.set(err.error?.error?.mensaje ?? 'No pudimos quitar el perfil.');
      },
    });
  }

  solicitar(e: Employee): void {
    this.router.navigate(['/contratacion', e.id]);
  }
}
