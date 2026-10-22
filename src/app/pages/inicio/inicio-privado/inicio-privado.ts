import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, JobService, ApplicationService, HiringService, Hiring } from '../../../core/services';
import { Job, Application, OwnJob } from '../../../core/models';
import { JobCardComponent } from '../../../shared/components/job-card/job-card';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'jobsy-home-logged',
  standalone: true,
  imports: [IconComponent, RouterLink, JobCardComponent],
  templateUrl: './inicio-privado.html',
  styleUrl: './inicio-privado.scss',
})
export class HomeLoggedPage implements OnInit {
  private auth = inject(AuthService);
  private jobService = inject(JobService);
  private applicationService = inject(ApplicationService);
  private hiringService = inject(HiringService);

  readonly user = this.auth.user;
  readonly esEmpleador = computed(() => this.user()?.rol === 'empleador');

  readonly jobs = signal<Job[]>([]);
  readonly applications = signal<Application[]>([]);
  readonly misOfertas = signal<OwnJob[]>([]);
  readonly contrataciones = signal<Hiring[]>([]);

  /** Postulaciones de la empleada que siguen esperando respuesta. */
  readonly postulacionesAbiertas = computed(
    () => this.applications().filter((a) => a.estado === 'pendiente' || a.estado === 'en_revision').length,
  );
  readonly ofertasActivas = computed(() => this.misOfertas().filter((o) => o.estado === 'activa').length);
  readonly porResponder = computed(() => this.misOfertas().reduce((s, o) => s + o.pendientes, 0));
  readonly enCurso = computed(() => this.contrataciones().filter((h) => h.estado === 'activa').length);

  /** Accesos rapidos del panel, segun el rol. */
  readonly shortcuts = computed(() =>
    this.esEmpleador()
      ? [
          { icon: 'square-pen', label: 'Publicar oferta', path: '/publicar-oferta' },
          { icon: 'briefcase', label: 'Mis ofertas', path: '/app/mis-ofertas' },
          { icon: 'calendar', label: 'Contrataciones', path: '/app/contrataciones' },
          { icon: 'search', label: 'Buscar empleados', path: '/empleados' },
        ]
      : [
          { icon: 'search', label: 'Buscar empleo', path: '/empleos' },
          { icon: 'file-text', label: 'Mi hoja de vida', path: '/app/hoja-de-vida' },
          { icon: 'calendar', label: 'Mis trabajos', path: '/app/contrataciones' },
          { icon: 'shopping-cart', label: 'Tienda', path: '/tienda' },
        ],
  );

  ngOnInit(): void {
    this.hiringService.mine().subscribe({ next: (h) => this.contrataciones.set(h), error: () => {} });
    if (this.esEmpleador()) {
      this.jobService.mine().subscribe({ next: (o) => this.misOfertas.set(o), error: () => {} });
      return;
    }
    this.jobService.featured(3).subscribe((j) => this.jobs.set(j));
    this.applicationService.myApplications().subscribe((a) => this.applications.set(a));
  }
}
