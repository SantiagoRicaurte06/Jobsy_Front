import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  JobFilters, JobSize, MODALIDADES, MODALIDAD_TEXTO, TAMANOS, TAMANO_TEXTO, WorkModality,
} from '../../../core/models';

/** Panel lateral de filtros para la busqueda de empleo. */
@Component({
  selector: 'jobsy-filter-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter-panel.html',
  styleUrl: './filter-panel.scss',
})
export class FilterPanelComponent {
  readonly aplicar = output<JobFilters>();

  readonly sizes = TAMANOS.map((value) => ({ value, label: TAMANO_TEXTO[value] }));

  readonly modalities = MODALIDADES.map((value) => ({ value, label: MODALIDAD_TEXTO[value] }));

  readonly selectedSizes = signal<JobSize[]>([]);
  readonly selectedModalities = signal<WorkModality[]>([]);
  readonly precioMin = signal<number | null>(null);
  readonly precioMax = signal<number | null>(null);

  toggleSize(size: JobSize): void {
    this.selectedSizes.update((list) =>
      list.includes(size) ? list.filter((s) => s !== size) : [...list, size],
    );
  }

  toggleModality(m: WorkModality): void {
    this.selectedModalities.update((list) =>
      list.includes(m) ? list.filter((x) => x !== m) : [...list, m],
    );
  }

  submit(): void {
    this.aplicar.emit({
      tamano: this.selectedSizes().length ? this.selectedSizes() : undefined,
      modalidad: this.selectedModalities().length ? this.selectedModalities() : undefined,
      precioMin: this.precioMin() ?? undefined,
      precioMax: this.precioMax() ?? undefined,
    });
  }

  reset(): void {
    this.selectedSizes.set([]);
    this.selectedModalities.set([]);
    this.precioMin.set(null);
    this.precioMax.set(null);
    this.aplicar.emit({});
  }
}
