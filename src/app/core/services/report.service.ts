import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
   * Carga los reportes con su conversacion.
   *
   * `comoAdmin` trae los de todos los usuarios, no solo los propios; el
   * servidor exige rol de administrador para eso.
   */
  cargar(comoAdmin = false): void {
    if (environment.useMocks) return;
    this._cargando.set(true);

    const peticion = comoAdmin
      ? this.admin.reports()
      : this.api.get<Report[]>(`${this.path}/reportes`);

    peticion.subscribe({
      next: (reports) => {
        const lista = reports ?? [];
        if (lista.length === 0) {
          this._reports.set([]);
          this._cargando.set(false);
          this._error.set(null);
          return;
        }
        // Los mensajes van aparte, uno por reporte. Un hilo que falle no debe
        // dejar la pantalla en blanco: ese reporte se queda sin conversacion.
        forkJoin(
          lista.map((r) =>
            this.mensajes(r.id, comoAdmin).pipe(
              map((mensajes) => ({ ...r, mensajes })),
              catchError(() => of(r)),
            ),
          ),
        ).subscribe({
          next: (conHilos) => {
            this._reports.set(conHilos);
            this._cargando.set(false);
            this._error.set(null);
          },
          error: (e: HttpErrorResponse) => {
            this._reports.set(lista);
            this._cargando.set(false);
            this._error.set(mensajeDe(e, 'No pudimos cargar las conversaciones.'));
          },
        });
      },
      error: (e: HttpErrorResponse) => {
        this._cargando.set(false);
        this._error.set(mensajeDe(e, 'No pudimos cargar tus reportes.'));
      },
    });
  }

  private mensajes(id: string, comoAdmin: boolean): Observable<ReportMessage[]> {
    return comoAdmin
      ? this.admin.reportMessages(id)
      : this.api.get<ReportMessage[]>(`${this.path}/reportes/${id}/mensajes`);
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
      list.map((r) =>
        r.id === reportId ? { ...r, mensajes: [...(r.mensajes ?? []), mensaje] } : r,
      ),
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
