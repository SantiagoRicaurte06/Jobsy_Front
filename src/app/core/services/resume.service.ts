import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { Resume } from '../models';
import { mockResponse } from '../../mocks';

// TEMPORAL: hoja de vida de ejemplo
const MOCK_RESUME: Resume = {
  id: 'r1', userId: 'u2',
  resumenProfesional: 'Empleada de hogar con 6 anos de experiencia en limpieza profunda y cuidado del hogar.',
  experiencias: [
    { cargo: 'Empleada de hogar', empresa: 'Familia Rodriguez', desde: '2020-01', hasta: '2026-01', descripcion: 'Limpieza integral y cocina.' },
  ],
  educacion: [{ titulo: 'Bachiller', institucion: 'IE Yopal', ano: '2018' }],
  habilidades: ['Limpieza profunda', 'Cocina', 'Planchado'],
  certificaciones: ['Bioseguridad SENA'],
};

/** Usuarios_Api — hoja de vida. */
@Injectable({ providedIn: 'root' })
export class ResumeService {
  private api = inject(ApiService);
  private path = environment.endpoints.usuarios;

  get(): Observable<Resume> {
    if (environment.useMocks) return mockResponse(MOCK_RESUME);
    return this.api.get<Resume>(`${this.path}/hoja-de-vida`);
  }

  update(data: Partial<Resume>): Observable<Resume> {
    if (environment.useMocks) return mockResponse({ ...MOCK_RESUME, ...data });
    return this.api.put<Resume>(`${this.path}/hoja-de-vida`, data);
  }

  uploadFile(file: File): Observable<{ url: string }> {
    if (environment.useMocks) return mockResponse({ url: URL.createObjectURL(file) }, 800);
    const form = new FormData();
    form.append('cv', file);
    return this.api.post<{ url: string }>(`${this.path}/hoja-de-vida/archivo`, form);
  }
}
