import {
  Component, DestroyRef, ElementRef, OnInit, computed, effect, inject, signal, viewChild,
} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ReportService } from '../../../core/services';
import { Report, ReportMessage, ReportStatus } from '../../../core/models';
import { IconComponent } from '../../../shared/components/icon/icon';
import * as R from '../../../core/validation/reglas';

/** Cada cuanto se relee el hilo abierto; la lista se relee cada 3 vueltas. */
const REFRESCO_MS = 5000;
const CLAVE_VISTOS = 'jobsy.reportes.vistos';

export const ETIQUETA_ESTADO: Record<ReportStatus, string> = {
  abierto: 'Abierto',
  en_proceso: 'En proceso',
  resuelto: 'Resuelto',
  cerrado: 'Cerrado',
};

/** Un mensaje del hilo tal como se pinta, con el separador de dia si toca. */
interface Burbuja extends ReportMessage {
  dia?: string;
}

@Component({
  selector: 'jobsy-report-center',
  standalone: true,
  imports: [IconComponent, FormsModule, RouterLink],
  templateUrl: './centro-reportes.html',
  styleUrl: './centro-reportes.scss',
})
export class ReportCenterPage implements OnInit {
  private reportService = inject(ReportService);
  private destroyRef = inject(DestroyRef);
  private listaMensajes = viewChild<ElementRef<HTMLElement>>('mensajes');

  readonly reports = this.reportService.reports;
  readonly cargando = this.reportService.cargando;
  readonly errorCarga = this.reportService.error;

  // ---- Bandeja ----
  readonly filtro = signal<'activos' | 'resueltos' | 'todos'>('activos');
  readonly seleccionadoId = signal<string | null>(null);
  /** El panel derecho muestra el formulario de nuevo reporte. */
  readonly creando = signal(false);

  // ---- Nuevo reporte ----
  readonly tipo = signal('Incidencia');
  readonly asunto = signal('');
  readonly descripcion = signal('');
  readonly enviando = signal(false);
  readonly error = signal<string | null>(null);

  // ---- Conversacion ----
  readonly nuevoMensaje = signal('');
  readonly enviandoMensaje = signal(false);
  readonly errorChat = signal<string | null>(null);

  /** Cuantos mensajes del hilo ha visto el usuario, por reporte (solo en este navegador). */
  private readonly vistos = signal<Record<string, number>>(leerVistos());

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

  /** Reportes del filtro, con la actividad mas reciente primero. */
  readonly visibles = computed(() => {
    const f = this.filtro();
    const terminado = (r: Report) => r.estado === 'resuelto' || r.estado === 'cerrado';
    return this.reports()
      .filter((r) => f === 'todos' || (f === 'resueltos' ? terminado(r) : !terminado(r)))
      .sort((a, b) => (b.actividad ?? b.fecha).localeCompare(a.actividad ?? a.fecha));
  });

  readonly conteo = computed(() => {
    const activos = this.reports().filter((r) => r.estado === 'abierto' || r.estado === 'en_proceso').length;
    return { activos, resueltos: this.reports().length - activos, todos: this.reports().length };
  });

  readonly seleccionado = computed(
    () => this.reports().find((r) => r.id === this.seleccionadoId()) ?? null,
  );

  /** Solo se puede escribir en reportes abiertos o en proceso. */
  readonly puedeChatear = computed(() => {
    const e = this.seleccionado()?.estado;
    return e === 'abierto' || e === 'en_proceso';
  });

  /**
   * El hilo que se pinta: la descripcion abre la conversacion (no se guarda
   * como mensaje), y se intercala un separador cada vez que cambia el dia.
   */
  readonly burbujas = computed<Burbuja[]>(() => {
    const r = this.seleccionado();
    if (!r) return [];
    const todos: ReportMessage[] = [
      { autor: 'usuario', texto: r.descripcion || r.asunto, fecha: r.fecha },
      ...(r.mensajes ?? []),
    ];
    let anterior = '';
    return todos.map((m) => {
      const dia = etiquetaDia(m.fecha);
      const b: Burbuja = { ...m, dia: dia !== anterior ? dia : undefined };
      anterior = dia;
      return b;
    });
  });

  readonly cargandoHilo = computed(() => !!this.seleccionado() && !this.seleccionado()!.mensajes);

  constructor() {
    // Lo que esta abierto se da por leido, tambien lo que llega mientras tanto.
    effect(() => {
      const r = this.seleccionado();
      if (!r?.mensajes) return;
      const total = r.mensajes.length;
      if ((this.vistos()[r.id] ?? 0) === total) return;
      this.vistos.update((v) => ({ ...v, [r.id]: total }));
      guardarVistos(this.vistos());
    });

    // Al llegar mensajes (o al abrir otro hilo) se baja al ultimo.
    effect(() => {
      this.burbujas().length;
      const el = this.listaMensajes()?.nativeElement;
      if (el) setTimeout(() => (el.scrollTop = el.scrollHeight));
    });
  }

  ngOnInit(): void {
    this.reportService.cargar();

    // Sin esto las respuestas de soporte solo aparecian recargando la pagina.
    let vuelta = 0;
    const refrescar = (todo: boolean) => {
      if (document.hidden) return;
      const id = this.seleccionadoId();
      if (id) this.reportService.cargarHilo(id);
      // Con un chat abierto tambien se relee la lista: el estado (soporte lo
      // pasa a "en proceso" al responder) viaja en ella.
      if (todo || id) this.reportService.cargar(false, true);
    };
    const temporizador = setInterval(() => refrescar(++vuelta % 3 === 0), REFRESCO_MS);
    const alVolver = () => refrescar(true);
    document.addEventListener('visibilitychange', alVolver);
    this.destroyRef.onDestroy(() => {
      clearInterval(temporizador);
      document.removeEventListener('visibilitychange', alVolver);
    });
  }

  // ---- Bandeja ----

  seleccionar(id: string): void {
    this.creando.set(false);
    this.seleccionadoId.set(id);
    this.errorChat.set(null);
    this.nuevoMensaje.set('');
    this.reportService.cargarHilo(id);
  }

  nuevo(): void {
    this.seleccionadoId.set(null);
    this.error.set(null);
    this.creando.set(true);
  }

  /** Vuelve a la lista (en movil el detalle ocupa toda la pantalla). */
  volver(): void {
    this.seleccionadoId.set(null);
    this.creando.set(false);
  }

  tieneNovedad(r: Report): boolean {
    return r.ultimoMensaje?.autor === 'soporte' && (r.totalMensajes ?? 0) > (this.vistos()[r.id] ?? 0);
  }

  vistaPrevia(r: Report): string {
    const u = r.ultimoMensaje;
    if (!u) return r.descripcion || 'Esperando respuesta de soporte';
    return (u.autor === 'soporte' ? 'Soporte: ' : 'Tu: ') + u.texto;
  }

  // ---- Nuevo reporte ----

  enviar(): void {
    const invalido = R.primero(
      R.texto('El asunto', this.asunto(), 3, 120),
      R.texto('La descripcion', this.descripcion(), 10, 2000),
    );
    if (invalido) {
      this.error.set(invalido);
      return;
    }

    this.enviando.set(true);
    this.error.set(null);

    this.reportService
      .create({ tipo: this.tipo(), asunto: this.asunto().trim(), descripcion: this.descripcion().trim() })
      .subscribe({
        next: (nuevo) => {
          this.reportService.anexarReporte({ ...nuevo, mensajes: [], totalMensajes: 0 });
          this.asunto.set('');
          this.descripcion.set('');
          this.enviando.set(false);
          this.creando.set(false);
          this.filtro.set('activos');
          this.seleccionadoId.set(nuevo.id);
        },
        error: (e: HttpErrorResponse) => {
          this.enviando.set(false);
          this.error.set(e.error?.error?.mensaje ?? 'No pudimos enviar tu reporte.');
        },
      });
  }

  // ---- Conversacion ----

  /** Enter envia; Shift+Enter hace salto de linea. */
  alTeclear(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.enviarMensaje();
    }
  }

  enviarMensaje(): void {
    const id = this.seleccionadoId();
    const texto = this.nuevoMensaje().trim();
    if (!id || !texto || this.enviandoMensaje()) return;
    const invalido = R.texto('El mensaje', texto, 1, 2000);
    if (invalido) {
      this.errorChat.set(invalido);
      return;
    }

    this.enviandoMensaje.set(true);
    this.errorChat.set(null);
    this.reportService.sendMessage(id, texto).subscribe({
      next: (m) => {
        this.reportService.anexarMensaje(id, m);
        this.nuevoMensaje.set('');
        this.enviandoMensaje.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.enviandoMensaje.set(false);
        this.errorChat.set(e.error?.error?.mensaje ?? 'No pudimos enviar tu mensaje.');
      },
    });
  }

  toggleFaq(i: number): void {
    this.faqAbierta.update((actual) => (actual === i ? null : i));
  }

  // ---- Presentacion ----

  etiqueta(estado: ReportStatus): string {
    return ETIQUETA_ESTADO[estado] ?? estado;
  }

  badgeClass(estado: string): string {
    if (estado === 'resuelto') return 'pildora_exito';
    if (estado === 'en_proceso') return 'pildora_info';
    if (estado === 'cerrado') return 'pildora_aviso';
    return 'pildora_error';
  }

  iconoTipo(tipo: string): string {
    return this.tipos.find((t) => t.value === tipo)?.icon ?? 'bug';
  }

  /** Paso del seguimiento: 0 abierto, 1 en proceso, 2 resuelto o cerrado. */
  paso(estado: ReportStatus): number {
    return estado === 'abierto' ? 0 : estado === 'en_proceso' ? 1 : 2;
  }

  hora(fecha: string): string {
    const d = new Date(fecha);
    return isNaN(d.getTime()) ? '' : d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  }

  /** "ahora", "hace 5 min", "hace 3 h", "ayer" o "4 mar". */
  hace(fecha: string | undefined): string {
    const d = new Date(fecha ?? '');
    if (isNaN(d.getTime())) return '';
    const min = Math.floor((Date.now() - d.getTime()) / 60000);
    if (min < 1) return 'ahora';
    if (min < 60) return `hace ${min} min`;
    if (min < 24 * 60) return `hace ${Math.floor(min / 60)} h`;
    if (etiquetaDia(fecha!) === 'Ayer') return 'ayer';
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  }

  fechaLarga(fecha: string): string {
    const d = new Date(fecha);
    return isNaN(d.getTime()) ? '' : d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}

/** "Hoy", "Ayer" o "4 de marzo". */
function etiquetaDia(fecha: string): string {
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return '';
  const hoy = new Date();
  const ayer = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 1);
  if (d.toDateString() === hoy.toDateString()) return 'Hoy';
  if (d.toDateString() === ayer.toDateString()) return 'Ayer';
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long' });
}

function leerVistos(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_VISTOS) ?? '{}') ?? {};
  } catch {
    return {};
  }
}

function guardarVistos(v: Record<string, number>): void {
  try {
    localStorage.setItem(CLAVE_VISTOS, JSON.stringify(v));
  } catch {
    // Sin almacenamiento solo se pierde la marca de "nuevo".
  }
}
