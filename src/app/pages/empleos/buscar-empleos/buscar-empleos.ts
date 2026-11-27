import { Component, HostListener, computed, inject, signal } from '@angular/core';
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
import { GrupoFiltro } from '../../../shared/components/filter-panel/filter-panel';
import { HORAS_DEFECTO, Semana, coincideOficio, leerSemana, oficiosDe, pagoSemana, semanaEnUrl } from '../../../core/utils/semana';
import { DIAS_SEMANA, DIA_INICIAL, DIA_NOMBRE, DiaSemana } from '../../../core/utils/horario';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { IconComponent } from '../../../shared/components/icon/icon';
import { CopPipe } from '../../../shared/pipes';

const POR_PAGINA = 9;
/** Con oficio o días elegidos se trae una muestra amplia y se filtra aquí. */
const MUESTRA = 50;

interface FichaFiltro {
  texto: string;
  quitar: () => void;
}

type MenuFiltro = 'dias' | GrupoFiltro;

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
  readonly menuAbierto = signal<MenuFiltro | null>(null);

  readonly dias7 = DIAS_SEMANA;
  readonly inicial = DIA_INICIAL;
  readonly nombreDia = DIA_NOMBRE;
  readonly menus: { id: MenuFiltro; texto: string }[] = [
    { id: 'dias', texto: 'Días' },
    { id: 'modalidad', texto: 'Modalidad' },
    { id: 'tamano', texto: 'Vivienda' },
    { id: 'precio', texto: 'Tarifa' },
  ];

  private readonly params = toSignal(this.route.queryParamMap, { requireSync: true });

  readonly filters = computed<JobFilters>(() => leerFiltros(this.params()));
  readonly page = computed(() => Math.max(1, Number(this.params().get('page')) || 1));
  readonly oficio = computed(() => this.params().get('oficio'));
  readonly semana = computed(() => leerSemana(this.params()));
  readonly misDias = computed(() => this.semana()?.dias ?? null);
  readonly oficios = signal<string[]>([]);

  /** Fichas de los filtros activos, cada una con su forma de quitarse. */
  readonly fichas = computed<FichaFiltro[]>(() => {
    const f = this.filters();
    const sin = (cambio: Partial<JobFilters>) => () => this.navegar({ ...f, ...cambio });
    const fichas: FichaFiltro[] = [];
    const oficio = this.oficio();
    if (oficio) fichas.push({ texto: oficio, quitar: () => this.elegirOficio(null) });
    const dias = this.misDias();
    if (dias?.length) fichas.push({ texto: textoDias(dias), quitar: () => this.cambiarDias([]) });
    if (f.busqueda) fichas.push({ texto: `“${f.busqueda}”`, quitar: sin({ busqueda: undefined }) });
    if (f.ciudad) fichas.push({ texto: f.ciudad, quitar: sin({ ciudad: undefined }) });
    f.modalidad?.forEach((m) =>
      fichas.push({ texto: MODALIDAD_TEXTO[m], quitar: sin({ modalidad: f.modalidad!.filter((x) => x !== m) }) }),
    );
    f.tamano?.forEach((t) =>
      fichas.push({ texto: `Vivienda ${TAMANO_TEXTO[t].toLowerCase()}`, quitar: sin({ tamano: f.tamano!.filter((x) => x !== t) }) }),
    );
    if (f.precioMin) fichas.push({ texto: `Desde ${this.cop.transform(f.precioMin)}`, quitar: sin({ precioMin: undefined }) });
    if (f.precioMax) fichas.push({ texto: `Hasta ${this.cop.transform(f.precioMax)}`, quitar: sin({ precioMax: undefined }) });
    return fichas;
  });

  /** Filtros que viven en la hoja del celular (el oficio queda fuera, a la vista). */
  readonly cuentaHoja = computed(() => this.fichas().length - (this.oficio() ? 1 : 0)
    - (this.filters().busqueda ? 1 : 0) - (this.filters().ciudad ? 1 : 0));

  /** Lo elegido en cada menú, para leerlo sin abrirlo. */
  resumenMenu(id: MenuFiltro): string | null {
    const f = this.filters();
    switch (id) {
      case 'dias': {
        const d = this.misDias();
        return d?.length ? d.map((x) => mayuscula(DIA_NOMBRE[x].slice(0, 3))).join(', ') : null;
      }
      case 'modalidad':
        return f.modalidad?.length ? (f.modalidad.length === 1 ? MODALIDAD_TEXTO[f.modalidad[0]] : `${f.modalidad.length}`) : null;
      case 'tamano':
        return f.tamano?.length ? (f.tamano.length === 1 ? TAMANO_TEXTO[f.tamano[0]] : `${f.tamano.length}`) : null;
      case 'precio':
        if (f.precioMin && f.precioMax) return `${this.cop.transform(f.precioMin)}–${this.cop.transform(f.precioMax)}`;
        if (f.precioMin) return `desde ${this.cop.transform(f.precioMin)}`;
        if (f.precioMax) return `hasta ${this.cop.transform(f.precioMax)}`;
        return null;
    }
  }

  alternarMenu(id: MenuFiltro): void {
    this.menuAbierto.update((a) => (a === id ? null : id));
  }

  /** Un clic fuera de los menús o Escape los cierra. */
  @HostListener('document:click', ['$event'])
  alHacerClic(e: MouseEvent): void {
    if (this.menuAbierto() && !(e.target as HTMLElement).closest?.('.menu_empleos')) this.menuAbierto.set(null);
  }

  @HostListener('document:keydown.escape')
  alEscape(): void {
    this.menuAbierto.set(null);
    this.filtrosAbiertos.set(false);
  }

  constructor() {
    // Cada cambio de la URL recarga el listado.
    this.route.queryParamMap.subscribe(() => this.load());
    this.jobService.list({}, 1, MUESTRA).subscribe({
      next: (res) => this.oficios.set(oficiosDe(res.items.map((j) => j.etiquetas))),
      error: () => {},
    });
  }

  private load(): void {
    this.cargando.set(true);
    const oficio = this.oficio();
    const semana = this.semana();

    // Sin oficio ni días, el servidor pagina.
    if (!oficio && !semana) {
      this.jobService.list(this.filters(), this.page(), POR_PAGINA).subscribe({
        next: (res) => {
          this.jobs.set(res.items);
          this.totalPages.set(paginasDisponibles(res));
          this.textoTotal.set(textoTotal(res.total, !!res.hasMore, 'oferta', 'ofertas'));
          this.cargando.set(false);
        },
        error: () => this.sinResultados(),
      });
      return;
    }

    // Con oficio o días: muestra amplia, filtro aquí y, con días, la que más paga primero.
    this.jobService.list(this.filters(), 1, MUESTRA).subscribe({
      next: (res) => {
        let lista = res.items.filter((j) => coincideOficio(j.etiquetas, oficio));
        if (semana) {
          lista = lista
            .map((j) => ({ j, pago: pagoSemana(j.horario, j.precioHora, semana) }))
            .filter((x) => x.pago.comunes.length > 0)
            .sort((a, b) => b.pago.total - a.pago.total)
            .map((x) => x.j);
        }
        const inicio = (this.page() - 1) * POR_PAGINA;
        this.jobs.set(lista.slice(inicio, inicio + POR_PAGINA));
        this.totalPages.set(Math.max(1, Math.ceil(lista.length / POR_PAGINA)));
        this.textoTotal.set(textoTotal(lista.length, false, 'oferta', 'ofertas'));
        this.cargando.set(false);
      },
      error: () => this.sinResultados(),
    });
  }

  private sinResultados(): void {
    this.jobs.set([]);
    this.textoTotal.set('');
    this.cargando.set(false);
  }

  private navegar(f: JobFilters, page = 1, extra: Record<string, unknown> = {}): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        oficio: this.oficio(),
        ...semanaEnUrl(this.semana()),
        horas: null,
        ...extra,
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

  elegirOficio(o: string | null): void {
    this.navegar(this.filters(), 1, { oficio: o });
  }

  alternarDia(d: DiaSemana): void {
    const ds = this.misDias() ?? [];
    this.cambiarDias(ds.includes(d) ? ds.filter((x) => x !== d) : [...ds, d]);
  }

  private cambiarDias(dias: DiaSemana[]): void {
    const orden = DIAS_SEMANA.filter((d) => dias.includes(d));
    const semana: Semana | null = orden.length ? { dias: orden, horas: HORAS_DEFECTO } : null;
    this.navegar(this.filters(), 1, { dias: semanaEnUrl(semana).dias });
  }

  applyFilters(f: JobFilters): void {
    this.navegar(f);
  }

  limpiar(): void {
    this.navegar({}, 1, { oficio: null, dias: null });
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

/** "Lun, Mie y Vie" → "Lunes, miércoles y viernes" en corto para la ficha. */
function textoDias(dias: readonly DiaSemana[]): string {
  const n = dias.map((d) => DIA_NOMBRE[d]);
  const t = n.length > 1 ? `${n.slice(0, -1).join(', ')} y ${n[n.length - 1]}` : n[0];
  return mayuscula(t);
}

function mayuscula(t: string): string {
  return t.charAt(0).toUpperCase() + t.slice(1);
}
