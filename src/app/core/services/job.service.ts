import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { Job, JobFilters, Paginated } from '../models';
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
}
