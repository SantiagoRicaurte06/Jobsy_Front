import {
  Component, DestroyRef, computed, effect, inject, input, model, signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Employee, Job } from '../../../../core/models';
import { DIAS_SEMANA, DIA_INICIAL, DIA_NOMBRE, DiaSemana } from '../../../../core/utils/horario';
import { coincideOficio, oficiosDe, pagoSemana, semanaEnUrl } from '../../../../core/utils/semana';
import { CopPipe } from '../../../../shared/pipes';
import { IconComponent } from '../../../../shared/components/icon/icon';

export type ModoPlan = 'contratar' | 'trabajar';

function mediana(valores: number[]): number | null {
  if (!valores.length) return null;
  const v = [...valores].sort((a, b) => a - b);
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : Math.round((v[m - 1] + v[m]) / 2);
}

/**
 * Planificador de la portada: el visitante arma su semana y ve, con los datos
 * reales de la API, cuántas personas o cuántas ofertas le sirven y cuánto
 * costaría o pagaría por semana. Es la demostración del producto: el acuerdo
 * (días, horas, tarifa) antes de cualquier registro.
 */
@Component({
  selector: 'jobsy-planificador',
  standalone: true,
  imports: [RouterLink, CopPipe, IconComponent],
  templateUrl: './planificador.html',
  styleUrl: './planificador.scss',
})
export class PlanificadorComponent {
  readonly jobs = input<Job[]>([]);
  readonly employees = input<Employee[]>([]);
  /** Con sesión, el rol fija el modo y se ocultan las pestañas. */
  readonly modoFijo = input(false);
  readonly modo = model<ModoPlan>('contratar');

  readonly semana = DIAS_SEMANA;
  readonly inicial = DIA_INICIAL;
  readonly nombreDia = DIA_NOMBRE;

  readonly oficio = signal('Todos');
  readonly dias = signal<DiaSemana[]>(['Lun', 'Mie', 'Vie']);
  readonly horas = signal(6);

  /** Oficios que de verdad aparecen en ofertas y perfiles. */
  readonly oficios = computed(() => [
    'Todos',
    ...oficiosDe([...this.jobs().map((j) => j.etiquetas), ...this.employees().map((e) => e.especialidades)], 5),
  ]);

  private coincideOficio(lista: string[]): boolean {
    return coincideOficio(lista, this.oficio());
  }

  alternarDia(d: DiaSemana): void {
    this.dias.update((ds) => (ds.includes(d) ? ds.filter((x) => x !== d) : [...ds, d]));
  }

  cambiarHoras(delta: number): void {
    this.horas.update((h) => Math.min(10, Math.max(2, h + delta)));
  }

  // ---------------- Necesito ayuda ----------------
  readonly personas = computed(() =>
    this.employees().filter((e) => e.disponible !== false && this.coincideOficio(e.especialidades)),
  );

  /** Tarifa de referencia: la mediana de quienes coinciden, si no la de las ofertas. */
  readonly tarifaReferencia = computed(() => {
    const deP = mediana(this.personas().map((e) => e.tarifaHora).filter((t): t is number => !!t));
    if (deP) return deP;
    return mediana(this.jobs().filter((j) => this.coincideOficio(j.etiquetas)).map((j) => j.precioHora));
  });

  readonly costoSemana = computed(() => {
    const t = this.tarifaReferencia();
    return t ? t * this.horas() * this.dias().length : 0;
  });

  // ---------------- Busco trabajo ----------------
  readonly ofertas = computed(() => {
    const mis = this.dias();
    return this.jobs()
      .filter((j) => this.coincideOficio(j.etiquetas))
      .map((j) => {
        const { comunes, total } = pagoSemana(j.horario, j.precioHora, { dias: mis, horas: this.horas() });
        return { job: j, comunes, semana: total };
      })
      .filter((o) => o.comunes.length > 0)
      .sort((a, b) => b.semana - a.semana);
  });

  readonly mejorSemana = computed(() => this.ofertas()[0]?.semana ?? 0);

  // ---------------- Resultado ----------------
  readonly cantidad = computed(() =>
    this.modo() === 'contratar' ? this.personas().length : this.ofertas().length,
  );
  readonly cifra = computed(() => (this.modo() === 'contratar' ? this.costoSemana() : this.mejorSemana()));

  readonly enlace = computed(() => (this.modo() === 'contratar' ? '/empleados' : '/empleos'));
  /** La semana armada viaja a la lista: cada tarjeta dirá cuánto cuesta o paga. */
  readonly consulta = computed(() => {
    const oficio = this.oficio() === 'Todos' || this.cantidad() === 0 ? null : this.oficio();
    const semana = semanaEnUrl({ dias: this.dias(), horas: this.horas() });
    return this.modo() === 'contratar' ? { oficio, ...semana } : { oficio, dias: semana.dias };
  });

  /** La cifra cuenta hacia su nuevo valor; sin movimiento si el sistema lo pide. */
  readonly cifraMostrada = signal(0);
  private animacion = 0;

  constructor() {
    const reducir = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    effect(() => {
      const destino = this.cifra();
      cancelAnimationFrame(this.animacion);
      const desde = this.cifraMostrada();
      if (reducir || typeof requestAnimationFrame === 'undefined' || desde === destino) {
        this.cifraMostrada.set(destino);
        return;
      }
      const t0 = performance.now();
      const dur = 520;
      const paso = (t: number) => {
        // El primer cuadro puede traer una marca de tiempo anterior a t0: sin acotar, la cifra baja de cero.
        const p = Math.min(1, Math.max(0, (t - t0) / dur));
        const e = 1 - Math.pow(1 - p, 4);
        this.cifraMostrada.set(Math.round((desde + (destino - desde) * e) / 1000) * 1000);
        if (p < 1) this.animacion = requestAnimationFrame(paso);
        else this.cifraMostrada.set(destino);
      };
      this.animacion = requestAnimationFrame(paso);
    });
    inject(DestroyRef).onDestroy(() => cancelAnimationFrame(this.animacion));
  }

  iniciales(nombre: string): string {
    return nombre.split(/\s+/).slice(0, 2).map((p) => p[0] ?? '').join('').toUpperCase();
  }
}
