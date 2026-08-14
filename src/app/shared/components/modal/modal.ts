import { Component, input, output } from '@angular/core';

/**
 * Dialogo modal. El contenido se proyecta con ng-content.
 * Uso: <jobsy-modal title="Mi carrito" (cerrar)="abierto.set(false)"> ... </jobsy-modal>
 */
@Component({
  selector: 'jobsy-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class ModalComponent {
  readonly title = input('');
  readonly subtitle = input('');

  readonly cerrar = output<void>();
}
