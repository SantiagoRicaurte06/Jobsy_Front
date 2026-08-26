import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICONS } from './icons';

/**
 * Icono SVG de Lucide, dibujado con `currentColor` y tamano 1em.
 *
 * Hereda color y tamano del texto que lo rodea; para agrandarlo basta con
 * subir el `font-size` (o `width`/`height`) desde el CSS del contenedor.
 *
 *   <jobsy-icon name="bug" />
 */
@Component({
  selector: 'jobsy-icon',
  standalone: true,
  imports: [],
  template: `<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    [attr.aria-hidden]="label() ? null : 'true'"
    [attr.role]="label() ? 'img' : null"
    [attr.aria-label]="label()"
    [innerHTML]="markup()"
  ></svg>`,
  styleUrl: './icon.scss',
})
export class IconComponent {
  private sanitizer = inject(DomSanitizer);

  /** Nombre del icono en kebab-case (ver icons.ts). */
  readonly name = input.required<string>();

  /** Si se pasa, el icono deja de ser decorativo y anuncia esta etiqueta. */
  readonly label = input<string | null>(null);

  readonly markup = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(ICONS[this.name()] ?? ''),
  );
}
