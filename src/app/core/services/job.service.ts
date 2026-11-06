import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { Job, JobFilters, OfferStatus, OwnJob, Paginated, ReceivedApplication } from '../models';
import { MOCK_JOBS, mockResponse, paginate } from '../../mocks';

/** Empleo_API — ofertas de trabajo. */
@Injectable({ providedIn: 'root' })
export class JobService {
  private api = inject(ApiService);
  private path = environment.endpoints.empleo;

  list(filters: JobFilters = {}, page = 1, pageSize = 6): Observable<Paginated<Job>> {
    if (environment.useMocks) {
      let items = [...MOCK_JOBS];
      if (filters.tamano?.length) items = items.filter((j) => filters.tamano!.includes(j.tamano));
      if (filters.modalidad?.length) items = items.filter((j) => filters.modalidad!.includes(j.modalidad));
      if (filters.precioMin != null) items = items.filter((j) => j.precioHora >= filters.precioMin!);
      if (filters.precioMax != null) items = items.filter((j) => j.precioHora <= filters.precioMax!);
      if (filters.busqueda) {
        const q = filters.busqueda.toLowerCase();
        items = items.filter((j) => j.titulo.toLowerCase().includes(q) || j.direccion.toLowerCase().includes(q));
      }
      return mockResponse(paginate(items, page, pageSize));
    }
    return this.api.get<Paginated<Job>>(`${this.path}/ofertas`, { ...filters, page, pageSize } as never);
  }

  getById(id: string): Observable<Job | undefined> {
    if (environment.useMocks) return mockResponse(MOCK_JOBS.find((j) => j.id === id));
    return this.api.get<Job>(`${this.path}/ofertas/${id}`);
  }

  featured(limit = 6): Observable<Job[]> {
    if (environment.useMocks) return mockResponse(MOCK_JOBS.slice(0, limit));
    return this.api.get<Job[]>(`${this.path}/ofertas/destacadas`, { limit });
  }

  create(job: Partial<Job>): Observable<Job> {
    if (environment.useMocks) return mockResponse({ ...MOCK_JOBS[0], ...job } as Job);
    return this.api.post<Job>(`${this.path}/ofertas`, job);
  }

  // ---- Lado del empleador ----

  /** Ofertas del empleador con su estado, fotos y postulaciones. */
  mine(): Observable<OwnJob[]> {
    if (environment.useMocks) {
      return mockResponse(MOCK_JOBS.slice(0, 2).map((j) => ({ ...j, estado: 'activa' as const, postulaciones: 0, pendientes: 0, fotos: [] })));
    }
    return this.api.get<OwnJob[]>(`${this.path}/ofertas/mias`);
  }

  /** Quienes se postularon a una oferta propia. */
  received(jobId: string): Observable<ReceivedApplication[]> {
    if (environment.useMocks) return mockResponse([]);
    return this.api.get<ReceivedApplication[]>(`${this.path}/ofertas/${jobId}/postulaciones`);
  }

  /** Activa, pausa o cierra una oferta propia. Solo las activas salen en el buscador. */
  setStatus(jobId: string, estado: OfferStatus): Observable<OwnJob> {
    return this.api.put<OwnJob>(`${this.path}/ofertas/${jobId}/estado`, { estado });
  }

  /** Sube una foto de la casa; la primera queda como imagen principal. */
  uploadPhoto(jobId: string, file: File): Observable<OwnJob> {
    const form = new FormData();
    form.append('foto', file);
    return this.api.post<OwnJob>(`${this.path}/ofertas/${jobId}/fotos`, form);
  }
}
