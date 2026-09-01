import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../../shared/components/logo/logo';

@Component({
  selector: 'jobsy-not-found',
  standalone: true,
  imports: [RouterLink, LogoComponent],
  templateUrl: './no-encontrado.html',
  styleUrl: './no-encontrado.scss',
})
export class NotFoundPage {}
