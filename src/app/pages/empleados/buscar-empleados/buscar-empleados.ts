import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService, AuthService } from '../../../core/services';
import { Employee } from '../../../core/models';
import { paginasDisponibles, textoTotal } from '../../../core/utils/paginacion';
import { DIA_NOMBRE } from '../../../core/utils/horario';
import { coincideOficio, leerSemana, oficiosDe, semanaEnUrl } from '../../../core/utils/semana';
import { EmployeeCardComponent } from '../../../shared/components/employee-card/employee-card';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { IconComponent } from '../../../shared/components/icon/icon';
import { CambioSemana, TuSemanaComponent } from '../../../shared/components/tu-semana/tu-semana';

const POR_PAGINA = 9;
/** Con oficio elegido se trae una muestra amplia y se filtra aquí. */
const MUESTRA = 50;

/**
 * Búsqueda de personas. Búsqueda, oficio, semana y página viven en la URL.
 * El middleware filtra solo por nombre; el oficio se filtra en el cliente
 * sobre una muestra amplia y se pagina aquí.
 */
@Component({
  selector: 'jobsy-employee-search',
  standalone: true,
  imports: [
    RouterLink, IconComponent, EmployeeCardComponent, SearchBarComponent, PaginationComponent,
    LoadingSpinnerComponent, EmptyStateComponent, TuSemanaComponent,
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
  readonly oficios = signal<string[]>([]);

  private readonly params = toSignal(this.route.queryParamMap, { requireSync: true });
  readonly busqueda = computed(() => this.params().get('q') ?? '');
  readonly oficio = computed(() => this.params().get('oficio'));
  readonly semana = computed(() => leerSemana(this.params()));
  readonly page = computed(() => Math.max(1, Number(this.params().get('page')) || 1));

  /** "lunes, miércoles y viernes" para el conteo. */
  readonly diasTexto = computed(() => {
    const n = (this.semana()?.dias ?? []).map((d) => DIA_NOMBRE[d]);
    return n.length > 1 ? `${n.slice(0, -1).join(', ')} y ${n[n.length - 1]}` : (n[0] ?? '');
  });

  constructor() {
    this.route.queryParamMap.subscribe(() => this.load());
    this.employeeService.list('', 1, MUESTRA).subscribe({
      next: (res) => this.oficios.set(oficiosDe(res.items.map((e) => e.especialidades))),
      error: () => {},
    });
  }

  private load(): void {
    this.cargando.set(true);
    const oficio = this.oficio();
    const fin = (items: Employee[], total: number, hayMas: boolean, paginas: number) => {
      this.employees.set(items);
      this.totalPages.set(paginas);
      this.textoTotal.set(textoTotal(total, hayMas, 'persona', 'personas'));
      this.cargando.set(false);
    };
    const pedido = oficio
      ? this.employeeService.list(this.busqueda(), 1, MUESTRA)
      : this.employeeService.list(this.busqueda(), this.page(), POR_PAGINA);

    pedido.subscribe({
      next: (res) => {
        if (!oficio) return fin(res.items, res.total, !!res.hasMore, paginasDisponibles(res));
        const todos = res.items.filter((e) => coincideOficio(e.especialidades, oficio));
        const inicio = (this.page() - 1) * POR_PAGINA;
        fin(todos.slice(inicio, inicio + POR_PAGINA), todos.length, false, Math.max(1, Math.ceil(todos.length / POR_PAGINA)));
      },
      error: () => fin([], 0, false, 1),
    });
  }

  private navegar(cambios: Record<string, unknown>, page = 1): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...cambios, page: page > 1 ? page : null },
      queryParamsHandling: 'merge',
    });
  }

  buscar(event: { termino: string }): void {
    this.navegar({ q: event.termino.trim() || null });
  }

  cambiarSemana(c: CambioSemana): void {
    this.navegar({ oficio: c.oficio, ...semanaEnUrl(c.semana) });
  }

  changePage(p: number): void {
    this.navegar({}, p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  solicitar(employee: Employee): void {
    this.router.navigate(['/contratacion', employee.id]);
  }
}
