import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Job } from '../../../core/models';
import { CopPipe } from '../../pipes';
import { IconComponent } from '../icon/icon';
import { FranjaSemanaComponent } from '../franja-semana/franja-semana';

/**
 * Una oferta presentada como comprobante: condiciones a la izquierda, borde
 * troquelado y la acción a la derecha, con el sello "Por escrito en Jobsy".
 *
 *   <jobsy-oferta-comprobante [job]="oferta" />
 */
@Component({
  selector: 'jobsy-oferta-comprobante',
  standalone: true,
  imports: [RouterLink, CopPipe, IconComponent, FranjaSemanaComponent],
  templateUrl: './oferta-comprobante.html',
  styleUrl: './oferta-comprobante.scss',
})
export class OfertaComprobanteComponent {
  readonly job = input.required<Job>();
  /** Lo que dice arriba de la tarifa. */
  readonly etiqueta = input('Abierta esta semana');
}
