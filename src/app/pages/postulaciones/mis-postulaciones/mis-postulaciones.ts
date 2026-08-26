import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApplicationService, JobService } from '../../../core/services';
import { Application, Job, ApplicationStatus } from '../../../core/models';
import { CopPipe } from '../../../shared/pipes';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { IconComponent } from '../../../shared/components/icon/icon';

/** Postulacion enriquecida con los datos de su oferta. */
interface ApplicationRow {
  application: Application;
  job?: Job;
}

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  pendiente: 'Pendiente',
  en_revision: 'En revision',
  aceptada: 'Aceptada',
  rechazada: 'Rechazada',
};

const STATUS_CLASS: Record<ApplicationStatus, string> = {
  pendiente: 'pildora_aviso',
  en_revision: 'pildora_info',
  aceptada: 'pildora_exito',
  rechazada: 'pildora_error',
};

@Component({
  selector: 'jobsy-my-applications',
  standalone: true,
  imports: [IconComponent, RouterLink, CopPipe, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './mis-postulaciones.html',
  styleUrl: './mis-postulaciones.scss',
})
export class MyApplicationsPage implements OnInit {
  private applicationService = inject(ApplicationService);
  private jobService = inject(JobService);

  readonly rows = signal<ApplicationRow[]>([]);
  readonly loading = signal(true);
  readonly filtro = signal<ApplicationStatus | 'todas'>('todas');

  readonly filtros: { value: ApplicationStatus | 'todas'; label: string }[] = [
    { value: 'todas', label: 'Todas' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'en_revision', label: 'En revision' },
    { value: 'aceptada', label: 'Aceptadas' },
    { value: 'rechazada', label: 'Rechazadas' },
  ];

  readonly visibles = computed(() => {
    const f = this.filtro();
    return f === 'todas' ? this.rows() : this.rows().filter((r) => r.application.estado === f);
  });

  ngOnInit(): void {
    this.applicationService.myApplications().subscribe((apps) => {
      // Cruzamos cada postulacion con su oferta para mostrar titulo y precio.
      this.rows.set(apps.map((application) => ({ application })));
      this.loading.set(false);

      apps.forEach((app, i) => {
        this.jobService.getById(app.jobId).subscribe((job) => {
          this.rows.update((rows) => rows.map((r, idx) => (idx === i ? { ...r, job } : r)));
        });
      });
    });
  }

  label(estado: ApplicationStatus): string {
    return STATUS_LABEL[estado];
  }

  badgeClass(estado: ApplicationStatus): string {
    return STATUS_CLASS[estado];
  }

  cancelar(id: string): void {
    this.applicationService.cancel(id).subscribe(() => {
      this.rows.update((rows) => rows.filter((r) => r.application.id !== id));
    });
  }
}
