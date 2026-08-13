import { Component, input } from '@angular/core';


export type BadgeTone = 'info' | 'success' | 'warning' | 'danger' | 'accent';

@Component({
  selector: 'jobsy-badge',
  standalone: true,
  imports: [],
  template: `<span class="badge-{{ tone() }}"><ng-content /></span>`,
  styles: `:host { display: inline-flex;}`,
})
export class BadgeComponent {
  readonly tone = input<BadgeTone>('info');
}
