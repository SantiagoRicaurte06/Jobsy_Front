import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReportService } from '../../../core/services';
import { Report } from '../../../core/models';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'jobsy-report-center',
  standalone: true,
  imports: [IconComponent, FormsModule, RouterLink],
  templateUrl: './centro-reportes.html',
  styleUrl: './centro-reportes.scss',
})
export class ReportCenterPage {
  private reportService = inject(ReportService);

  /** Lista reactiva de reportes del usuario (con su conversacion). */
  readonly reports = this.reportService.reports;

  readonly enviando = signal(false);
  readonly enviado = signal(false);
  readonly error = signal<string | null>(null)

  /** `tipo` viaja como texto libre: asi lo define Report en el backend. */
  readonly tipo = signal('Incidencia');
  readonly asunto = signal('');
  readonly descripcion = signal('');

  // ---- Conversacion ----
  readonly seleccionadoId = signal<string | null>(null);
  readonly nuevoMensaje = signal('');

  /** Reporte abierto en el chat; se recalcula solo cuando llegan mensajes. */
  readonly seleccionado = computed(
    () => this.reports().find((r) => r.id === this.seleccionadoId()) ?? null,
  );

  /** Solo se puede escribir en reportes abiertos o en proceso. */
  readonly puedeChatear = computed(() => {
    const e = this.seleccionado()?.estado;
    return e === 'abierto' || e === 'en_proceso';
  });

  readonly tipos = [
    { value: 'Incidencia', icon: 'bug', label: 'Problema tecnico', text: 'Algo no funciona en la plataforma.' },
    { value: 'Usuario', icon: 'flag', label: 'Reportar usuario', text: 'Comportamiento inadecuado.' },
    { value: 'Pago', icon: 'credit-card', label: 'Problema de pago', text: 'Cobros o transferencias.' },
    { value: 'Sugerencia', icon: 'lightbulb', label: 'Sugerencia', text: 'Ideas para mejorar Jobsy.' },
  ];

  readonly faqs = [
    { q: 'Como cambio mi contrasena?', a: 'Ve a Configuracion > Seguridad y usa "Cambiar contrasena".' },
    { q: 'Cuando recibo el pago de un servicio?', a: 'El pago se libera 24 horas despues de que el empleador confirme el servicio.' },
    { q: 'Como verifico mi perfil?', a: 'Sube tu documento de identidad desde tu perfil. La verificacion tarda 48 horas.' },
    { q: 'Puedo cancelar una postulacion?', a: 'Si, desde Mis postulaciones mientras siga en estado pendiente.' },
  ];

  readonly faqAbierta = signal<number | null>(null);

  toggleFaq(i: number): void {
    this.faqAbierta.update((actual) => (actual === i ? null : i));
  }

  /** Crea el reporte y abre su conversacion. */
  enviar(): void {
    if (!this.asunto() || !this.descripcion()) return;

    this.enviando.set(true);
    this.error.set(null);

    // ReportService.create() ya agrega el reporte a la lista y lo persiste.
    const nuevo = this.reportService.create({
      tipo: this.tipo(),
      asunto: this.asunto(),
      descripcion: this.descripcion(),
    });

    this.asunto.set('');
    this.descripcion.set('');
    this.enviando.set(false);
    this.enviado.set(true);
    setTimeout(() => this.enviado.set(false), 3000);

    this.seleccionadoId.set(nuevo.id);
  }

  /** Abre la conversacion de un reporte. */
  seleccionar(id: string): void {
    this.seleccionadoId.set(id);
  }

  /** Cierra la conversacion y vuelve al listado. */
  volver(): void {
    this.seleccionadoId.set(null);
  }

  /** Envia el mensaje escrito en el chat del reporte abierto. */
  enviarMensaje(): void {
    const id = this.seleccionadoId();
    const texto = this.nuevoMensaje().trim();
    if (!id || !texto) return;

    this.reportService.sendMessage(id, texto);
    this.nuevoMensaje.set('');
  }

  /** Texto del ultimo mensaje del hilo, para la vista previa del listado. */
  ultimoMensaje(r: Report): string {
    return r.mensajes?.at(-1)?.texto ?? r.descripcion;
  }

  badgeClass(estado: string): string {
    if (estado === 'resuelto') return 'pildora_exito';
    if (estado === 'en_proceso') return 'pildora_info';
    if (estado === 'cerrado') return 'pildora_aviso';
    return 'pildora_error';
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
}
