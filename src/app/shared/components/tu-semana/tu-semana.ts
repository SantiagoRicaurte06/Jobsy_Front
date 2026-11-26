import { Component, computed, input, output } from '@angular/core';
import { DIAS_SEMANA, DIA_INICIAL, DIA_NOMBRE, DiaSemana } from '../../../core/utils/horario';
import { HORAS_DEFECTO, HORAS_MAX, HORAS_MIN, Semana } from '../../../core/utils/semana';
import { IconComponent } from '../icon/icon';

export interface CambioSemana {
  oficio: string | null;
  semana: Semana | null;
}

/**
 * Barra "Tu semana" de las listas de personas y de ofertas: oficio, días y
 * (para contratar) horas por día. Es la misma semana que se arma en la
 * portada; la página la guarda en la URL y cada tarjeta la usa para decir
 * cuánto cuesta o cuánto paga.
 */
@Component({
  selector: 'jobsy-tu-semana',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './tu-semana.html',
  styleUrl: './tu-semana.scss',
})
export class TuSemanaComponent {
  readonly oficios = input<string[]>([]);
  readonly oficio = input<string | null>(null);
  readonly semana = input<Semana | null>(null);
  /** Pide horas por día (contratar); en ofertas las horas las fija cada oferta. */
  readonly conHoras = input(true);
  readonly titulo = input('Tu semana');

  readonly cambio = output<CambioSemana>();

  readonly dias7 = DIAS_SEMANA;
  readonly inicial = DIA_INICIAL;
  readonly nombreDia = DIA_NOMBRE;
  readonly horasMin = HORAS_MIN;
  readonly horasMax = HORAS_MAX;

  readonly dias = computed(() => this.semana()?.dias ?? []);
  readonly horas = computed(() => this.semana()?.horas ?? HORAS_DEFECTO);
  readonly hayAlgo = computed(() => !!this.oficio() || this.dias().length > 0);

  private emitir(oficio: string | null, dias: DiaSemana[], horas: number): void {
    const orden = DIAS_SEMANA.filter((d) => dias.includes(d));
    this.cambio.emit({ oficio, semana: orden.length ? { dias: orden, horas } : null });
  }

  alternarOficio(o: string): void {
    this.emitir(this.oficio() === o ? null : o, this.dias(), this.horas());
  }

  alternarDia(d: DiaSemana): void {
    const ds = this.dias();
    this.emitir(this.oficio(), ds.includes(d) ? ds.filter((x) => x !== d) : [...ds, d], this.horas());
  }

  cambiarHoras(delta: number): void {
    const h = Math.min(HORAS_MAX, Math.max(HORAS_MIN, this.horas() + delta));
    this.emitir(this.oficio(), this.dias(), h);
  }

  limpiar(): void {
    this.cambio.emit({ oficio: null, semana: null });
  }
}
