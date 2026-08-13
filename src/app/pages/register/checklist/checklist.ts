import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'jobsy-checklist',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './checklist.html',
  styleUrl: './checklist.scss',
})
export class ChecklistPage {
  // TODO: inyectar servicios y cargar datos.
}
