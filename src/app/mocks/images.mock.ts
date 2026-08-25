/**
 * Imagenes de demostracion.
 *
 * Fotos: Unsplash (licencia libre, uso comercial permitido, sin atribucion
 * obligatoria). Se cargan por hotlink desde su CDN.
 *
 * Avatares: DiceBear. Son ilustraciones generadas, NO fotos de personas
 * reales; asi ningun rostro real queda asociado a un perfil ficticio.
 *
 * TEMPORAL: cuando el backend real sirva imagenes, estas URLs se reemplazan
 * por las que devuelvan Empleo_API, Tienda_APi y Usuarios_Api.
 */

const UNSPLASH = 'https://images.unsplash.com/photo-';

/** Anade parametros de recorte para no descargar el original completo. */
function foto(id: string, w = 800, h = 600): string {
  return `${UNSPLASH}${id}?auto=format&fit=crop&w=${w}&h=${h}&q=75`;
}

/** Avatar ilustrado y determinista a partir de un nombre. */
export function avatar(seed: string): string {
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=d6eaf8`;
}

// ---- Viviendas (ofertas de empleo) ----
export const IMG_JOBS: Record<string, string> = {
  j1: foto('1568605114967-8130f3a36994'), // casa familiar al anochecer
  j2: foto('1600607687939-ce8a6c25118c'), // salon de apartamento moderno
  j3: foto('1570129477492-45c003edd2be'), // casa blanca con porche
  j4: foto('1600596542815-ffad4c1539a9'), // villa de lujo con piscina
  j5: foto('1584622650111-993a426fbf0a'), // bano moderno de apartamento
  j6: foto('1449844908441-8829872d2607'), // casa pequena entre arboles
};

// ---- Productos de la tienda ----
export const IMG_PRODUCTS: Record<string, string> = {
  p1: foto('1563453392212-326f5e854473', 600, 600), // spray de limpieza
  p2: foto('1581578731548-c64695cc6952', 600, 600), // persona limpiando
  p3: foto('1585421514738-01798e348b17', 600, 600), // guantes de proteccion
  p4: foto('1610557892470-55d9e80c0bce', 600, 600), // lavanderia
  p5: foto('1527515637462-cff94eecc1ac', 600, 600), // aspiradora
  p6: foto('1563453392212-326f5e854473', 600, 600), // desinfectante
};

// ---- Imagenes de las secciones publicas ----
export const IMG_SITE = {
  /** Hero de la portada: profesional del hogar trabajando. */
  hero: foto('1581578731548-c64695cc6952', 900, 700),
  /** Seccion "sobre nosotros": acuerdo entre dos personas. */
  about: foto('1521791136064-7986c2920216', 800, 600),
  /** Cabecera de la busqueda de empleo. */
  jobsBanner: foto('1600585154340-be6161a56a0c', 1200, 400),
};
