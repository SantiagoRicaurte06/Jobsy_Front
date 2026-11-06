import { refrescarMientrasVisible } from '../../../core/utils/refresco';
import { Component, computed, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationService, HiringService, JobService } from '../../../core/services';
import { OfferStatus, OwnJob, ReceivedApplication } from '../../../core/models';
import { CopPipe } from '../../../shared/pipes';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { IconComponent } from '../../../shared/components/icon/icon';
import * as R from '../../../core/validation/reglas';

/** Datos del formulario de contratacion de una postulacion. */
interface FormContrato {
  postulacionId: string;
  fechaInicio: string;
  horaInicio: string;
  duracionHoras: number;
  tarifa: number;
  direccion: string;
}

/**
 * Ofertas del empleador: su estado, sus fotos y las postulaciones que reciben.
 * Desde aqui se pausan o cierran, se suben fotos de la casa y se responde a
 * cada candidata (revisar, rechazar o contratar).
 */
@Component({
  selector: 'jobsy-my-offers',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, CopPipe, EmptyStateComponent, LoadingSpinnerComponent, IconComponent],
  templateUrl: './mis-ofertas.html',
  styleUrl: './mis-ofertas.scss',
})
export class MyOffersPage implements OnInit {
  private destroyRef = inject(DestroyRef);
  private jobs = inject(JobService);
  private applications = inject(ApplicationService);
  private hirings = inject(HiringService);

  readonly ofertas = signal<OwnJob[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly aviso = signal('');

  readonly filtros: { value: OfferStatus | 'todas'; label: string }[] = [
    { value: 'todas', label: 'Todas' },
    { value: 'activa', label: 'Activas' },
    { value: 'pausada', label: 'Pausadas' },
    { value: 'cerrada', label: 'Cerradas' },
  ];
  readonly filtro = signal<OfferStatus | 'todas'>('todas');
  readonly visibles = computed(() =>
    this.filtro() === 'todas' ? this.ofertas() : this.ofertas().filter((o) => o.estado === this.filtro()),
  );

  /** Oferta cuyas postulaciones estan abiertas, y esas postulaciones. */
  readonly abierta = signal<string | null>(null);
  readonly recibidas = signal<ReceivedApplication[]>([]);
  readonly cargandoRecibidas = signal(false);
  readonly subiendoFotos = signal<string | null>(null);
  readonly ocupado = signal<string | null>(null);
  readonly contrato = signal<FormContrato | null>(null);
  /** Tras contratar se ofrece ir a Contrataciones. */
  readonly contratoHecho = signal(false);

  /** Error del formulario de contrato; se muestra dentro del propio formulario. */
  readonly errorContrato = signal('');
  readonly limites = R.LIMITES;
  readonly fechaMin = R.hoyISO();
  readonly fechaMax = R.hoyISO(0, 1);

  ngOnInit(): void {
    this.cargar();
    // Postulaciones nuevas y ofertas cerradas aparecen sin recargar.
    refrescarMientrasVisible(this.destroyRef, () => {
      this.cargar();
      const id = this.abierta();
      if (id) this.jobs.received(id).subscribe((r) => this.recibidas.set(r));
    });
  }

  cargar(): void {
    this.jobs.mine().subscribe({
      next: (o) => {
        this.ofertas.set(o);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(this.mensaje(err, 'No pudimos cargar tus ofertas.'));
        this.cargando.set(false);
      },
    });
  }

  private mensaje(err: HttpErrorResponse, porDefecto: string): string {
    return err?.error?.error?.mensaje ?? porDefecto;
  }

  private reemplazar(o: OwnJob): void {
    this.ofertas.update((lista) => lista.map((x) => (x.id === o.id ? o : x)));
  }

  estadoClase(estado: string): string {
    if (estado === 'activa' || estado === 'aceptada') return 'pildora_exito';
    if (estado === 'cerrada' || estado === 'rechazada') return 'pildora_error';
    if (estado === 'en_revision') return 'pildora_info';
    return 'pildora_aviso';
  }

  estadoTexto(estado: string): string {
    return ({ pendiente: 'Pendiente', en_revision: 'En revision', aceptada: 'Contratada', rechazada: 'Rechazada' } as Record<string, string>)[estado] ?? estado;
  }

  // ---- Oferta ----

  cambiarEstado(o: OwnJob, estado: OfferStatus): void {
    if (estado === 'cerrada' && !confirm(`¿Cerrar la oferta "${o.titulo}"? Dejara de recibir postulaciones.`)) return;
    this.ocupado.set(o.id);
    this.jobs.setStatus(o.id, estado).subscribe({
      next: (act) => {
        this.reemplazar(act);
        this.ocupado.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.aviso.set(this.mensaje(err, 'No se pudo cambiar el estado de la oferta.'));
        this.ocupado.set(null);
      },
    });
  }

  subirFotos(o: OwnJob, event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivos = Array.from(input.files ?? []);
    if (!archivos.length) return;
    this.subiendoFotos.set(o.id);
    // Una a una, en orden: asi la primera elegida queda como principal.
    let cadena = Promise.resolve<OwnJob | undefined>(undefined);
    for (const f of archivos) {
      cadena = cadena.then(() => new Promise<OwnJob>((ok, mal) => this.jobs.uploadPhoto(o.id, f).subscribe({ next: ok, error: mal })));
    }
    cadena
      .then((act) => {
        if (act) this.reemplazar(act);
        this.aviso.set(`Se subieron ${archivos.length} foto(s) de "${o.titulo}".`);
      })
      .catch((err: HttpErrorResponse) => this.aviso.set(this.mensaje(err, 'No se pudo subir la foto.')))
      .finally(() => {
        this.subiendoFotos.set(null);
        input.value = '';
      });
  }

  // ---- Postulaciones ----

  verPostulaciones(o: OwnJob): void {
    if (this.abierta() === o.id) {
      this.abierta.set(null);
      return;
    }
    this.abierta.set(o.id);
    this.contrato.set(null);
    this.cargandoRecibidas.set(true);
    this.jobs.received(o.id).subscribe({
      next: (r) => {
        this.recibidas.set(r);
        this.cargandoRecibidas.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.aviso.set(this.mensaje(err, 'No pudimos cargar las postulaciones.'));
        this.cargandoRecibidas.set(false);
      },
    });
  }

  private refrescarConteos(): void {
    this.jobs.mine().subscribe((o) => this.ofertas.set(o));
  }

  responder(r: ReceivedApplication, estado: 'en_revision' | 'rechazada'): void {
    if (estado === 'rechazada' && !confirm(`¿Rechazar la postulacion de ${r.empleado?.nombre ?? 'esta persona'}? Se le enviara un aviso.`)) return;
    this.ocupado.set(r.id);
    this.applications.setStatus(r.id, estado).subscribe({
      next: (p) => {
        this.recibidas.update((lista) => lista.map((x) => (x.id === r.id ? { ...x, estado: p.estado } : x)));
        this.ocupado.set(null);
        this.refrescarConteos();
      },
      error: (err: HttpErrorResponse) => {
        this.aviso.set(this.mensaje(err, 'No se pudo responder la postulacion.'));
        this.ocupado.set(null);
      },
    });
  }

  abrirContrato(o: OwnJob, r: ReceivedApplication): void {
    this.errorContrato.set('');
    this.contrato.set({
      postulacionId: r.id,
      fechaInicio: R.hoyISO(1),
      horaInicio: '08:00',
      duracionHoras: 4,
      tarifa: o.precioHora,
      direccion: o.direccion,
    });
  }

  actualizarContrato<K extends keyof FormContrato>(campo: K, valor: FormContrato[K]): void {
    this.contrato.update((c) => (c ? { ...c, [campo]: valor } : c));
  }

  contratar(): void {
    const c = this.contrato();
    if (!c) return;
    const invalido = R.primero(
      R.fechaServicio(c.fechaInicio),
      R.hora(c.horaInicio),
      R.rango('El numero de horas', c.duracionHoras, R.LIMITES.horasMin, R.LIMITES.horasMax),
      R.tarifa(c.tarifa),
      R.direccion(c.direccion),
    );
    this.errorContrato.set(invalido ?? '');
    if (invalido) return;
    this.ocupado.set(c.postulacionId);
    this.hirings.fromApplication(c).subscribe({
      next: () => {
        this.contrato.set(null);
        this.ocupado.set(null);
        this.contratoHecho.set(true);
        this.aviso.set(
          'Contratacion creada. La oferta quedo cerrada y las demas candidatas recibieron un aviso. ' +
            'Si necesitas a alguien mas, reactiva la oferta.',
        );
        // El servidor cerro la oferta y respondio a las demas: se relee todo.
        const id = this.abierta();
        if (id) this.jobs.received(id).subscribe((r) => this.recibidas.set(r));
        this.refrescarConteos();
      },
      error: (err: HttpErrorResponse) => {
        this.aviso.set(this.mensaje(err, 'No se pudo crear la contratacion.'));
        this.ocupado.set(null);
      },
    });
  }

  /** Cuantas fotos y postulaciones hay en total, para el resumen de arriba. */
  readonly resumen = computed(() => {
    const o = this.ofertas();
    return {
      activas: o.filter((x) => x.estado === 'activa').length,
      postulaciones: o.reduce((s, x) => s + x.postulaciones, 0),
      pendientes: o.reduce((s, x) => s + x.pendientes, 0),
    };
  });
}
