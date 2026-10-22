import { Component, DestroyRef, ElementRef, inject, signal, computed, effect, viewChild, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../core/services';
import { Report, ReportMessage, ReportStatus } from '../../../core/models';
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
  imports: [IconComponent, FormsModule, ModalComponent, EmptyStateComponent, DatePipe],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss',
})
export class AdminReportsPage implements OnInit {
  private reportService = inject(ReportService);
  private destroyRef = inject(DestroyRef);
  private hiloAdmin = viewChild<ElementRef<HTMLElement>>('hiloAdmin');

  constructor() {
    // Al abrir un hilo o llegar mensajes se baja al ultimo.
    effect(() => {
      this.seleccionado()?.mensajes?.length;
      const el = this.hiloAdmin()?.nativeElement;
      if (el) setTimeout(() => (el.scrollTop = el.scrollHeight));
    });
  }

  readonly reports = this.reportService.reports;
  readonly cargando = this.reportService.cargando;

  ngOnInit(): void {
    // Como administrador: los reportes de todos, no solo los propios.
    this.reportService.cargar(true);

    // Los mensajes nuevos de los usuarios llegan solos: el hilo abierto cada
    // 5 s y la lista cada 15 s, mientras la pestana este a la vista.
    let vuelta = 0;
    const refrescar = (todo: boolean) => {
      if (document.hidden) return;
      const id = this.seleccionadoId();
      if (id) this.reportService.cargarHilo(id, true);
      if (todo) this.reportService.cargar(true, true);
    };
    const temporizador = setInterval(() => refrescar(++vuelta % 3 === 0), 5000);
    const alVolver = () => refrescar(true);
    document.addEventListener('visibilitychange', alVolver);
    this.destroyRef.onDestroy(() => {
      clearInterval(temporizador);
      document.removeEventListener('visibilitychange', alVolver);
    });
  }

  /** El ultimo mensaje es del usuario (o aun nadie le ha contestado). */
  esperando(r: Report): boolean {
    if (r.estado === 'resuelto' || r.estado === 'cerrado') return false;
    return !r.ultimoMensaje || r.ultimoMensaje.autor === 'usuario';
  }

  /** El hilo con la descripcion como primer mensaje, que es como lo vio el usuario. */
  hilo(r: Report): ReportMessage[] {
    return [{ autor: 'usuario', texto: r.descripcion || r.asunto, fecha: r.fecha }, ...(r.mensajes ?? [])];
  }

  quien(r: Report): string {
    return r.reportante || `Usuario #${r.reportanteId}`;
  }

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

    // Primero los que esperan respuesta, luego por estado y por actividad.
    const orden: Record<ReportStatus, number> = {
      abierto: 0, en_proceso: 1, resuelto: 2, cerrado: 3,
    };
    return [...lista].sort(
      (a, b) =>
        Number(this.esperando(b)) - Number(this.esperando(a)) ||
        orden[a.estado] - orden[b.estado] ||
        (b.actividad ?? b.fecha).localeCompare(a.actividad ?? a.fecha),
    );
  });

  abrir(id: string): void {
    this.seleccionadoId.set(id);
    this.respuesta.set('');
    this.reportService.cargarHilo(id, true);
  }

  /** Ctrl+Enter envia la respuesta. */
  alTeclear(e: KeyboardEvent): void {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.responder();
    }
  }

  cerrarDetalle(): void {
    this.seleccionadoId.set(null);
  }

  cambiarEstado(id: string, estado: ReportStatus): void {
    const antes = this.reports().find((r) => r.id === id)?.estado;
    this.reportService.fijarEstadoLocal(id, estado);
    this.reportService.setStatus(id, estado).subscribe({
      error: (e: HttpErrorResponse) => {
        if (antes) this.reportService.fijarEstadoLocal(id, antes);
        this.avisar(e.error?.error?.mensaje ?? 'No pudimos cambiar el estado.');
      },
    });
  }

  /** Envia la respuesta del agente al hilo del usuario. */
  responder(): void {
    const r = this.seleccionado();
    const texto = this.respuesta().trim();
    if (!r || !texto) return;

    this.respuesta.set('');
    this.reportService.addSupportMessage(r.id, texto).subscribe({
      next: (m) => {
        this.reportService.anexarMensaje(r.id, m);
        // El servidor lo deja como respondido, que aqui se ve "en proceso".
        this.reportService.fijarEstadoLocal(r.id, 'en_proceso');
        this.avisar('Respuesta enviada al usuario.');
      },
      error: (e: HttpErrorResponse) => {
        this.respuesta.set(texto);
        this.avisar(e.error?.error?.mensaje ?? 'No pudimos enviar la respuesta.');
      },
    });
  }

  /** Marca como resuelto y cierra el detalle. */
  resolver(): void {
    const r = this.seleccionado();
    if (!r) return;

    this.cambiarEstado(r.id, 'resuelto');
    this.avisar(`"${r.asunto}" resuelto.`);
    this.seleccionadoId.set(null);
  }

  eliminar(id: string, asunto: string): void {
    this.reportService.quitarLocal(id);
    if (this.seleccionadoId() === id) this.seleccionadoId.set(null);
    this.reportService.deleteReport(id).subscribe({
      next: () => this.avisar(`"${asunto}" retirado.`),
      error: (e: HttpErrorResponse) => {
        this.reportService.cargar(true);
        this.avisar(e.error?.error?.mensaje ?? 'No pudimos retirar el reporte.');
      },
    });
  }

  etiqueta(estado: ReportStatus): string {
    return ETIQUETA[estado];
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

  private avisar(texto: string): void {
    this.aviso.set(texto);
    setTimeout(() => this.aviso.set(''), 2800);
  }
}
