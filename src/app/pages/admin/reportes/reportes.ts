import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../core/services';
import { ReportStatus } from '../../../core/models';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { IconComponent } from '../../../shared/components/icon/icon';

const ETIQUETA: Record<ReportStatus, string> = {
  abierto: 'Abierto',
  en_proceso: 'En proceso',
  resuelto: 'Resuelto',
  cerrado: 'Cerrado',
};

@Component({
  selector: 'jobsy-admin-reports',
  standalone: true,
  imports: [IconComponent, FormsModule, ModalComponent, EmptyStateComponent],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss',
})
export class AdminReportsPage {
  private reportService = inject(ReportService);

  readonly reports = this.reportService.reports;
  readonly abiertos = this.reportService.reportesAbiertos;
  readonly enProceso = this.reportService.reportesEnProceso;
  readonly resueltos = this.reportService.reportesResueltos;

  readonly filtro = signal<ReportStatus | 'todos'>('todos');
  readonly aviso = signal('');

  /** Reporte abierto en el panel de detalle (por id, para que el hilo se refresque). */
  readonly seleccionadoId = signal<string | null>(null);
  readonly seleccionado = computed(
    () => this.reports().find((r) => r.id === this.seleccionadoId()) ?? null,
  );
  readonly respuesta = signal('');

  readonly estados: ReportStatus[] = ['abierto', 'en_proceso', 'resuelto', 'cerrado'];

  readonly filtros: { value: ReportStatus | 'todos'; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'abierto', label: 'Abiertos' },
    { value: 'en_proceso', label: 'En proceso' },
    { value: 'resuelto', label: 'Resueltos' },
    { value: 'cerrado', label: 'Cerrados' },
  ];

  readonly visibles = computed(() => {
    const f = this.filtro();
    const lista = f === 'todos' ? this.reports() : this.reports().filter((r) => r.estado === f);

    // Los abiertos primero: son los que hay que atender.
    const orden: Record<ReportStatus, number> = {
      abierto: 0, en_proceso: 1, resuelto: 2, cerrado: 3,
    };
    return [...lista].sort((a, b) => orden[a.estado] - orden[b.estado]);
  });

  abrir(id: string): void {
    this.seleccionadoId.set(id);
    this.respuesta.set('');
  }

  cerrarDetalle(): void {
    this.seleccionadoId.set(null);
  }

  cambiarEstado(id: string, estado: ReportStatus): void {
    this.reportService.setStatus(id, estado);
  }

  /** Envia la respuesta del agente al hilo del usuario. */
  responder(): void {
    const r = this.seleccionado();
    if (!r || !this.respuesta().trim()) return;

    this.reportService.addSupportMessage(r.id, this.respuesta());
    this.respuesta.set('');
    this.avisar('Respuesta enviada al usuario.');
  }

  /** Marca como resuelto y cierra el detalle. */
  resolver(): void {
    const r = this.seleccionado();
    if (!r) return;

    this.reportService.setStatus(r.id, 'resuelto');
    this.avisar(`"${r.asunto}" resuelto.`);
    this.seleccionadoId.set(null);
  }

  eliminar(id: string, asunto: string): void {
    this.reportService.deleteReport(id);
    this.avisar('Reporte eliminado.');
    if (this.seleccionadoId() === id) this.seleccionadoId.set(null);
  }

  etiqueta(estado: ReportStatus): string {
    return ETIQUETA[estado];
  }

  badgeClass(estado: ReportStatus): string {
    if (estado === 'resuelto') return 'pildora_exito';
    if (estado === 'en_proceso') return 'pildora_info';
    if (estado === 'cerrado') return 'pildora_aviso';
    return 'pildora_error';
  }

  iconoTipo(tipo: string): string {
    const t = tipo.toLowerCase();
    if (t.includes('pago')) return 'credit-card';
    if (t.includes('usuario')) return 'flag';
    if (t.includes('sugerencia')) return 'lightbulb';
    return 'bug';
  }

  /** "2026-03-04T10:02:00" -> "4 mar, 10:02"; "2026-03-04" -> "4 mar". */
  cuando(fecha: string): string {
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return fecha;
    const opts: Intl.DateTimeFormatOptions = fecha.includes('T')
      ? { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }
      : { day: 'numeric', month: 'short' };
    return d.toLocaleString('es-CO', opts);
  }

  private avisar(texto: string): void {
    this.aviso.set(texto);
    setTimeout(() => this.aviso.set(''), 2800);
  }
}
