import { Component, input, output } from '@angular/core';
import { IconComponent } from '../icon/icon';

/**
 * Dialogo modal. El contenido se proyecta con ng-content.
 * Uso: <jobsy-modal title="Mi carrito" (cerrar)="abierto.set(false)"> ... </jobsy-modal>
 */
@Component({
  selector: 'jobsy-modal',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class ModalComponent {
  readonly title = input('');
  readonly subtitle = input('');

  readonly cerrar = output<void>();
}
