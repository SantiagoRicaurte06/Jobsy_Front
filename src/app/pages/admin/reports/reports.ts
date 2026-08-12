import { Component } from '@angular/core';

/** Panel de administracion: atender y resolver los reportes de los usuarios. */
@Component({
  selector: 'jobsy-admin-reports',
  standalone: true,
  imports: [],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class AdminReportsPage {
  // TODO: listar reportes, filtrar por estado y cambiarlo (abierto -> resuelto).
}
