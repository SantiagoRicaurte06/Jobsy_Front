/** Tienda_APi / Catalogo_api */
export type ProductStatus = 'publicado' | 'borrador' | 'destacado' | 'agotado';

export interface Product {
  id: string;
  sku: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  precio: number;
  moneda: 'COP';
  stock: number;
  imagenUrl?: string;
  calificacion: number;
  estado: ProductStatus;
}

export interface Category {
  id: string;
  nombre: string;
  slug: string;
  cantidadProductos: number;
}

export interface CartItem {
  product: Product;
  cantidad: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  envio: number;
  total: number;
}

export interface ProductReview {
  id: string;
  productoId: string;
  autor: string;
  calificacion: number; // 1 to 5
  titulo: string;
  comentario: string;
  fotos?: string[]; // base64 or image URLs
  fecha: string; // ISO date string or relative display
  verificado?: boolean;
}

