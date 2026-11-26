import { aCsv } from './csv';

describe('aCsv', () => {
  it('escapa comillas, comas y saltos de linea', () => {
    expect(aCsv([['a', 'b,c'], ['di "x"', 'l1\nl2']])).toBe('a,"b,c"\r\n"di ""x""","l1\nl2"');
  });
});
