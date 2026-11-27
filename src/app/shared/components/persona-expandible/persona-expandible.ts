import { Component, ElementRef, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Employee } from '../../../core/models';
import { AuthService } from '../../../core/services';
import { CopPipe } from '../../pipes';
import { IconComponent } from '../icon/icon';

type DocConTransicion = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

/**
 * Tarjeta de persona que se abre en una vista lado a lado: la foto de la
 * tarjeta crece hasta la vista (transición de vista cuando el navegador la
 * tiene) y los datos entran en cascada. Es un <dialog> nativo: atrapa el
 * foco, se cierra con Escape, con la X o tocando fuera.
 *
 *   <jobsy-persona-expandible [employee]="p" (solicitar)="contratar($event)" />
 */
@Component({
  selector: 'jobsy-persona-expandible',
  standalone: true,
  imports: [RouterLink, CopPipe, IconComponent],
  templateUrl: './persona-expandible.html',
  styleUrl: './persona-expandible.scss',
})
export class PersonaExpandibleComponent {
  private auth = inject(AuthService);

  readonly employee = input.required<Employee>();
  readonly solicitar = output<Employee>();

  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');
  private readonly fotoCarta = viewChild<ElementRef<HTMLElement>>('fotoCarta');
  private readonly fotoVista = viewChild<ElementRef<HTMLElement>>('fotoVista');

  /** Sin transición de vista, el diálogo crece con su propia animación. */
  readonly creceSolo = signal(false);

  readonly idTitulo = computed(() => 'persona-' + this.employee().id);

  readonly iniciales = computed(() =>
    this.employee()
      .nombre.split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase(),
  );

  readonly puedeContratar = computed(() => {
    const rol = this.auth.role();
    return !rol || rol === 'empleador';
  });

  abrir(): void {
    this.transicion(this.fotoCarta(), this.fotoVista(), () => this.dialogo().nativeElement.showModal());
  }

  cerrar(): void {
    const d = this.dialogo().nativeElement;
    if (!d.open) return;
    this.transicion(this.fotoVista(), this.fotoCarta(), () => d.close());
  }

  /** Escape: cierra con la misma animación en vez del cierre seco del navegador. */
  alCancelar(e: Event): void {
    e.preventDefault();
    this.cerrar();
  }

  /** Un clic que cae en el propio <dialog> (no en su interior) es un clic en el fondo. */
  alClic(e: MouseEvent): void {
    if (e.target === this.dialogo().nativeElement) this.cerrar();
  }

  contratar(): void {
    this.dialogo().nativeElement.close();
    this.solicitar.emit(this.employee());
  }

  /**
   * La foto de origen y la de destino comparten nombre de transición en
   * momentos distintos: el navegador interpola entre las dos.
   */
  private transicion(desde: ElementRef<HTMLElement> | undefined, hasta: ElementRef<HTMLElement> | undefined, cambio: () => void): void {
    const doc = document as DocConTransicion;
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!doc.startViewTransition || quieto || !desde || !hasta) {
      this.creceSolo.set(!quieto);
      cambio();
      return;
    }
    this.creceSolo.set(false);
    const nombre = 'persona-' + this.employee().id;
    desde.nativeElement.style.viewTransitionName = nombre;
    const t = doc.startViewTransition(() => {
      desde.nativeElement.style.viewTransitionName = '';
      hasta.nativeElement.style.viewTransitionName = nombre;
      cambio();
    });
    t.finished.finally(() => (hasta.nativeElement.style.viewTransitionName = ''));
  }
}
