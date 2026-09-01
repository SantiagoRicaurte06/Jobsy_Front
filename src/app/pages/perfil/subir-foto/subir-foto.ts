import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProfileService } from '../../../core/services';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'jobsy-upload-photo',
  standalone: true,
  imports: [IconComponent, RouterLink],
  templateUrl: './subir-foto.html',
  styleUrl: './subir-foto.scss',
})
export class UploadPhotoPage {
  private profileService = inject(ProfileService);
  private router = inject(Router);

  readonly preview = signal('');
  readonly archivo = signal<File | null>(null);
  readonly subiendo = signal(false);
  readonly error = signal('');

  onFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      this.error.set('La imagen supera los 2 MB.');
      return;
    }

    this.error.set('');
    this.archivo.set(file);
    this.preview.set(URL.createObjectURL(file));
  }

  quitar(): void {
    this.preview.set('');
    this.archivo.set(null);
  }

  subir(): void {
    const file = this.archivo();
    if (!file) return;

    this.subiendo.set(true);
    this.profileService.uploadPhoto(file).subscribe(() => {
      this.router.navigate(['/app/perfil']);
    });
  }
}
