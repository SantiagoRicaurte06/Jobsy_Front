import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'jobsy-public-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayoutComponent {
  // TODO: inputs/outputs y logica del componente.
}
