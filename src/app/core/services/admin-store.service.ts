import { Injectable } from '@angular/core';

/**
 * Estado editable del panel de administracion.
 *
 * Mantiene productos, categorias y reportes para que el admin pueda crearlos,
 * editarlos y borrarlos, y expone las metricas derivadas (stock critico,
 * reportes abiertos, valor del inventario) que consumen el dashboard y el
 * sidebar.
 *
 * TEMPORAL: cada escritura se reemplazara por su llamada real a
 * Tienda_APi / Catalogo_api / Soporte_API.
 */
@Injectable({ providedIn: 'root' })
export class AdminStore {
  // TODO: signals de products/categories/reports, computed de metricas y
  // metodos CRUD (addProduct, updateProduct, deleteProduct, adjustStock,
  // addCategory, renameCategory, deleteCategory, setReportStatus).
}
