import { Component, input } from '@angular/core';

@Component({
  selector: 'jobsy-empty-state',
  standalone: true,
  imports: [],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class EmptyStateComponent {
  readonly icon = input('\u{1F4ED}');
  readonly title = input('No hay nada por aqui');
  readonly message = input('');
}
