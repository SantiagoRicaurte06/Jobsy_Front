import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { JobService, EmployeeService, AuthService } from '../../../core/services';
import { Job, Employee } from '../../../core/models';
import { textoTotal } from '../../../core/utils/paginacion';
import { CopPipe } from '../../../shared/pipes';
import { JobCardComponent } from '../../../shared/components/job-card/job-card';
import { EmployeeCardComponent } from '../../../shared/components/employee-card/employee-card';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { IconComponent } from '../../../shared/components/icon/icon';
import { FranjaSemanaComponent } from '../../../shared/components/franja-semana/franja-semana';

type Modo = 'contratar' | 'trabajar';

@Component({
  selector: 'jobsy-landing',
  standalone: true,
  imports: [
    RouterLink,
    CopPipe,
    JobCardComponent,
    EmployeeCardComponent,
    SearchBarComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    IconComponent,
    FranjaSemanaComponent,
  ],
  templateUrl: './portada.html',
  styleUrl: './portada.scss',
})
export class LandingPage implements OnInit {
  private jobService = inject(JobService);
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private auth = inject(AuthService);

  readonly rol = this.auth.role;

  readonly jobs = signal<Job[]>([]);
  readonly employees = signal<Employee[]>([]);
  readonly cargando = signal(true);

  /** El buscador del primer vistazo sirve a los dos lados del acuerdo. */
  readonly modo = signal<Modo>(this.auth.role() === 'empleado' ? 'trabajar' : 'contratar');
  // Sin sesión se elige con las dos puertas; con sesión manda el rol.

  /** Conteos reales; `hayMas` marca cuando el total es solo una cota inferior. */
  private readonly ofertasAbiertas = signal<{ total: number; hayMas: boolean } | null>(null);
  private readonly perfiles = signal<{ total: number; hayMas: boolean } | null>(null);

  readonly resumen = computed(() => {
    const o = this.ofertasAbiertas();
    const p = this.perfiles();
    const partes: string[] = [];
    if (o && o.total > 0) partes.push(textoTotal(o.total, o.hayMas, 'oferta abierta', 'ofertas abiertas'));
    if (p && p.total > 0) partes.push(textoTotal(p.total, p.hayMas, 'persona con perfil', 'personas con perfil'));
    return partes.length ? partes.join(' · ') + ' en Yopal' : null;
  });

  /** La oferta que demuestra el producto en el primer vistazo. */
  readonly ofertaDestacada = computed(() => this.jobs()[0] ?? null);

  /** Las fichas salen de las tareas que de verdad tienen las ofertas. */
  readonly filtrosRapidos = computed(() => {
    const tareas = new Set<string>();
    for (const j of this.jobs()) j.etiquetas.forEach((t) => tareas.add(t));
    return ['Todas', ...Array.from(tareas).slice(0, 6)];
  });
  readonly filtro = signal('Todas');

  readonly ofertasFiltradas = computed(() => {
    const f = this.filtro();
    return f === 'Todas' ? this.jobs() : this.jobs().filter((j) => j.etiquetas.includes(f));
  });

  ngOnInit(): void {
    this.jobService.featured(6).subscribe({
      next: (jobs) => {
        this.jobs.set(jobs);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });

    this.employeeService.featured(3).subscribe({ next: (e) => this.employees.set(e), error: () => {} });

    this.jobService.list({}, 1, 50).subscribe({
      next: (res) => this.ofertasAbiertas.set({ total: res.total, hayMas: !!res.hasMore }),
      error: () => {},
    });
    this.employeeService.list('', 1, 50).subscribe({
      next: (res) => this.perfiles.set({ total: res.total, hayMas: !!res.hasMore }),
      error: () => {},
    });
  }

  buscar(event: { termino: string; ciudad: string }): void {
    this.router.navigate(['/empleos'], {
      queryParams: { q: event.termino.trim() || null, ciudad: event.ciudad.trim() || null },
    });
  }

  contratar(e: Employee): void {
    this.router.navigate(['/contratacion', e.id]);
  }
}
