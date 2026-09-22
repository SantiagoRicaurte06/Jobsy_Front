import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { Report, ReportMessage, ReportStatus } from '../models';

const STORAGE_KEY = 'jobsy_reports';

/** Reportes de ejemplo con su conversacion inicial. TEMPORAL: los servira Soporte_API. */
const SEED_REPORTS: Report[] = [
  {
    id: 'r1', tipo: 'Incidencia', asunto: 'Problema con un pago',
    descripcion: 'El pago de un servicio no se reflejo en mi cuenta.',
    estado: 'en_proceso', reportanteId: 'u2', fecha: '2026-03-04',
    mensajes: [
      { autor: 'usuario', texto: 'El pago de un servicio no se reflejo en mi cuenta.', fecha: '2026-03-04T09:12:00' },
      { autor: 'soporte', texto: 'Hola, gracias por avisar. Ya estamos revisando la transaccion con el area de pagos. Te confirmamos en breve.', fecha: '2026-03-04T10:02:00' },
    ],
  },
  {
    id: 'r2', tipo: 'Sugerencia', asunto: 'Filtro por barrio',
    descripcion: 'Seria util poder filtrar las ofertas por barrio.',
    estado: 'abierto', reportanteId: 'u2', fecha: '2026-03-02',
    mensajes: [
      { autor: 'usuario', texto: 'Seria util poder filtrar las ofertas por barrio.', fecha: '2026-03-02T16:40:00' },
    ],
  },
];

/** Respuestas simuladas de soporte segun el tipo de reporte. TEMPORAL. */
const RESPUESTAS_SOPORTE: Record<string, string> = {
  Pago: 'Recibido. Estamos verificando el movimiento con el area de pagos; puede tardar hasta 24 horas.',
  Usuario: 'Gracias por el reporte. Nuestro equipo de confianza y seguridad revisara el caso.',
  Incidencia: 'Anotado. El equipo tecnico ya esta revisando el problema que describes.',
  Sugerencia: 'Gracias por la idea. La pasamos al equipo de producto para evaluarla.',
};

const RESPUESTA_GENERICA =
  'Gracias por tu mensaje. Un agente lo revisara y te respondera lo antes posible.';

/**
 * Soporte_API — centro de reportes.
 *
 * Mantiene los reportes y su conversacion en memoria y los guarda en
 * localStorage, de modo que el chat siga ahi al recargar.
 *
 * TEMPORAL: la respuesta de soporte es simulada. Con el backend real, los
 * mensajes viajaran por Soporte_API (idealmente por WebSocket para tiempo real).
 */
@Injectable({ providedIn: 'root' })
export class ReportService {
  private api = inject(ApiService);
  private path = environment.endpoints.soporte;

  private readonly _reports = signal<Report[]>(this.restore());
  readonly reports = this._reports.asReadonly();

  // ---- Conteos derivados (los usa el panel admin) ----
  readonly reportesAbiertos = computed(
    () => this._reports().filter((r) => r.estado === 'abierto').length,
  );
  readonly reportesEnProceso = computed(
    () => this._reports().filter((r) => r.estado === 'en_proceso').length,
  );
  readonly reportesResueltos = computed(
    () => this._reports().filter((r) => r.estado === 'resuelto').length,
  );

  /** Crea un reporte nuevo con su primer mensaje y agenda el saludo de soporte. */
  create(data: { tipo: string; asunto: string; descripcion: string }): Report {
    const ahora = new Date().toISOString();
    const reporte: Report = {
      id: `r${Date.now()}`,
      tipo: data.tipo,
      asunto: data.asunto,
      descripcion: data.descripcion,
      estado: 'abierto',
      reportanteId: 'u2',
      fecha: ahora,
      mensajes: [{ autor: 'usuario', texto: data.descripcion, fecha: ahora }],
    };

    this._reports.update((list) => [reporte, ...list]);
    this.persist();
    this.responderSimulado(reporte.id);
    return reporte;
  }

  /** Agrega un mensaje del usuario al hilo y agenda la respuesta de soporte. */
  sendMessage(reportId: string, texto: string): void {
    const limpio = texto.trim();
    if (!limpio) return;

    const reporte = this._reports().find((r) => r.id === reportId);
    if (!reporte || reporte.estado === 'resuelto' || reporte.estado === 'cerrado') return;

    this.append(reportId, { autor: 'usuario', texto: limpio, fecha: new Date().toISOString() });
    this.responderSimulado(reportId);
  }

  // ============================================================
  //  Panel admin
  // ============================================================

  /** Respuesta real de un agente: agrega un mensaje de soporte al hilo. */
  addSupportMessage(reportId: string, texto: string): void {
    const limpio = texto.trim();
    if (!limpio) return;

    const reporte = this._reports().find((r) => r.id === reportId);
    if (!reporte) return;

    this.append(reportId, { autor: 'soporte', texto: limpio, fecha: new Date().toISOString() }, 'en_proceso');
  }

  /** Cambia el estado de un reporte (abierto, en proceso, resuelto, cerrado). */
  setStatus(reportId: string, estado: ReportStatus): void {
    this._reports.update((list) => list.map((r) => (r.id === reportId ? { ...r, estado } : r)));
    this.persist();
  }

  deleteReport(reportId: string): void {
    this._reports.update((list) => list.filter((r) => r.id !== reportId));
    this.persist();
  }

  // ============================================================
  //  Internos
  // ============================================================

  /** TEMPORAL: soporte responde solo tras un breve retraso. */
  private responderSimulado(reportId: string): void {
    setTimeout(() => {
      const reporte = this._reports().find((r) => r.id === reportId);
      if (!reporte || reporte.estado === 'resuelto' || reporte.estado === 'cerrado') return;

      const texto = RESPUESTAS_SOPORTE[reporte.tipo] ?? RESPUESTA_GENERICA;
      this.append(reportId, { autor: 'soporte', texto, fecha: new Date().toISOString() }, 'en_proceso');
    }, 1400);
  }

  /** Agrega un mensaje al reporte y, opcionalmente, cambia su estado. */
  private append(reportId: string, mensaje: ReportMessage, nuevoEstado?: Report['estado']): void {
    this._reports.update((list) =>
      list.map((r) =>
        r.id === reportId
          ? {
              ...r,
              mensajes: [...(r.mensajes ?? []), mensaje],
              estado: nuevoEstado && r.estado === 'abierto' ? nuevoEstado : r.estado,
            }
          : r,
      ),
    );
    this.persist();
  }

  private get almacen(): Storage | null {
    return typeof localStorage === 'undefined' ? null : localStorage;
  }

  private persist(): void {
    this.almacen?.setItem(STORAGE_KEY, JSON.stringify(this._reports()));
  }

  private restore(): Report[] {
    try {
      const guardado = this.almacen?.getItem(STORAGE_KEY);
      if (guardado) return JSON.parse(guardado) as Report[];
    } catch {
      // Si el JSON esta corrupto, arrancamos con los datos de ejemplo.
    }
    return structuredClone(SEED_REPORTS);
  }

  // ---- API real (cuando useMocks sea false) ----
  listFromApi(): Observable<Report[]> {
    return this.api.get<Report[]>(`${this.path}/reportes`);
  }
}
