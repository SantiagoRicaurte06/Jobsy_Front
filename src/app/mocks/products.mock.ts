import { Product, Category } from '../core/models';
import { IMG_PRODUCTS } from './images.mock';

// TEMPORAL: reemplazar por Tienda_APi / Catalogo_api
export const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', nombre: 'Insumos de aseo', slug: 'insumos-aseo', cantidadProductos: 12 },
  { id: 'c2', nombre: 'Equipos', slug: 'equipos', cantidadProductos: 6 },
  { id: 'c3', nombre: 'Indumentaria', slug: 'indumentaria', cantidadProductos: 4 },
  { id: 'c4', nombre: 'Proteccion', slug: 'proteccion', cantidadProductos: 8 },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1', sku: 'JOBSY-KIT-001', nombre: 'Kit de Limpieza Profesional',
    categoria: 'Insumos de aseo', descripcion: 'Kit completo para limpieza profesional del hogar.',
    precio: 60000, moneda: 'COP', stock: 47, calificacion: 4.8, estado: 'publicado',
    imagenUrl: IMG_PRODUCTS['p1'],
  },
  {
    id: 'p2', sku: 'JOBSY-UNI-002', nombre: 'Uniforme Empleada de Hogar',
    categoria: 'Indumentaria', descripcion: 'Uniforme comodo y resistente para el trabajo diario.',
    precio: 75000, moneda: 'COP', stock: 8, calificacion: 4.6, estado: 'destacado',
    imagenUrl: IMG_PRODUCTS['p2'],
  },
  {
    id: 'p3', sku: 'JOBSY-GUA-003', nombre: 'Guantes Industriales x5',
    categoria: 'Proteccion', descripcion: 'Guantes de nitrilo, caja por 100 unidades.',
    precio: 22000, moneda: 'COP', stock: 2, calificacion: 4.7, estado: 'publicado',
    imagenUrl: IMG_PRODUCTS['p3'],
  },
  {
    id: 'p4', sku: 'JOBSY-TRP-004', nombre: 'Trapeador Microfibra Pro',
    categoria: 'Limpieza', descripcion: 'Trapeador de microfibra de alta absorcion.',
    precio: 38000, moneda: 'COP', stock: 33, calificacion: 4.5, estado: 'borrador',
    imagenUrl: IMG_PRODUCTS['p4'],
  },
  {
    id: 'p5', sku: 'JOBSY-ASP-005', nombre: 'Aspiradora Jobsy Premium',
    categoria: 'Equipos', descripcion: 'Aspiradora potente para uso domestico e industrial.',
    precio: 280000, moneda: 'COP', stock: 15, calificacion: 4.9, estado: 'publicado',
    imagenUrl: IMG_PRODUCTS['p5'],
  },
  {
    id: 'p6', sku: 'JOBSY-DES-006', nombre: 'Desinfectante Concentrado 5L',
    categoria: 'Insumos de aseo', descripcion: 'Desinfectante multiusos concentrado.',
    precio: 39000, moneda: 'COP', stock: 60, calificacion: 4.4, estado: 'publicado',
    imagenUrl: IMG_PRODUCTS['p6'],
  },
];
