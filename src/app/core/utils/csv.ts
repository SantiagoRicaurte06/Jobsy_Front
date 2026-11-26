/** Celda CSV: entre comillas si lleva separador, comillas o saltos de linea. */
function celda(v: unknown): string {
  const s = v == null ? '' : String(v);
  return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Arma el texto CSV de una tabla (filas de celdas). */
export function aCsv(filas: unknown[][]): string {
  return filas.map((f) => f.map(celda).join(',')).join('\r\n');
}

/** Descarga un CSV; el BOM hace que Excel lea bien tildes y eñes. */
export function descargarCsv(nombre: string, filas: unknown[][]): void {
  const blob = new Blob(['﻿' + aCsv(filas)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}
