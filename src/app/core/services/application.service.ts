import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { Application } from '../models';
import { mockResponse } from '../../mocks';

// TEMPORAL: sin mock de datos aun; el backend real llenara esto.
const MOCK_APPLICATIONS: Application[] = [
  { id: 'a1', jobId: 'j1', empleadoId: 'u2', estado: 'pendiente', fechaPostulacion: '2026-03-05' },
  { id: 'a2', jobId: 'j3', empleadoId: 'u2', estado: 'aceptada', fechaPostulacion: '2026-03-02' },
];

/** Empleo_API — postulaciones del usuario. */
@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private api = inject(ApiService);
  private path = environment.endpoints.empleo;

  myApplications(): Observable<Application[]> {
    if (environment.useMocks) return mockResponse(MOCK_APPLICATIONS);
    return this.api.get<Application[]>(`${this.path}/postulaciones/mias`);
  }

  apply(jobId: string, mensaje?: string): Observable<Application> {
    if (environment.useMocks) {
      return mockResponse<Application>({
        id: `a${Date.now()}`, jobId, empleadoId: 'u2',
        estado: 'pendiente', fechaPostulacion: new Date().toISOString(), mensaje,
      });
    }
    return this.api.post<Application>(`${this.path}/postulaciones`, { jobId, mensaje });
  }

  cancel(id: string): Observable<void> {
    if (environment.useMocks) return mockResponse(undefined as void);
    return this.api.delete<void>(`${this.path}/postulaciones/${id}`);
  }
}
