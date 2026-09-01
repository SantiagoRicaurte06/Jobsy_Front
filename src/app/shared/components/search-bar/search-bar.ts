import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon';

/** Barra de busqueda con ciudad opcional. */
@Component({
  selector: 'jobsy-search-bar',
  standalone: true,
  imports: [IconComponent, FormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBarComponent {
  readonly placeholder = input('Buscar por tipo de servicio, cargo...');
  readonly showCity = input(true);

  readonly buscar = output<{ termino: string; ciudad: string }>();

  readonly termino = signal('');
  readonly ciudad = signal('');

  submit(): void {
    this.buscar.emit({ termino: this.termino(), ciudad: this.ciudad() });
  }
}
