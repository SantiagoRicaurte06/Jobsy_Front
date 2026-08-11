import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { Report } from '../models';
import { mockResponse } from '../../mocks';

// TEMPORAL: reemplazar por Soporte_API
const MOCK_REPORTS: Report[] = [
  { id: 'r1', tipo: 'Incidencia', asunto: 'Problema con un pago', descripcion: 'El pago no se reflejo.', estado: 'abierto', reportanteId: 'u2', fecha: '2026-03-04' },
  { id: 'r2', tipo: 'Sugerencia', asunto: 'Filtro por barrio', descripcion: 'Seria util filtrar por barrio.', estado: 'en_proceso', reportanteId: 'u3', fecha: '2026-03-02' },
];

/** Soporte_API — centro de reportes. */
@Injectable({ providedIn: 'root' })
export class ReportService {
  private api = inject(ApiService);
  private path = environment.endpoints.soporte;

  list(): Observable<Report[]> {
    if (environment.useMocks) return mockResponse(MOCK_REPORTS);
    return this.api.get<Report[]>(`${this.path}/reportes`);
  }

  create(data: Partial<Report>): Observable<Report> {
    if (environment.useMocks) {
      return mockResponse<Report>({
        id: `r${Date.now()}`, tipo: data.tipo ?? 'Incidencia', asunto: data.asunto ?? '',
        descripcion: data.descripcion ?? '', estado: 'abierto', reportanteId: 'u2',
        fecha: new Date().toISOString(),
      });
    }
    return this.api.post<Report>(`${this.path}/reportes`, data);
  }
}
