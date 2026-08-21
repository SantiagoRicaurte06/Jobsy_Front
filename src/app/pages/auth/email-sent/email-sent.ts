import { Component, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { LogoComponent } from '../../../shared/components/logo/logo';

@Component({
  selector: 'jobsy-email-sent',
  standalone: true,
  imports: [RouterLink, LogoComponent],
  templateUrl: './email-sent.html',
  styleUrl: './email-sent.scss',
})
export class EmailSentPage {
  private route = inject(ActivatedRoute);

  readonly email = this.route.snapshot.queryParamMap.get('email') ?? 'tu correo';
}
