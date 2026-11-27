import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  JobFilters, JobSize, MODALIDADES, MODALIDAD_TEXTO, TAMANOS, TAMANO_TEXTO, WorkModality,
} from '../../../core/models';

/**
 * Filtros de la búsqueda de empleo. Recibe los filtros vigentes (los de la
 * URL) y emite cada cambio al momento; el precio se aplica al salir del
 * campo o con Enter para no recargar en cada tecla.
 */
@Component({
  selector: 'jobsy-filter-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter-panel.html',
  styleUrl: './filter-panel.scss',
})
export class FilterPanelComponent {
  readonly valor = input<JobFilters>({});
  readonly aplicar = output<JobFilters>();

  readonly sizes = TAMANOS.map((value) => ({ value, label: TAMANO_TEXTO[value] }));
  readonly modalities = MODALIDADES.map((value) => ({ value, label: MODALIDAD_TEXTO[value] }));

  readonly selectedSizes = signal<JobSize[]>([]);
  readonly selectedModalities = signal<WorkModality[]>([]);
  readonly precioMin = signal<number | null>(null);
  readonly precioMax = signal<number | null>(null);

  constructor() {
    effect(() => {
      const v = this.valor();
      this.selectedSizes.set(v.tamano ?? []);
      this.selectedModalities.set(v.modalidad ?? []);
      this.precioMin.set(v.precioMin ?? null);
      this.precioMax.set(v.precioMax ?? null);
    });
  }

  toggleSize(size: JobSize): void {
    this.selectedSizes.update((list) => (list.includes(size) ? list.filter((s) => s !== size) : [...list, size]));
    this.submit();
  }

  toggleModality(m: WorkModality): void {
    this.selectedModalities.update((list) => (list.includes(m) ? list.filter((x) => x !== m) : [...list, m]));
    this.submit();
  }

  submit(): void {
    const min = this.precioMin();
    const max = this.precioMax();
    this.aplicar.emit({
      ...this.valor(),
      tamano: this.selectedSizes().length ? this.selectedSizes() : undefined,
      modalidad: this.selectedModalities().length ? this.selectedModalities() : undefined,
      precioMin: min ? Number(min) : undefined,
      precioMax: max ? Number(max) : undefined,
    });
  }

  reset(): void {
    this.selectedSizes.set([]);
    this.selectedModalities.set([]);
    this.precioMin.set(null);
    this.precioMax.set(null);
    this.aplicar.emit({ busqueda: this.valor().busqueda, ciudad: this.valor().ciudad });
  }
}
