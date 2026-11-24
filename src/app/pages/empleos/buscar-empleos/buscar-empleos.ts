import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { JobService, AuthService } from '../../../core/services';
import { Job, JobFilters, JobSize, MODALIDAD_TEXTO, TAMANO_TEXTO, WorkModality } from '../../../core/models';
import { paginasDisponibles, textoTotal } from '../../../core/utils/paginacion';
import { JobCardComponent } from '../../../shared/components/job-card/job-card';
import { FilterPanelComponent } from '../../../shared/components/filter-panel/filter-panel';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { IconComponent } from '../../../shared/components/icon/icon';
import { CopPipe } from '../../../shared/pipes';

interface FichaFiltro {
  texto: string;
  quitar: Partial<Record<keyof JobFilters, unknown>>;
}

/**
 * Búsqueda de ofertas. La URL es la fuente de verdad: cada filtro, la
 * búsqueda y la página viven en los query params, así que se pueden
 * compartir, recargar y volver atrás sin perder nada.
 */
@Component({
  selector: 'jobsy-job-search',
  standalone: true,
  imports: [
    IconComponent, RouterLink, JobCardComponent, FilterPanelComponent, PaginationComponent,
    LoadingSpinnerComponent, EmptyStateComponent, SearchBarComponent,
  ],
  providers: [CopPipe],
  templateUrl: './buscar-empleos.html',
  styleUrl: './buscar-empleos.scss',
})
export class JobSearchPage {
  private jobService = inject(JobService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cop = inject(CopPipe);
  readonly rol = inject(AuthService).role;

  readonly jobs = signal<Job[]>([]);
  readonly cargando = signal(true);
  readonly totalPages = signal(1);
  readonly textoTotal = signal('');
  readonly filtrosAbiertos = signal(false);

  private readonly params = toSignal(this.route.queryParamMap, { requireSync: true });

  readonly filters = computed<JobFilters>(() => leerFiltros(this.params()));
  readonly page = computed(() => Math.max(1, Number(this.params().get('page')) || 1));

  /** Fichas de los filtros activos, cada una con su forma de quitarse. */
  readonly fichas = computed<FichaFiltro[]>(() => {
    const f = this.filters();
    const fichas: FichaFiltro[] = [];
    if (f.busqueda) fichas.push({ texto: `“${f.busqueda}”`, quitar: { busqueda: undefined } });
    if (f.ciudad) fichas.push({ texto: f.ciudad, quitar: { ciudad: undefined } });
    f.modalidad?.forEach((m) =>
      fichas.push({ texto: MODALIDAD_TEXTO[m], quitar: { modalidad: f.modalidad!.filter((x) => x !== m) } }),
    );
    f.tamano?.forEach((t) =>
      fichas.push({ texto: `Vivienda ${TAMANO_TEXTO[t].toLowerCase()}`, quitar: { tamano: f.tamano!.filter((x) => x !== t) } }),
    );
    if (f.precioMin) fichas.push({ texto: `Desde ${this.cop.transform(f.precioMin)}`, quitar: { precioMin: undefined } });
    if (f.precioMax) fichas.push({ texto: `Hasta ${this.cop.transform(f.precioMax)}`, quitar: { precioMax: undefined } });
    return fichas;
  });

  constructor() {
    // Cada cambio de la URL recarga el listado.
    this.route.queryParamMap.subscribe(() => this.load());
  }

  private load(): void {
    this.cargando.set(true);
    this.jobService.list(this.filters(), this.page(), 9).subscribe({
      next: (res) => {
        this.jobs.set(res.items);
        this.totalPages.set(paginasDisponibles(res));
        this.textoTotal.set(textoTotal(res.total, !!res.hasMore, 'oferta', 'ofertas'));
        this.cargando.set(false);
      },
      error: () => {
        this.jobs.set([]);
        this.textoTotal.set('');
        this.cargando.set(false);
      },
    });
  }

  private navegar(f: JobFilters, page = 1): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: f.busqueda || null,
        ciudad: f.ciudad || null,
        modalidad: f.modalidad?.length ? f.modalidad : null,
        tamano: f.tamano?.length ? f.tamano : null,
        min: f.precioMin || null,
        max: f.precioMax || null,
        page: page > 1 ? page : null,
      },
    });
  }

  buscar(e: { termino: string; ciudad: string }): void {
    this.navegar({ ...this.filters(), busqueda: e.termino.trim() || undefined, ciudad: e.ciudad.trim() || undefined });
  }

  applyFilters(f: JobFilters): void {
    this.navegar(f);
  }

  quitar(ficha: FichaFiltro): void {
    this.navegar({ ...this.filters(), ...ficha.quitar } as JobFilters);
  }

  limpiar(): void {
    this.navegar({});
  }

  changePage(p: number): void {
    this.navegar(this.filters(), p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function leerFiltros(q: ParamMap): JobFilters {
  const num = (k: string) => (q.get(k) ? Number(q.get(k)) || undefined : undefined);
  const lista = <T>(k: string) => (q.getAll(k).length ? (q.getAll(k) as T[]) : undefined);
  return {
    busqueda: q.get('q') || undefined,
    ciudad: q.get('ciudad') || undefined,
    modalidad: lista<WorkModality>('modalidad'),
    tamano: lista<JobSize>('tamano'),
    precioMin: num('min'),
    precioMax: num('max'),
  };
}
