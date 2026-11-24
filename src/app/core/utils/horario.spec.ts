import { describe, expect, it } from 'vitest';
import { describirHorario, diaDe, horaLegible, leerHorario } from './horario';

describe('leerHorario', () => {
  it('lee el formato que valida el middleware', () => {
    expect(leerHorario('Lun, Mie · 08:00 a 12:00')).toEqual({ dias: ['Lun', 'Mie'], inicio: '08:00', fin: '12:00' });
  });

  it('expande rangos de días', () => {
    expect(leerHorario('Lun-Sab: 9:30 am - 4:00 pm')).toEqual({
      dias: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'], inicio: '09:30', fin: '16:00',
    });
  });

  it('entiende nombres completos con o sin tilde', () => {
    expect(leerHorario('Sábados: 8:30 am - 4:30 pm').dias).toEqual(['Sab']);
    expect(leerHorario('martes y jueves').dias).toEqual(['Mar', 'Jue']);
  });

  it('reconoce días sueltos con tilde', () => {
    expect(diaDe('Miércoles')).toBe('Mie');
    expect(diaDe('SÁBADO')).toBe('Sab');
    expect(diaDe('feriado')).toBeNull();
  });

  it('tolera textos sin horario', () => {
    expect(leerHorario('')).toEqual({ dias: [], inicio: null, fin: null });
    expect(leerHorario(undefined).dias).toEqual([]);
  });
});

describe('describirHorario', () => {
  it('arma una frase legible', () => {
    expect(describirHorario(leerHorario('Lun, Mie, Vie · 08:00 a 12:30'))).toBe(
      'lunes, miércoles y viernes, de 8 a. m. a 12:30 p. m.',
    );
  });

  it('convierte a formato de 12 horas', () => {
    expect(horaLegible('00:15')).toBe('12:15 a. m.');
    expect(horaLegible('16:00')).toBe('4 p. m.');
  });
});
