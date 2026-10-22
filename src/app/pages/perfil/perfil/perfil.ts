import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { EmployeeService, ProfileService } from '../../../core/services';
import { Employee, User, UserDocument, UserDocumentType } from '../../../core/models';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'jobsy-profile',
  standalone: true,
  imports: [IconComponent, RouterLink, RatingStarsComponent, LoadingSpinnerComponent, DatePipe, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class ProfilePage implements OnInit {
  private profileService = inject(ProfileService);
  private employeeService = inject(EmployeeService);

  readonly user = signal<User | undefined>(undefined);
  /** Ficha publica del empleado (especialidades, calificacion, servicios). */
  readonly empleado = signal<Employee | undefined>(undefined);
  readonly cargando = signal(true);

  readonly documentos = signal<UserDocument[]>([]);
  readonly tiposDocumento: { value: UserDocumentType; label: string }[] = [
    { value: 'antecedentes', label: 'Certificado de antecedentes' },
    { value: 'foto', label: 'Foto del documento de identidad' },
    { value: 'hoja_vida', label: 'Hoja de vida (PDF)' },
  ];
  readonly tipoElegido = signal<UserDocumentType>('antecedentes');
  readonly subiendo = signal(false);
  readonly errorDocumento = signal('');
  private archivo: File | null = null;

  ngOnInit(): void {
    this.profileService.me().subscribe((u) => {
      this.user.set(u);
      this.cargando.set(false);
      if (u.rol === 'empleado') {
        this.employeeService.getById(u.id).subscribe((e) => this.empleado.set(e));
      }
    });
    this.profileService.documents().subscribe((d) => this.documentos.set(d));
  }

  nombreTipo(tipo: UserDocumentType): string {
    return this.tiposDocumento.find((t) => t.value === tipo)?.label ?? tipo;
  }

  elegirArchivo(event: Event): void {
    this.archivo = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.errorDocumento.set('');
  }

  subirDocumento(): void {
    if (!this.archivo) {
      this.errorDocumento.set('Elige un archivo.');
      return;
    }
    this.subiendo.set(true);
    this.profileService.uploadDocument(this.archivo, this.tipoElegido()).subscribe({
      next: (d) => {
        this.documentos.update((lista) => [d, ...lista]);
        this.archivo = null;
        this.subiendo.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errorDocumento.set(err?.error?.error?.mensaje ?? 'No pudimos subir el documento.');
        this.subiendo.set(false);
      },
    });
  }
}
