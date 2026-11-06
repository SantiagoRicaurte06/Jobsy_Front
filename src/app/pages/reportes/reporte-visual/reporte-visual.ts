import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApplicationService, AuthService, EmployeeService, HiringService, Hiring, JobService } from '../../../core/services';
import { Application, Employee, Job } from '../../../core/models';
import { BarChartComponent, BarDatum } from '../../../shared/components/bar-chart/bar-chart';

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/**
 * Reporte de actividad del usuario, calculado con sus postulaciones,
 * contrataciones y ficha de empleado (antes eran cifras de ejemplo fijas).
 */
@Component({
  selector: 'jobsy-visual-report',
  standalone: true,
  imports: [RouterLink, BarChartComponent],
  templateUrl: './reporte-visual.html',
  styleUrl: './reporte-visual.scss',
})
export class VisualReportPage implements OnInit {
  private auth = inject(AuthService);
  private applications = inject(ApplicationService);
  private hirings = inject(HiringService);
  private employees = inject(EmployeeService);
  private jobs = inject(JobService);

  readonly periodo = signal(String(new Date().getFullYear()));
  private readonly postulacionesUsuario = signal<Application[]>([]);
  private readonly contrataciones = signal<Hiring[]>([]);
  private readonly empleado = signal<Employee | undefined>(undefined);
  private readonly ofertas = signal<Job[]>([]);

  readonly postulaciones = computed<BarDatum[]>(() => {
    const ano = Number(this.periodo());
    const mesActual = new Date().getMonth();
    const conteo = new Array(12).fill(0);
    for (const p of this.postulacionesUsuario()) {
      const f = new Date(p.fechaPostulacion);
      if (f.getFullYear() === ano) conteo[f.getMonth()]++;
    }
    return MESES.slice(0, mesActual + 1).map((label, i) => ({ label, value: conteo[i], destacado: i === mesActual }));
  });

  readonly kpis = computed(() => {
    const posts = this.postulacionesUsuario();
    const mes = new Date().getMonth();
    const esteMes = posts.filter((p) => new Date(p.fechaPostulacion).getMonth() === mes).length;
    const respondidas = posts.filter((p) => p.estado === 'aceptada' || p.estado === 'rechazada').length;
    const completadas = this.contrataciones().filter((c) => c.estado === 'completada').length;
    const e = this.empleado();
    return [
      { label: 'Postulaciones enviadas', value: String(posts.length), delta: `${esteMes} este mes` },
      { label: 'Tasa de respuesta', value: posts.length ? `${Math.round((respondidas / posts.length) * 100)}%` : '—', delta: `${respondidas} respondidas` },
      { label: 'Servicios completados', value: String(completadas), delta: `${this.contrataciones().length} contrataciones` },
      { label: 'Calificacion promedio', value: e && e.calificacion > 0 ? e.calificacion.toFixed(1) : '—', delta: e ? `${e.totalServicios} servicios` : '' },
    ];
  });

  /** Reparto por etiqueta de las ofertas a las que se postulo. */
  readonly categorias = computed(() => {
    const cuenta = new Map<string, number>();
    for (const o of this.ofertas()) for (const t of o.etiquetas) cuenta.set(t, (cuenta.get(t) ?? 0) + 1);
    const total = [...cuenta.values()].reduce((a, b) => a + b, 0);
    return [...cuenta.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nombre, n]) => ({ nombre, porcentaje: Math.round((n / total) * 100) }));
  });

  ngOnInit(): void {
    this.applications.myApplications().subscribe((posts) => {
      this.postulacionesUsuario.set(posts);
      const ids = [...new Set(posts.map((p) => p.jobId))].slice(0, 20);
      if (!ids.length) return;
      forkJoin(ids.map((id) => this.jobs.getById(id).pipe(catchError(() => of(undefined))))).subscribe((jobs) =>
        this.ofertas.set(jobs.filter((j): j is Job => !!j)),
      );
    });
    this.hirings.mine().subscribe((h) => this.contrataciones.set(h));
    const u = this.auth.user();
    if (u?.rol === 'empleado') this.employees.getById(u.id).subscribe((e) => this.empleado.set(e));
  }
}
