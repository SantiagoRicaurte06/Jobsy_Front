import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Slot {
  hora: string;
  disponible: boolean;
}

@Component({
  selector: 'jobsy-schedule',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './agendar.html',
  styleUrl: './agendar.scss',
})
export class SchedulePage {
  readonly mesActual = signal(new Date());
  readonly diaSeleccionado = signal<number | null>(null);
  readonly slotSeleccionado = signal<string | null>(null);
  readonly notas = signal('');
  readonly confirmado = signal(false);

  readonly nombresDia = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

  /** TEMPORAL: franjas fijas. El backend real devolvera la disponibilidad. */
  readonly slots: Slot[] = [
    { hora: '07:00 - 09:00', disponible: true },
    { hora: '09:00 - 11:00', disponible: true },
    { hora: '11:00 - 13:00', disponible: false },
    { hora: '13:00 - 15:00', disponible: true },
    { hora: '15:00 - 17:00', disponible: true },
    { hora: '17:00 - 19:00', disponible: false },
  ];

  /** Dias del mes con huecos al inicio para alinear la cuadricula. */
  readonly dias = computed(() => {
    const d = this.mesActual();
    const primero = new Date(d.getFullYear(), d.getMonth(), 1);
    const totalDias = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    // getDay(): 0 = domingo. Ajustamos para que la semana empiece en lunes.
    const offset = (primero.getDay() + 6) % 7;

    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: totalDias }, (_, i) => i + 1),
    ];
  });

  readonly nombreMes = computed(() =>
    this.mesActual().toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }),
  );

  cambiarMes(delta: number): void {
    const d = new Date(this.mesActual());
    d.setMonth(d.getMonth() + delta);
    this.mesActual.set(d);
    this.diaSeleccionado.set(null);
  }

  seleccionarDia(dia: number | null): void {
    if (dia === null) return;
    this.diaSeleccionado.set(dia);
    this.slotSeleccionado.set(null);
  }

  confirmar(): void {
    if (!this.diaSeleccionado() || !this.slotSeleccionado()) return;
    this.confirmado.set(true);
  }
}
