import { Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'jobsy-empty-state',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyStateComponent {
  /** Nombre del icono de Lucide (ver icons.ts). */
  readonly icon = input('inbox');
  readonly title = input('No hay nada por aqui');
  readonly message = input('');
}
