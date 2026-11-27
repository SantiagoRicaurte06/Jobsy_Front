import { Component, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'jobsy-email-sent',
  standalone: true,
  imports: [IconComponent, RouterLink],
  templateUrl: './correo-enviado.html',
  styleUrl: './correo-enviado.scss',
})
export class EmailSentPage {
  private route = inject(ActivatedRoute);

  readonly email = this.route.snapshot.queryParamMap.get('email') ?? 'tu correo';
}
