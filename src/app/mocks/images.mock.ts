/**
 * Imagenes de demostracion.
 *
 * Fotos: Unsplash (licencia libre, uso comercial permitido) por hotlink.
 * Avatares: DiceBear — ilustraciones generadas, NO fotos de personas reales,
 * para no asociar un rostro real a un perfil ficticio.
 *
 * TEMPORAL: cuando el backend sirva imagenes, estas URLs se reemplazan por
 * las que devuelvan Empleo_API, Tienda_APi y Usuarios_Api.
 */

// TODO: constantes IMG_JOBS, IMG_PRODUCTS e IMG_SITE, y helper avatar(seed).
export const IMG_JOBS: Record<string, string> = {};
export const IMG_PRODUCTS: Record<string, string> = {};
export const IMG_SITE = { hero: '', about: '', jobsBanner: '' };

export function avatar(seed: string): string {
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
}
