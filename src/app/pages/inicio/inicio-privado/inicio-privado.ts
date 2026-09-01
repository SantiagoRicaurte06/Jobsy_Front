import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, JobService, ApplicationService } from '../../../core/services';
import { Job, Application } from '../../../core/models';
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

  readonly user = this.auth.user;
  readonly jobs = signal<Job[]>([]);
  readonly applications = signal<Application[]>([]);

  /** Accesos rapidos del panel. */
  readonly shortcuts = [
    { icon: 'search', label: 'Buscar empleo', path: '/empleos' },
    { icon: 'file-text', label: 'Mi hoja de vida', path: '/app/hoja-de-vida' },
    { icon: 'user', label: 'Mi perfil', path: '/app/perfil' },
    { icon: 'shopping-cart', label: 'Tienda', path: '/tienda' },
  ];

  ngOnInit(): void {
    this.jobService.featured(3).subscribe((j) => this.jobs.set(j));
    this.applicationService.myApplications().subscribe((a) => this.applications.set(a));
  }
}
