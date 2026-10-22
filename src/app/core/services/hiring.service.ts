import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { WorkModality } from '../models';

/** Franja de una agenda recurrente. */
export interface ScheduleSlot {
  dia: string;
  horaInicio: string;
  horaFin: string;
  nota?: string;
}

/** Servicio contratado (empleo.contrataciones). */
export interface Hiring {
  id: string;
  ofertaId: string;
  postulacionId: string;
  empleadorId: string;
  empleadoId: string;
  estado: string;
  direccion: string;
  fechaInicio: string;
  horaInicio: string;
  duracionHoras: number;
  tarifa: number;
  totalEstimado: number;
  descripcion?: string;
  nota?: string;
  fecha: string;
  /** De que lado esta quien consulta, para decidir que acciones ofrecer. */
  soyEmpleador: boolean;
  agenda?: ScheduleSlot[];
  /** Titulo de la oferta y nombre de la otra parte. */
  titulo?: string;
  contraparteId?: string;
  contraparte?: string;
}

/** Contratacion directa: se elige a alguien del buscador, sin oferta previa. */
export interface DirectHireRequest {
  empleadoId: string;
  titulo?: string;
  direccion: string;
  ciudad?: string;
  fechaInicio: string;
  horaInicio: string;
  duracionHoras: number;
  tarifa: number;
  modalidad?: WorkModality;
  descripcion?: string;
  nota?: string;
  dias?: string[];
  horaFin?: string;
}

/** Empleo_API — servicios contratados y su agenda. */
@Injectable({ providedIn: 'root' })
export class HiringService {
  private api = inject(ApiService);
  private path = `${environment.endpoints.empleo}/contrataciones`;

  mine(): Observable<Hiring[]> {
    return this.api.get<Hiring[]>(`${this.path}/mias`);
  }

  getById(id: string): Observable<Hiring> {
    return this.api.get<Hiring>(`${this.path}/${id}`);
  }

  /** Contrata a partir de una postulacion que el empleador ya acepto. */
  fromApplication(data: {
    postulacionId: string;
    direccion: string;
    fechaInicio: string;
    horaInicio: string;
    duracionHoras: number;
    tarifa: number;
    descripcion?: string;
    nota?: string;
    dias?: string[];
    horaFin?: string;
  }): Observable<Hiring> {
    return this.api.post<Hiring>(this.path, data);
  }

  /** Contrata directamente a alguien del buscador de empleados. */
  direct(data: DirectHireRequest): Observable<Hiring> {
    return this.api.post<Hiring>(`${this.path}/directa`, data);
  }

  /** Solo el empleador puede dar por terminado el servicio. */
  finish(id: string): Observable<Hiring> {
    return this.api.post<Hiring>(`${this.path}/${id}/finalizar`, {});
  }
}
