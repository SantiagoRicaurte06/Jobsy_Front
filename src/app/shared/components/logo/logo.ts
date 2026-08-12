import { Component } from '@angular/core';

/** Logotipo de Jobsy. Se usa en header, footer, auth y sidebar de admin. */
@Component({
  selector: 'jobsy-logo',
  standalone: true,
  imports: [],
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
})
export class LogoComponent {
  // TODO: inputs `variant` ('color' | 'light') y `size` ('sm' | 'md' | 'lg').
}
