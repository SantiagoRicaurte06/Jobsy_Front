import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { JobService, EmployeeService, AuthService } from '../../../core/services';
import { Job, Employee } from '../../../core/models';
import { textoTotal } from '../../../core/utils/paginacion';
import { CopPipe } from '../../../shared/pipes';
import { JobCardComponent } from '../../../shared/components/job-card/job-card';
import { EmployeeCardComponent } from '../../../shared/components/employee-card/employee-card';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { IconComponent } from '../../../shared/components/icon/icon';
import { PlanificadorComponent, ModoPlan } from './planificador/planificador';
import { AcuerdoAppComponent } from './acuerdo/acuerdo';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { FranjaSemanaComponent } from '../../../shared/components/franja-semana/franja-semana';

@Component({
  selector: 'jobsy-landing',
  standalone: true,
  imports: [
    RouterLink,
    CopPipe,
    JobCardComponent,
    EmployeeCardComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    IconComponent,
    PlanificadorComponent,
    AcuerdoAppComponent,
    SearchBarComponent,
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
  /** Muestra amplia para el planificador: los conteos y tarifas salen de aquí. */
  readonly jobs = signal<Job[]>([]);
  readonly employees = signal<Employee[]>([]);
  readonly cargando = signal(true);

  /** Con sesión manda el rol; sin sesión el visitante elige su lado. */
  readonly modo = signal<ModoPlan>(this.auth.role() === 'empleado' ? 'trabajar' : 'contratar');
  readonly modoFijo = computed(() => !!this.rol());

  private readonly totalOfertas = signal<{ total: number; hayMas: boolean } | null>(null);
  private readonly totalPerfiles = signal<{ total: number; hayMas: boolean } | null>(null);

  readonly resumen = computed(() => {
    const o = this.totalOfertas();
    const p = this.totalPerfiles();
    const partes: string[] = [];
    if (o && o.total > 0) partes.push(textoTotal(o.total, o.hayMas, 'oferta abierta', 'ofertas abiertas'));
    if (p && p.total > 0) partes.push(textoTotal(p.total, p.hayMas, 'persona con perfil', 'personas con perfil'));
    return partes.length ? partes.join(' · ') + ' en Yopal' : null;
  });

  /** Personas protagonistas: verificadas y con más servicios primero. */
  readonly protagonistas = computed(() =>
    [...this.employees()]
      .sort((a, b) => Number(b.verificado) - Number(a.verificado) || b.totalServicios - a.totalServicios)
      .slice(0, 6),
  );

  /** La oferta que se muestra sobre la foto: una con horario, para que se vea la franja. */
  readonly ofertaMuestra = computed(() => this.jobs().find((j) => !!j.horario && j.precioHora > 0) ?? null);
  readonly personaMuestra = computed(() => this.protagonistas()[0] ?? null);

  /** Fichas de tarea para filtrar las ofertas, sacadas de las propias ofertas. */
  readonly filtrosRapidos = computed(() => {
    const tareas = new Set<string>();
    for (const j of this.jobs()) j.etiquetas.forEach((t) => tareas.add(t));
    return ['Todas', ...Array.from(tareas).slice(0, 6)];
  });
  readonly filtro = signal('Todas');

  readonly ofertasFiltradas = computed(() => {
    const f = this.filtro();
    const lista = f === 'Todas' ? this.jobs() : this.jobs().filter((j) => j.etiquetas.includes(f));
    return lista.slice(0, 6);
  });

  ngOnInit(): void {
    this.jobService.list({}, 1, 50).subscribe({
      next: (res) => {
        this.jobs.set(res.items);
        this.totalOfertas.set({ total: res.total, hayMas: !!res.hasMore });
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
    this.employeeService.list('', 1, 50).subscribe({
      next: (res) => {
        this.employees.set(res.items);
        this.totalPerfiles.set({ total: res.total, hayMas: !!res.hasMore });
      },
      error: () => {},
    });
  }

  /** El buscador lleva a personas (hogares y visitantes) o a ofertas (quien trabaja). */
  buscar(e: { termino: string; ciudad: string }): void {
    const q = e.termino.trim() || null;
    const ciudad = e.ciudad.trim() || null;
    const destino = this.rol() === 'empleado' ? '/empleos' : '/empleados';
    this.router.navigate([destino], { queryParams: { q, ciudad } });
  }

  contratar(e: Employee): void {
    this.router.navigate(['/contratacion', e.id]);
  }
}
