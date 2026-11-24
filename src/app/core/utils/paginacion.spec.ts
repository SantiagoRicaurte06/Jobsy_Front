import { describe, expect, it } from 'vitest';
import { paginasDisponibles, textoTotal } from './paginacion';

const pagina = (page: number, totalPages: number, hasMore?: boolean) => ({
  items: [], page, pageSize: 6, total: totalPages * 6, totalPages, hasMore,
});

describe('paginasDisponibles', () => {
  it('respeta el total cuando no hay mas paginas', () => {
    expect(paginasDisponibles(pagina(2, 3, false))).toBe(3);
  });

  it('ofrece la siguiente pagina aunque el total estimado se quede corto', () => {
    expect(paginasDisponibles(pagina(3, 3, true))).toBe(4);
  });

  it('nunca devuelve cero paginas', () => {
    expect(paginasDisponibles({ items: [], page: 1, pageSize: 6, total: 0, totalPages: 0 })).toBe(1);
  });
});

describe('textoTotal', () => {
  it('usa singular solo con un resultado exacto', () => {
    expect(textoTotal(1, false, 'perfil', 'perfiles')).toBe('1 perfil');
    expect(textoTotal(1, true, 'perfil', 'perfiles')).toBe('1+ perfiles');
  });

  it('marca con + el total que es cota inferior', () => {
    expect(textoTotal(12, true, 'oferta', 'ofertas')).toBe('12+ ofertas');
    expect(textoTotal(12, false, 'oferta', 'ofertas')).toBe('12 ofertas');
  });
});
