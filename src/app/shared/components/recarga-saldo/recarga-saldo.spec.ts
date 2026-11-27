import { luhn } from './recarga-saldo';

describe('luhn', () => {
  it('acepta numeros de prueba validos y rechaza uno alterado', () => {
    expect(luhn('4111111111111111')).toBe(true);
    expect(luhn('5555555555554444')).toBe(true);
    expect(luhn('4111111111111112')).toBe(false);
  });
});
