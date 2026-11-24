import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon';

/** Barra de búsqueda con ciudad opcional. Puede arrancar con valores de la URL. */
@Component({
  selector: 'jobsy-search-bar',
  standalone: true,
  imports: [IconComponent, FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBarComponent {
  readonly placeholder = input('Buscar por tipo de servicio, cargo…');
  readonly showCity = input(true);
  readonly terminoInicial = input('');
  readonly ciudadInicial = input('');

  readonly buscar = output<{ termino: string; ciudad: string }>();

  readonly termino = signal('');
  readonly ciudad = signal('');

  constructor() {
    effect(() => this.termino.set(this.terminoInicial() ?? ''));
    effect(() => this.ciudad.set(this.ciudadInicial() ?? ''));
  }

  submit(): void {
    this.buscar.emit({ termino: this.termino(), ciudad: this.ciudad() });
  }
}
