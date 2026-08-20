import { Component, input } from '@angular/core';

/** Logotipo de Jobsy. `variant` cambia el color del texto segun el fondo. */
@Component({
  selector: 'jobsy-logo',
  standalone: true,
  imports: [],
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
})
export class LogoComponent {
  readonly variant = input<'color' | 'claro'>('color');
  readonly size = input<'chico' | 'medio' | 'grande'>('medio');
}
