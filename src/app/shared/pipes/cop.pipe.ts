import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formatea un numero como pesos colombianos: 35000 -> "$35.000".
 * Uso: {{ job.precioHora | cop }}
 */
@Pipe({ name: 'cop', standalone: true })
export class CopPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '';
    return `$${value.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
  }
}
