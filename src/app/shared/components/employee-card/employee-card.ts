import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Employee } from '../../../core/models';
import { RatingStarsComponent } from '../rating-stars/rating-stars';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'jobsy-employee-card',
  standalone: true,
  imports: [IconComponent, RouterLink, RatingStarsComponent],
  templateUrl: './employee-card.html',
  styleUrl: './employee-card.scss',
})
export class EmployeeCardComponent {
  readonly employee = input.required<Employee>();

  readonly solicitar = output<Employee>();

  initials(nombre: string): string {
    return nombre
      .split('')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
}
