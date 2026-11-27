import { refrescarMientrasVisible } from '../../core/utils/refresco';
import { Component, computed, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EmployeeService, Hiring, HiringService } from '../../core/services';
import { CopPipe } from '../../shared/pipes';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner';
import { IconComponent } from '../../shared/components/icon/icon';
import { ConfirmacionComponent } from '../../shared/components/confirmacion/confirmacion';
import { FranjaSemanaComponent } from '../../shared/components/franja-semana/franja-semana';
import { DIAS_SEMANA, horaLegible } from '../../core/utils/horario';

/** Lo que pinta la franja de la semana de un servicio. */
interface FranjaServicio {
  dias: string[];
  inicio: string | null;
  fin: string | null;
}

/** "08:30" + 2.5 h → "11:00". Devuelve null si la hora no se puede leer. */
function sumarHoras(hora: string, horas: number): string | null {
  const m = /^(\d{1,2}):(\d{2})/.exec(hora ?? '');
  if (!m || !(horas > 0)) return null;
  const total = (Number(m[1]) * 60 + Number(m[2]) + Math.round(horas * 60)) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

/** Acción que espera que el usuario la confirme en el diálogo. */
interface Pendiente {
  titulo: string;
  mensaje: string;
  aceptar: string;
  peligro: boolean;
  accion: () => void;
}

/**
 * Servicios contratados del usuario, de los dos lados. El empleador los da por
 * terminados y despues deja la resena; la empleada ve cuando, donde y cuanto.
 */
@Component({
  selector: 'jobsy-hirings',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, CopPipe, EmptyStateComponent, LoadingSpinnerComponent, IconComponent, ConfirmacionComponent, FranjaSemanaComponent],
  templateUrl: './contrataciones.html',
  styleUrl: './contrataciones.scss',
})
export class HiringsPage implements OnInit {
  private destroyRef = inject(DestroyRef);
  private hirings = inject(HiringService);
  private employees = inject(EmployeeService);

  readonly lista = signal<Hiring[]>([]);
  readonly cargando = signal(true);
  readonly aviso = signal('');
  readonly ocupado = signal<string | null>(null);

  readonly filtro = signal<'activa' | 'completada' | 'todas'>('todas');
  readonly visibles = computed(() =>
    this.filtro() === 'todas' ? this.lista() : this.lista().filter((h) => h.estado === this.filtro()),
  );

  /**
   * Franja de cada servicio. Si la contratación trae agenda recurrente se usan
   * sus días; si no, el día de la fecha de inicio con la hora y la duración.
   */
  readonly franjas = computed(() => new Map(this.lista().map((h) => [h.id, this.franjaDe(h)])));

  private franjaDe(h: Hiring): FranjaServicio {
    if (h.agenda?.length) {
      const primera = h.agenda[0];
      return { dias: h.agenda.map((a) => a.dia), inicio: primera.horaInicio, fin: primera.horaFin };
    }
    const f = /^(\d{4})-(\d{2})-(\d{2})/.exec(h.fechaInicio ?? '');
    const dias = f ? [DIAS_SEMANA[(new Date(+f[1], +f[2] - 1, +f[3]).getDay() + 6) % 7]] : [];
    return { dias, inicio: h.horaInicio || null, fin: sumarHoras(h.horaInicio, h.duracionHoras) };
  }

  /** Resena en curso (una a la vez) y las contrataciones ya resenadas en esta visita. */
  readonly resena = signal<{ id: string; calificacion: number; comentario: string } | null>(null);
  readonly resenadas = signal<string[]>([]);

  ngOnInit(): void {
    this.cargar();
    refrescarMientrasVisible(this.destroyRef, () => this.cargar());
  }

  cargar(): void {
    this.hirings.mine().subscribe({
      next: (h) => {
        this.lista.set(h);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.aviso.set(err?.error?.error?.mensaje ?? 'No pudimos cargar tus contrataciones.');
        this.cargando.set(false);
      },
    });
  }

  /** El MID solo maneja dos estados: se crea activa y al finalizar queda completada. */
  estadoTexto(estado: string): string {
    return estado === 'completada' ? 'Completada' : 'En curso';
  }

  readonly horaLegible = horaLegible;

  readonly pendiente = signal<Pendiente | null>(null);

  finalizar(h: Hiring, confirmado = false): void {
    if (!confirmado) {
      this.pendiente.set({
        titulo: '¿Finalizar este servicio?',
        mensaje: `«${h.titulo ?? 'Servicio contratado'}» quedará como completado y podrás dejar una reseña.`,
        aceptar: 'Finalizar servicio',
        peligro: false,
        accion: () => this.finalizar(h, true),
      });
      return;
    }
    this.ocupado.set(h.id);
    this.hirings.finish(h.id).subscribe({
      next: (act) => {
        this.lista.update((l) => l.map((x) => (x.id === h.id ? { ...x, ...act, titulo: x.titulo, contraparte: x.contraparte } : x)));
        this.ocupado.set(null);
        this.aviso.set('Servicio finalizado. Ahora puedes dejar una reseña.');
        this.resena.set({ id: h.id, calificacion: 5, comentario: '' });
      },
      error: (err: HttpErrorResponse) => {
        this.aviso.set(err?.error?.error?.mensaje ?? 'No se pudo finalizar el servicio.');
        this.ocupado.set(null);
      },
    });
  }

  abrirResena(h: Hiring): void {
    this.resena.set({ id: h.id, calificacion: 5, comentario: '' });
  }

  publicarResena(h: Hiring): void {
    const r = this.resena();
    if (!r || !h.contraparteId) return;
    if (!r.comentario.trim()) {
      this.aviso.set('Escribe un comentario para la reseña.');
      return;
    }
    if (r.comentario.trim().length > 500) {
      this.aviso.set('El comentario admite como máximo 500 caracteres.');
      return;
    }
    this.ocupado.set(h.id);
    this.employees
      .addReview({ sobreUsuarioId: h.contraparteId, postulacionId: h.postulacionId, calificacion: r.calificacion, comentario: r.comentario.trim() })
      .subscribe({
        next: () => {
          this.resenadas.update((l) => [...l, h.id]);
          this.resena.set(null);
          this.ocupado.set(null);
          this.aviso.set(`Gracias. Tu reseña para ${h.contraparte ?? 'esta persona'} quedó publicada.`);
        },
        error: (err: HttpErrorResponse) => {
          this.aviso.set(err?.error?.error?.mensaje ?? 'No se pudo publicar la reseña.');
          this.ocupado.set(null);
        },
      });
  }
}
