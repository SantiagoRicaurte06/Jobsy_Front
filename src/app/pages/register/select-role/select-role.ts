import { Component } from '@angular/core';
import { LogoComponent } from "../../../shared/components/logo/logo";

@Component({
  selector: 'jobsy-select-role',
  standalone: true,
  imports: [LogoComponent],
  templateUrl: './select-role.html',
  styleUrl: './select-role.scss',
})
export class SelectRolePage {
  // TODO: inyectar servicios y cargar datos.
}
