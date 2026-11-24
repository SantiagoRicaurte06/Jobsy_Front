import { Component, computed, input } from '@angular/core';
import {
  DIAS_SEMANA, DIA_INICIAL, DIA_NOMBRE, DiaSemana, describirHorario, horaLegible, leerHorario,
} from '../../../core/utils/horario';

/**
 * Franja de la semana: los siete días con los trabajados en naranja y el
 * horario debajo. Es la firma visual de Jobsy: las condiciones a la vista.
 *
 *   <jobsy-franja-semana [horario]="job.horario" />
 *   <jobsy-franja-semana [dias]="['Lun','Mie']" inicio="08:00" fin="12:00" tamano="grande" />
 */
@Component({
  selector: 'jobsy-franja-semana',
  standalone: true,
  template: `
    <div class="franja" [class]="'franja_' + tamano()" role="img" [attr.aria-label]="'Horario: ' + descripcion()">
      <ol class="dias_franja" aria-hidden="true">
        @for (d of semana; track d; let i = $index) {
          <li [class.is-dia]="leido().dias.includes(d)" [style.--i]="i" [attr.title]="nombre[d]">{{ inicial[d] }}</li>
        }
      </ol>
      @if (horas(); as h) {
        <p class="horas_franja" aria-hidden="true">{{ h }}</p>
      }
    </div>
  `,
  styleUrl: './franja-semana.scss',
})
export class FranjaSemanaComponent {
  /** Texto de horario tal como viene de la API. */
  readonly horario = input<string | null | undefined>(null);
  /** Alternativa al texto: días e inicio/fin sueltos (formularios, agenda). */
  readonly dias = input<string[] | null>(null);
  readonly inicio = input<string | null>(null);
  readonly fin = input<string | null>(null);
  readonly tamano = input<'chica' | 'grande'>('chica');

  readonly semana = DIAS_SEMANA;
  readonly inicial = DIA_INICIAL;
  readonly nombre = DIA_NOMBRE;

  readonly leido = computed(() => {
    const dias = this.dias();
    if (dias) {
      return {
        dias: DIAS_SEMANA.filter((d) => dias.some((x) => x.slice(0, 3).toLowerCase() === d.toLowerCase())) as DiaSemana[],
        inicio: this.inicio(),
        fin: this.fin(),
      };
    }
    return leerHorario(this.horario());
  });

  readonly horas = computed(() => {
    const { inicio, fin } = this.leido();
    return inicio && fin ? `${horaLegible(inicio)} – ${horaLegible(fin)}` : null;
  });

  readonly descripcion = computed(() => describirHorario(this.leido()));
}
