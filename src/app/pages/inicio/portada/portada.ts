import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { JobService, EmployeeService, CartService } from '../../../core/services';
import { Job, Employee } from '../../../core/models';
import { IMG_SITE } from '../../../mocks';
import { JobCardComponent } from '../../../shared/components/job-card/job-card';
import { EmployeeCardComponent } from '../../../shared/components/employee-card/employee-card';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

@Component({
  selector: 'jobsy-landing',
  standalone: true,
  imports: [
    RouterLink,
    JobCardComponent,
    EmployeeCardComponent,
    SearchBarComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './portada.html',
  styleUrl: './portada.scss',
})
export class LandingPage implements OnInit {
  private jobService = inject(JobService);
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  readonly cart = inject(CartService);

  /** Fotos de las secciones estaticas de la portada. */
  readonly images = IMG_SITE;

  readonly jobs = signal<Job[]>([]);
  readonly employees = signal<Employee[]>([]);
  readonly loading = signal(true);

  /** Filtros rapidos bajo el buscador. */
  readonly quickFilters = ['Todos', 'Limpieza', 'Cocina', 'Jardineria', 'Cuidado de ninos', 'Mantenimiento', 'Tiempo completo'];
  readonly activeFilter = signal('Todos');

  /** Total real de ofertas, para que el hero no prometa una cifra inventada. */
  readonly totalEmpleos = signal(0);
  readonly totalEmpleados = signal(0);

  /**
   * Cifras de la franja de confianza.
   * Salen de los datos cargados: antes estaban fijas en 0 y contradecian
   * al listado de abajo.
   */
  readonly stats = computed(() => [
    { value: String(this.totalEmpleos()), label: 'Empleos activos' },
    { value: String(this.totalEmpleados()), label: 'Empleados registrados' },
    { value: '100%', label: 'Satisfaccion' },
    { value: '1', label: 'Ciudad' },
  ]);

  readonly benefits = [
    { icon: '✅', title: 'Empleados verificados' },
    { icon: '\u{1F3E0}', title: 'Edificaciones reales' },
    { icon: '⚡', title: 'Contratacion rapida' },
    { icon: '\u{1F6E1}', title: 'Soporte confiable' },
  ];

  ngOnInit(): void {
    this.jobService.featured(6).subscribe((jobs) => {
      this.jobs.set(jobs);
      this.loading.set(false);
    });

    this.employeeService.featured(3).subscribe((e) => this.employees.set(e));

    // Los totales van aparte: el listado solo muestra los destacados, pero la
    // franja de cifras debe reflejar el catalogo completo.
    this.jobService.list({}, 1, 1).subscribe((res) => this.totalEmpleos.set(res.total));
    this.employeeService.list('', 1, 1).subscribe((res) => this.totalEmpleados.set(res.total));
  }

  buscar(event: { termino: string; ciudad: string }): void {
    this.router.navigate(['/empleos'], { queryParams: { q: event.termino, ciudad: event.ciudad } });
  }

  setFilter(f: string): void {
    this.activeFilter.set(f);
  }
}
