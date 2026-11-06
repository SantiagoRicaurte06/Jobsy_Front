import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AdminService } from './admin.service';
import { environment } from '../../../environments/environment';
import { Report, ReportMessage, ReportStatus } from '../models';

/**
 * Soporte_API — centro de reportes.
 *
 * Antes guardaba los reportes en localStorage y la respuesta de soporte la
 * inventaba un temporizador: el equipo nunca veia nada y el usuario leia una
 * contestacion que no habia escrito nadie. Ahora el hilo viaja al servidor y
 * lo que se lee es lo que un agente respondio de verdad.
 */
@Injectable({ providedIn: 'root' })
export class ReportService {
  private api = inject(ApiService);
  private admin = inject(AdminService);
  private path = environment.endpoints.soporte;

  private readonly _reports = signal<Report[]>([]);
  private readonly _cargando = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly reports = this._reports.asReadonly();
  readonly cargando = this._cargando.asReadonly();
  readonly error = this._error.asReadonly();

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

  /**
   * Carga la bandeja de reportes.
   *
   * La lista trae el resumen de cada hilo (ultimo mensaje y total), asi que
   * basta una peticion; cada conversacion se pide al abrirla (cargarHilo).
   * `comoAdmin` trae los de todos los usuarios; el servidor exige rol admin.
   * `silencioso` es para los refrescos periodicos: no muestra el spinner ni
   * borra lo que ya hay si la red falla un momento.
   */
  cargar(comoAdmin = false, silencioso = false): void {
    if (environment.useMocks) return;
    if (!silencioso) this._cargando.set(true);

    const peticion = comoAdmin
      ? this.admin.reports()
      : this.api.get<Report[]>(`${this.path}/reportes`);

    peticion.subscribe({
      next: (reports) => {
        // Los hilos ya abiertos se conservan: la lista no los trae.
        const previos = new Map(this._reports().map((r) => [r.id, r.mensajes]));
        this._reports.set((reports ?? []).map((r) => ({ ...r, mensajes: previos.get(r.id) })));
        this._cargando.set(false);
        this._error.set(null);
      },
      error: (e: HttpErrorResponse) => {
        this._cargando.set(false);
        if (!silencioso) this._error.set(mensajeDe(e, 'No pudimos cargar tus reportes.'));
      },
    });
  }

  /** Lee (o relee) la conversacion de un reporte y la deja en la lista. */
  cargarHilo(id: string, comoAdmin = false): void {
    if (environment.useMocks) return;
    const peticion = comoAdmin
      ? this.admin.reportMessages(id)
      : this.api.get<ReportMessage[]>(`${this.path}/reportes/${id}/mensajes`);
    peticion.pipe(catchError(() => of(null))).subscribe((mensajes) => {
      if (!mensajes) return;
      this._reports.update((list) =>
        list.map((r) =>
          r.id === id
            ? {
                ...r,
                mensajes,
                totalMensajes: mensajes.length,
                ultimoMensaje: mensajes.at(-1) ?? r.ultimoMensaje,
                actividad: mensajes.at(-1)?.fecha ?? r.actividad,
              }
            : r,
        ),
      );
    });
  }

  /** Abre un reporte. El primer mensaje del hilo es la descripcion. */
  create(data: { tipo: string; asunto: string; descripcion: string }): Observable<Report> {
    return this.api.post<Report>(`${this.path}/reportes`, data);
  }

  /** Agrega un reporte recien creado a la lista, sin releerla entera. */
  anexarReporte(reporte: Report): void {
    this._reports.update((list) => [reporte, ...list]);
  }

  /** Mensaje del usuario en su propio reporte. */
  sendMessage(reportId: string, texto: string): Observable<ReportMessage> {
    return this.api.post<ReportMessage>(`${this.path}/reportes/${reportId}/mensajes`, { texto });
  }

  /** Agrega el mensaje al hilo ya cargado, sin releerlo entero. */
  anexarMensaje(reportId: string, mensaje: ReportMessage): void {
    this._reports.update((list) =>
      list.map((r) => {
        if (r.id !== reportId) return r;
        const mensajes = [...(r.mensajes ?? []), mensaje];
        return { ...r, mensajes, totalMensajes: mensajes.length, ultimoMensaje: mensaje, actividad: mensaje.fecha };
      }),
    );
  }

  // ============================================================
  //  Panel admin
  // ============================================================

  /** Respuesta de un agente. El servidor deja el reporte como respondido. */
  addSupportMessage(reportId: string, texto: string): Observable<ReportMessage> {
    return this.admin.replyToReport(reportId, texto);
  }

  setStatus(reportId: string, estado: ReportStatus): Observable<Report> {
    return this.admin.setReportStatus(reportId, estado);
  }

  /** Aplica el estado en la lista ya cargada. */
  fijarEstadoLocal(reportId: string, estado: ReportStatus): void {
    this._reports.update((list) => list.map((r) => (r.id === reportId ? { ...r, estado } : r)));
  }

  deleteReport(reportId: string): Observable<void> {
    return this.admin.removeReport(reportId);
  }

  quitarLocal(reportId: string): void {
    this._reports.update((list) => list.filter((r) => r.id !== reportId));
  }

  fijarError(texto: string | null): void {
    this._error.set(texto);
  }
}

function mensajeDe(e: HttpErrorResponse, porDefecto: string): string {
  return e.error?.error?.mensaje ?? porDefecto;
}
