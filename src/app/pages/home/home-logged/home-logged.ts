import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, JobService, ApplicationService } from '../../../core/services';
import { Job, Application } from '../../../core/models';
import { JobCardComponent } from '../../../shared/components/job-card/job-card';

@Component({
  selector: 'jobsy-home-logged',
  standalone: true,
  imports: [RouterLink, JobCardComponent],
  templateUrl: './home-logged.html',
  styleUrl: './home-logged.scss',
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
    { icon: '\u{1F50D}', label: 'Buscar empleo', path: '/empleos' },
    { icon: '\u{1F4C4}', label: 'Mi hoja de vida', path: '/app/hoja-de-vida' },
    { icon: '\u{1F464}', label: 'Mi perfil', path: '/app/perfil' },
    { icon: '\u{1F6D2}', label: 'Tienda', path: '/tienda' },
  ];

  ngOnInit(): void {
    this.jobService.featured(3).subscribe((j) => this.jobs.set(j));
    this.applicationService.myApplications().subscribe((a) => this.applications.set(a));
  }
}
