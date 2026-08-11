import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'jobsy-app-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.scss',
})
export class AppLayoutComponent {
  // TODO: inputs/outputs y logica del componente.
}
