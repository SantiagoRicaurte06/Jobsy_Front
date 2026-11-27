import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

const SELECTOR_PUNTERO = '.boton_borde, .boton_vidrio';

/**
 * Un solo oyente para todo el sitio: deja en --x/--y la posición del puntero
 * dentro del botón. El relleno de `.boton_borde` crece desde ahí y el brillo
 * de `.boton_vidrio` lo sigue. Sin este oyente los dos funcionan desde el centro.
 */
export function iniciarGestosBotones(doc: Document): () => void {
  const mover = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const boton = (e.target as Element | null)?.closest?.(SELECTOR_PUNTERO) as HTMLElement | null;
    if (!boton) return;
    const r = boton.getBoundingClientRect();
    boton.style.setProperty('--x', `${Math.round(e.clientX - r.left)}px`);
    boton.style.setProperty('--y', `${Math.round(e.clientY - r.top)}px`);
  };
  doc.addEventListener('pointerover', mover, { passive: true });
  doc.addEventListener('pointermove', mover, { passive: true });
  return () => {
    doc.removeEventListener('pointerover', mover);
    doc.removeEventListener('pointermove', mover);
  };
}

/**
 * Imán: el botón se inclina hacia el puntero cuando pasa cerca.
 * Solo con mouse y sin "reducir movimiento". Para un único llamado por página.
 *
 *   <a class="boton_lima" jobsyIman>Crear mi perfil</a>
 */
@Directive({ selector: '[jobsyIman]', standalone: true })
export class ImanDirective {
  /** Distancia en px desde el borde del botón a la que empieza a atraer. */
  readonly alcance = input(90, { alias: 'jobsyIman', transform: (v: unknown) => Number(v) || 90 });

  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement as HTMLElement;
    const destroy = inject(DestroyRef);

    afterNextRender(() => {
      const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const fino = window.matchMedia('(pointer: fine)').matches;
      if (quieto || !fino) return;

      el.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
      let cuadro = 0;
      const mover = (e: PointerEvent) => {
        cancelAnimationFrame(cuadro);
        cuadro = requestAnimationFrame(() => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const fuera = Math.max(Math.abs(dx) - r.width / 2, Math.abs(dy) - r.height / 2);
          el.style.transform = fuera < this.alcance() ? `translate(${dx * 0.18}px, ${dy * 0.28}px)` : '';
        });
      };
      window.addEventListener('pointermove', mover, { passive: true });
      destroy.onDestroy(() => {
        cancelAnimationFrame(cuadro);
        window.removeEventListener('pointermove', mover);
      });
    });
  }
}
