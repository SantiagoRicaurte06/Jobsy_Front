import { DestroyRef } from '@angular/core';

/**
 * Vuelve a cargar los datos de una pantalla mientras esta abierta: cada
 * `cadaMs` y al volver a la pestana, nunca con la pestana oculta.
 *
 * Las pantallas cargaban una sola vez al entrar, asi que un cambio hecho por
 * la otra parte (una postulacion aceptada, un pedido enviado) solo se veia
 * recargando la pagina. Se detiene al destruirse la pantalla (`destroyRef`).
 */
export function refrescarMientrasVisible(destroyRef: DestroyRef, cargar: () => void, cadaMs = 30_000): void {
  const alVolver = () => {
    if (!document.hidden) cargar();
  };
  const temporizador = setInterval(alVolver, cadaMs);
  document.addEventListener('visibilitychange', alVolver);
  destroyRef.onDestroy(() => {
    clearInterval(temporizador);
    document.removeEventListener('visibilitychange', alVolver);
  });
}
