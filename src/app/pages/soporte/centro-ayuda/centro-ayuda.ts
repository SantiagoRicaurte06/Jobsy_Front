import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/components/icon/icon';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { CANALES_SOPORTE } from '../canales';

type TemaId = 'hogar' | 'trabajo' | 'tienda' | 'cuenta';

interface Tema {
  id: TemaId;
  icon: string;
  titulo: string;
}

interface Faq {
  id: string;
  tema: TemaId;
  pregunta: string;
  respuesta: string;
  /** Pantalla donde se resuelve, si existe. */
  enlace?: { texto: string; ruta: string };
}

/** Trozo de texto con o sin coincidencia de la búsqueda, para pintar <mark>. */
interface Trozo {
  texto: string;
  marca: boolean;
}

const sinTildes = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Parte el texto en trozos marcando dónde aparece la búsqueda (sin importar tildes). */
function marcar(texto: string, q: string): Trozo[] {
  if (!q) return [{ texto, marca: false }];
  const base = sinTildes(texto);
  const trozos: Trozo[] = [];
  let desde = 0;
  let i = base.indexOf(q);
  while (i >= 0) {
    if (i > desde) trozos.push({ texto: texto.slice(desde, i), marca: false });
    trozos.push({ texto: texto.slice(i, i + q.length), marca: true });
    desde = i + q.length;
    i = base.indexOf(q, desde);
  }
  if (desde < texto.length) trozos.push({ texto: texto.slice(desde), marca: false });
  return trozos;
}

/**
 * Centro de ayuda: la búsqueda manda. Cada respuesta marca lo que coincide
 * y, cuando hay una pantalla donde se resuelve, lleva directo a ella.
 */
@Component({
  selector: 'jobsy-centro-ayuda',
  standalone: true,
  imports: [RouterLink, IconComponent, EmptyStateComponent],
  templateUrl: './centro-ayuda.html',
  styleUrl: './centro-ayuda.scss',
})
export class HelpCenterPage {
  readonly canales = CANALES_SOPORTE;

  readonly temas: Tema[] = [
    { id: 'hogar', icon: 'house', titulo: 'Contratar ayuda' },
    { id: 'trabajo', icon: 'briefcase', titulo: 'Buscar trabajo' },
    { id: 'tienda', icon: 'shopping-cart', titulo: 'Tienda y pagos' },
    { id: 'cuenta', icon: 'shield-check', titulo: 'Cuenta y seguridad' },
  ];

  readonly faqs: Faq[] = [
    {
      id: 'costo', tema: 'hogar',
      pregunta: '¿Cómo sé cuánto me va a costar la semana?',
      respuesta:
        'En la portada arma tu semana: eliges el oficio, los días y las horas, y ves el costo estimado al instante. En la lista de personas, cada perfil con tarifa te dice cuánto costaría tu semana con esa persona.',
      enlace: { texto: 'Ver personas', ruta: '/empleados' },
    },
    {
      id: 'verificado', tema: 'hogar',
      pregunta: '¿Qué significa que un perfil esté verificado?',
      respuesta:
        'Validamos el documento de identidad y al menos una referencia antes de publicar el perfil. Los perfiles verificados llevan el sello verde.',
    },
    {
      id: 'directo', tema: 'hogar',
      pregunta: '¿Contrato directo o publico una oferta?',
      respuesta:
        'Contrata directo si ya viste a alguien que te sirve. Publica una oferta si prefieres que las personas se postulen y comparar antes de decidir.',
      enlace: { texto: 'Publicar una oferta', ruta: '/publicar-oferta' },
    },
    {
      id: 'contrataciones', tema: 'hogar',
      pregunta: '¿Dónde veo las personas que contraté?',
      respuesta: 'En Contrataciones, dentro de tu cuenta, ves cada acuerdo con sus días, horario y estado.',
      enlace: { texto: 'Ir a Contrataciones', ruta: '/app/contrataciones' },
    },
    {
      id: 'postular', tema: 'trabajo',
      pregunta: '¿Cómo me postulo a una oferta?',
      respuesta:
        'Entra al detalle de la oferta y presiona "Postularme". Antes de enviar te pedimos confirmar tu hoja de vida.',
      enlace: { texto: 'Ver ofertas', ruta: '/empleos' },
    },
    {
      id: 'dias', tema: 'trabajo',
      pregunta: '¿Cómo encuentro ofertas que encajen con mis días?',
      respuesta:
        'En Empleos marca los días que puedes trabajar. Cada oferta te muestra cuántos de tus días coinciden y cuánto pagaría por semana, y la lista se ordena de la que más paga a la que menos.',
      enlace: { texto: 'Marcar mis días', ruta: '/empleos' },
    },
    {
      id: 'retirar', tema: 'trabajo',
      pregunta: '¿Puedo cambiar una postulación después de enviarla?',
      respuesta:
        'Puedes retirarla desde Mis postulaciones y volver a postularte con los datos actualizados mientras la oferta siga abierta.',
      enlace: { texto: 'Ir a Mis postulaciones', ruta: '/app/mis-postulaciones' },
    },
    {
      id: 'pagos', tema: 'tienda',
      pregunta: '¿Qué métodos de pago aceptan en la tienda?',
      respuesta: 'PSE, tarjeta de crédito o débito, Nequi, Daviplata o saldo Jobsy. Eliges el método en el último paso de la compra.',
    },
    {
      id: 'envio', tema: 'tienda',
      pregunta: '¿Cuánto cuesta y cuánto tarda el envío?',
      respuesta:
        'El envío es fijo: $8.000 por pedido. Dentro de Yopal se entrega en 24 a 48 horas hábiles después de confirmado el pago.',
      enlace: { texto: 'Ir a la tienda', ruta: '/tienda' },
    },
    {
      id: 'pedidos', tema: 'tienda',
      pregunta: '¿Dónde sigo mis pedidos?',
      respuesta: 'En Mis pedidos, dentro de tu cuenta, ves el estado de cada compra.',
      enlace: { texto: 'Ir a Mis pedidos', ruta: '/app/pedidos' },
    },
    {
      id: 'contrasena', tema: 'cuenta',
      pregunta: '¿Cómo cambio mi contraseña?',
      respuesta: 'Desde Configuración, en el menú de tu cuenta, puedes actualizarla cuando quieras.',
      enlace: { texto: 'Ir a Configuración', ruta: '/app/configuracion' },
    },
    {
      id: 'plan', tema: 'cuenta',
      pregunta: '¿Puedo cambiar o cancelar mi plan?',
      respuesta: 'Sí, en cualquier momento. Los cambios se aplican en el siguiente ciclo de facturación.',
      enlace: { texto: 'Ver mi plan', ruta: '/app/cuenta/plan' },
    },
  ];

  /** Atajos bajo el buscador: abren la respuesta directamente. */
  readonly masBuscadas = ['costo', 'postular', 'envio', 'contrasena'].map((id) => this.faqs.find((f) => f.id === id)!);

  readonly termino = signal('');
  readonly tema = signal<TemaId | null>(null);
  readonly abierta = signal<string | null>(null);

  private readonly q = computed(() => sinTildes(this.termino().trim()));

  readonly conteoPorTema = computed(() => {
    const q = this.q();
    const n: Record<string, number> = {};
    for (const f of this.faqs) {
      if (!q || sinTildes(f.pregunta + ' ' + f.respuesta).includes(q)) n[f.tema] = (n[f.tema] ?? 0) + 1;
    }
    return n;
  });

  readonly resultados = computed(() => {
    const q = this.q();
    const t = this.tema();
    return this.faqs
      .filter((f) => (!t || f.tema === t) && (!q || sinTildes(f.pregunta + ' ' + f.respuesta).includes(q)))
      .map((f) => ({ ...f, preguntaMarcada: marcar(f.pregunta, q), respuestaMarcada: marcar(f.respuesta, q) }));
  });

  /** Agrupadas por tema, en el orden de los temas. */
  readonly grupos = computed(() =>
    this.temas
      .map((t) => ({ tema: t, faqs: this.resultados().filter((f) => f.tema === t.id) }))
      .filter((g) => g.faqs.length > 0),
  );

  buscar(valor: string): void {
    this.termino.set(valor);
    // Con una sola coincidencia, se abre sola.
    const r = this.resultados();
    this.abierta.set(valor.trim() && r.length === 1 ? r[0].id : null);
  }

  elegirTema(id: TemaId | null): void {
    this.tema.set(this.tema() === id ? null : id);
  }

  alternar(id: string): void {
    this.abierta.set(this.abierta() === id ? null : id);
  }

  abrir(f: Faq): void {
    this.termino.set('');
    this.tema.set(null);
    this.abierta.set(f.id);
    setTimeout(() => document.getElementById('faq-' + f.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  }

  limpiar(): void {
    this.termino.set('');
    this.tema.set(null);
  }
}
