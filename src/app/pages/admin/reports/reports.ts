import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminStore } from '../../../core/services';
import { Report, ReportStatus } from '../../../core/models';
import { ModalComponent } from '../../../shared/components/modal/modal';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';

const ETIQUETA: Record<ReportStatus, string> = {
  abierto: 'Abierto',
  en_proceso: 'En proceso',
  resuelto: 'Resuelto',
  cerrado: 'Cerrado',
};

@Component({
  selector: 'jobsy-admin-reports',
  standalone: true,
  imports: [FormsModule, ModalComponent, EmptyStateComponent],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class AdminReportsPage {
  private store = inject(AdminStore);

  readonly reports = this.store.reports;
  readonly abiertos = this.store.reportesAbiertos;
  readonly enProceso = this.store.reportesEnProceso;
  readonly resueltos = this.store.reportesResueltos;

  readonly filtro = signal<ReportStatus | 'todos'>('todos');
  readonly aviso = signal('');

  /** Reporte abierto en el panel de detalle. */
  readonly seleccionado = signal<Report | null>(null);
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

  abrir(r: Report): void {
    this.seleccionado.set(r);
    this.respuesta.set('');
  }

  cerrarDetalle(): void {
    this.seleccionado.set(null);
  }

  cambiarEstado(r: Report, estado: ReportStatus): void {
    this.store.setReportStatus(r.id, estado);
    this.avisar(`"${r.asunto}" marcado como ${ETIQUETA[estado].toLowerCase()}.`);

    // Si el detalle esta abierto, refrescamos su copia.
    if (this.seleccionado()?.id === r.id) {
      this.seleccionado.set({ ...r, estado });
    }
  }

  /** Marca como resuelto y cierra el detalle. */
  resolver(): void {
    const r = this.seleccionado();
    if (!r) return;

    this.store.setReportStatus(r.id, 'resuelto');
    this.avisar(`"${r.asunto}" resuelto.`);
    this.seleccionado.set(null);
  }

  eliminar(r: Report): void {
    this.store.deleteReport(r.id);
    this.avisar('Reporte eliminado.');
    if (this.seleccionado()?.id === r.id) this.seleccionado.set(null);
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
    if (t.includes('pago')) return '\u{1F4B3}';
    if (t.includes('usuario')) return '\u{1F6A9}';
    if (t.includes('sugerencia')) return '\u{1F4A1}';
    return '\u{1F41B}';
  }

  private avisar(texto: string): void {
    this.aviso.set(texto);
    setTimeout(() => this.aviso.set(''), 2800);
  }
}
