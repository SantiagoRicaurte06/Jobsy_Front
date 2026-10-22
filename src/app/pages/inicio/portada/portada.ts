import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { JobService, EmployeeService, CartService, ProductService } from '../../../core/services';
import { CIUDADES } from '../../../core/validation/reglas';
import { Job, Employee } from '../../../core/models';
import { IMG_SITE } from '../../../mocks';
import { JobCardComponent } from '../../../shared/components/job-card/job-card';
import { EmployeeCardComponent } from '../../../shared/components/employee-card/employee-card';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'jobsy-landing',
  standalone: true,
  imports: [
    RouterLink,
    JobCardComponent,
    EmployeeCardComponent,
    SearchBarComponent,
    LoadingSpinnerComponent,
    IconComponent,
  ],
  templateUrl: './portada.html',
  styleUrl: './portada.scss',
})
export class LandingPage implements OnInit, OnDestroy {
  private jobService = inject(JobService);
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  readonly cart = inject(CartService);

  /** Fotos de las secciones estaticas de la portada. */
  readonly images = IMG_SITE;

  readonly jobs = signal<Job[]>([]);
  readonly employees = signal<Employee[]>([]);
  readonly cargando = signal(true);

  /** Filtros rapidos bajo el buscador. */
  readonly quickFilters = ['Todos', 'Limpieza', 'Cocina', 'Jardineria', 'Cuidado de ninos', 'Mantenimiento', 'Tiempo completo'];
  readonly activeFilter = signal('Todos');

  /** Total real de ofertas, para que el hero no prometa una cifra inventada. */
  readonly totalEmpleos = signal(0);
  readonly totalEmpleados = signal(0);
  readonly totalProductos = signal(0);
  private productService = inject(ProductService);

  /** "1 empleo disponible" / "7 empleos disponibles". */
  readonly textoEmpleos = computed(() =>
    this.totalEmpleos() === 1 ? '1 empleo disponible hoy' : `${this.totalEmpleos()} empleos disponibles hoy`,
  );

  /**
   * Cifras de la franja de confianza.
   * Salen de los datos cargados: antes estaban fijas en 0 y contradecian
   * al listado de abajo.
   */
  readonly stats = computed(() => [
    { value: String(this.totalEmpleos()), label: 'Empleos activos' },
    { value: String(this.totalEmpleados()), label: 'Empleados registrados' },
    // Antes "100% Satisfaccion" y "1 Ciudad" estaban escritos a mano.
    { value: String(this.totalProductos()), label: 'Productos en la tienda' },
    { value: String(CIUDADES.length), label: 'Ciudades con cobertura' },
  ]);

  readonly benefits = [
    { icon: 'circle-check', title: 'Empleados verificados' },
    { icon: 'house', title: 'Edificaciones reales' },
    { icon: 'zap', title: 'Contratacion rapida' },
    { icon: 'shield', title: 'Soporte confiable' },
  ];

  /** Imagenes del carrusel del hero: limpieza, jardineria y cuidado de ninos. */
  readonly heroSlides = [
    { src: this.images.hero, alt: 'Profesional del hogar limpiando una vivienda' },
    { src: this.images.heroJardineria, alt: 'Profesional del hogar en labores de jardineria' },
    { src: this.images.heroCuidadoNinos, alt: 'Profesional del hogar en labores de cuidado de ninos' },
  ];

  readonly slideActual = signal(0);
  private carruselTimer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.jobService.featured(6).subscribe((jobs) => {
      this.jobs.set(jobs);
      this.cargando.set(false);
    });

    this.employeeService.featured(3).subscribe((e) => this.employees.set(e));

    // Los totales van aparte: el listado solo muestra los destacados, pero la
    // franja de cifras debe reflejar el catalogo completo.
    this.jobService.list({}, 1, 1).subscribe((res) => this.totalEmpleos.set(res.total));
    this.employeeService.list('', 1, 1).subscribe((res) => this.totalEmpleados.set(res.total));
    this.productService.list(undefined, 1, 1).subscribe((res) => this.totalProductos.set(res.total));

    this.carruselTimer = setInterval(() => this.siguienteSlide(), 5000);
  }

  ngOnDestroy(): void {
    if (this.carruselTimer) clearInterval(this.carruselTimer);
  }

  siguienteSlide(): void {
    this.slideActual.set((this.slideActual() + 1) % this.heroSlides.length);
  }

  anteriorSlide(): void {
    const total = this.heroSlides.length;
    this.slideActual.set((this.slideActual() - 1 + total) % total);
  }

  irASlide(i: number): void {
    this.slideActual.set(i);
  }

  buscar(event: { termino: string; ciudad: string }): void {
    this.router.navigate(['/empleos'], { queryParams: { q: event.termino, ciudad: event.ciudad } });
  }

  setFilter(f: string): void {
    this.activeFilter.set(f);
  }
}
