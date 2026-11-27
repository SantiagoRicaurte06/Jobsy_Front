import { Component, DOCUMENT, DestroyRef, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { iniciarGestosBotones } from './shared/directives/gestos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    const doc = inject(DOCUMENT);
    const destroy = inject(DestroyRef);
    afterNextRender(() => destroy.onDestroy(iniciarGestosBotones(doc)));
  }
}
