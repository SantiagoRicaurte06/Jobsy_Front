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

/**
 * Servicios contratados del usuario, de los dos lados. El empleador los da por
 * terminados y despues deja la resena; la empleada ve cuando, donde y cuanto.
 */
@Component({
  selector: 'jobsy-hirings',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, CopPipe, EmptyStateComponent, LoadingSpinnerComponent, IconComponent],
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

  estadoClase(estado: string): string {
    if (estado === 'completada') return 'pildora_exito';
    if (estado === 'cancelada') return 'pildora_error';
    return 'pildora_info';
  }

  finalizar(h: Hiring): void {
    if (!confirm(`¿Dar por terminado el servicio "${h.titulo ?? 'contratado'}"?`)) return;
    this.ocupado.set(h.id);
    this.hirings.finish(h.id).subscribe({
      next: (act) => {
        this.lista.update((l) => l.map((x) => (x.id === h.id ? { ...x, ...act, titulo: x.titulo, contraparte: x.contraparte } : x)));
        this.ocupado.set(null);
        this.aviso.set('Servicio finalizado. Ahora puedes dejar una resena.');
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
      this.aviso.set('Escribe un comentario para la resena.');
      return;
    }
    if (r.comentario.trim().length > 500) {
      this.aviso.set('El comentario admite como maximo 500 caracteres.');
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
          this.aviso.set(`Gracias. Tu resena para ${h.contraparte ?? 'esta persona'} quedo publicada.`);
        },
        error: (err: HttpErrorResponse) => {
          this.aviso.set(err?.error?.error?.mensaje ?? 'No se pudo publicar la resena.');
          this.ocupado.set(null);
        },
      });
  }
}
