import {
  AfterViewInit, Component, ElementRef, OnDestroy, input, output, viewChild,
} from '@angular/core';
import { IconComponent } from '../icon/icon';

let siguienteId = 0;

const ENFOCABLES =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Diálogo modal. El contenido se proyecta con ng-content.
 * Uso: <jobsy-modal title="Mi carrito" (cerrar)="abierto.set(false)"> ... </jobsy-modal>
 *
 * Se cierra con Esc o con un clic fuera, mantiene el foco dentro mientras
 * está abierto y lo devuelve al elemento que lo abrió al cerrarse.
 */
@Component({
  selector: 'jobsy-modal',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  host: {
    '(document:keydown)': 'teclado($event)',
  },
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  readonly title = input('');
  readonly subtitle = input('');

  readonly cerrar = output<void>();

  readonly idTitulo = `ventana-titulo-${++siguienteId}`;

  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');
  private readonly anterior = document.activeElement as HTMLElement | null;

  ngAfterViewInit(): void {
    const panel = this.panel().nativeElement;
    const primero = panel.querySelector('.cuerpo_ventana')?.querySelector<HTMLElement>(ENFOCABLES);
    (primero ?? panel).focus();
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
    this.anterior?.focus?.();
  }

  teclado(ev: KeyboardEvent): void {
    if (ev.key === 'Escape') {
      ev.preventDefault();
      this.cerrar.emit();
      return;
    }
    if (ev.key !== 'Tab') return;

    const enfocables = Array.from(this.panel().nativeElement.querySelectorAll<HTMLElement>(ENFOCABLES));
    if (!enfocables.length) return;
    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];
    if (ev.shiftKey && document.activeElement === primero) {
      ev.preventDefault();
      ultimo.focus();
    } else if (!ev.shiftKey && document.activeElement === ultimo) {
      ev.preventDefault();
      primero.focus();
    }
  }
}
