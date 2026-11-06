import * as R from './reglas';

// Los mismos casos que MID_JOBSY/services/validacion_test.go: si uno cambia,
// el otro tambien.
describe('reglas de validacion', () => {
  it('direccion', () => {
    for (const d of ['Calle 10 # 20-30', 'Cra 84 # 65-22', 'Cl 7 No. 33-15 apto 201', 'Diagonal 5B bis # 4-10',
      'Transversal 3 N° 12-04', 'Vía 40 # 10-5', 'Vereda La Esperanza', 'Km 5 vía Aguazul', 'Manzana 4 Casa 12']) {
      expect(R.direccion(d), d).toBeNull();
    }
    for (const d of ['', '1', 'asdf', 'Calle', 'Calle 10', 'Calle 10 # 20', 'mi casa azul', '# 20-30']) {
      expect(R.direccion(d), d).not.toBeNull();
    }
  });

  it('horario y franja', () => {
    expect(R.horario(['lun', 'mie'], '08:00', '12:00')).toBeNull();
    expect(R.horario([], '08:00', '12:00')).not.toBeNull();
    expect(R.horario(['lun'], '14:00', '08:00')).not.toBeNull();
    expect(R.horario(['lun'], '08:00', '08:00')).not.toBeNull();
    expect(R.componerHorario(['mie', 'lun'], '08:00', '12:00')).toBe('Lun, Mie · 08:00 a 12:00');
  });

  it('telefono', () => {
    for (const t of ['3101234567', '+57 310 123 4567', '310-123-4567', '6017654321']) expect(R.telefono(t), t).toBeNull();
    for (const t of ['abc', '123', '2101234567', '31012345678', '']) expect(R.telefono(t), t).not.toBeNull();
  });

  it('hora, nombre y documento', () => {
    for (const h of ['00:00', '08:30', '23:59']) expect(R.hora(h), h).toBeNull();
    for (const h of ['24:00', '99:99', '8:00', '']) expect(R.hora(h), h).not.toBeNull();
    for (const n of ['Laura', 'María José', "O'Neil", 'Rincón-Pérez']) expect(R.nombrePersona('El nombre', n), n).toBeNull();
    for (const n of ['123', 'a', 'Laura2', '  ', 'Ana  María']) expect(R.nombrePersona('El nombre', n), n).not.toBeNull();
    expect(R.documento('1020304050', true)).toBeNull();
    expect(R.documento('abc', true)).not.toBeNull();
    expect(R.documento('AB12345', false)).toBeNull();
  });

  it('fechas y rangos', () => {
    expect(R.fechaServicio(R.hoyISO())).toBeNull();
    expect(R.fechaServicio(R.hoyISO(-1))).not.toBeNull();
    expect(R.fechaServicio(R.hoyISO(0, 2))).not.toBeNull();
    expect(R.fechaNacimiento(R.hoyISO(0, -10))).not.toBeNull();
    expect(R.fechaNacimiento(R.hoyISO(0, -30))).toBeNull();
    expect(R.anio('abcd')).not.toBeNull();
    expect(R.anio('2012')).toBeNull();
    expect(R.tarifa(1)).not.toBeNull();
    expect(R.tarifa(99_999_999)).not.toBeNull();
    expect(R.tarifa(25000)).toBeNull();
  });
});
