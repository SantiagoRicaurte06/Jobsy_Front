import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService, AuthService } from '../../../core/services';
import { Employee } from '../../../core/models';
import { paginasDisponibles, textoTotal } from '../../../core/utils/paginacion';
import { EmployeeCardComponent } from '../../../shared/components/employee-card/employee-card';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { IconComponent } from '../../../shared/components/icon/icon';

/**
 * Búsqueda de empleados. La búsqueda y la página viven en la URL.
 * El middleware filtra solo por nombre, así que no se ofrecen filtros por
 * especialidad que devolverían listas vacías.
 */
@Component({
  selector: 'jobsy-employee-search',
  standalone: true,
  imports: [
    RouterLink, IconComponent, EmployeeCardComponent, SearchBarComponent, PaginationComponent,
    LoadingSpinnerComponent, EmptyStateComponent,
  ],
  templateUrl: './buscar-empleados.html',
  styleUrl: './buscar-empleados.scss',
})
export class EmployeeSearchPage {
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  readonly rol = inject(AuthService).role;

  readonly employees = signal<Employee[]>([]);
  readonly cargando = signal(true);
  readonly totalPages = signal(1);
  readonly textoTotal = signal('');

  private readonly params = toSignal(this.route.queryParamMap, { requireSync: true });
  readonly busqueda = computed(() => this.params().get('q') ?? '');
  readonly page = computed(() => Math.max(1, Number(this.params().get('page')) || 1));

  constructor() {
    this.route.queryParamMap.subscribe(() => this.load());
  }

  private load(): void {
    this.cargando.set(true);
    this.employeeService.list(this.busqueda(), this.page(), 9).subscribe({
      next: (res) => {
        this.employees.set(res.items);
        this.totalPages.set(paginasDisponibles(res));
        this.textoTotal.set(textoTotal(res.total, !!res.hasMore, 'perfil', 'perfiles'));
        this.cargando.set(false);
      },
      error: () => {
        this.employees.set([]);
        this.textoTotal.set('');
        this.cargando.set(false);
      },
    });
  }

  private navegar(q: string, page = 1): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: q.trim() || null, page: page > 1 ? page : null },
    });
  }

  buscar(event: { termino: string }): void {
    this.navegar(event.termino);
  }

  changePage(p: number): void {
    this.navegar(this.busqueda(), p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  solicitar(employee: Employee): void {
    this.router.navigate(['/contratacion', employee.id]);
  }
}
