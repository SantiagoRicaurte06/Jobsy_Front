import { Injectable } from '@angular/core';
import { ProductReview } from '../models';

const STORAGE_KEY = 'jobsy_product_reviews';

const DEFAULT_REVIEWS: Record<string, ProductReview[]> = {
  'prod-1': [
    {
      id: 'rev-1',
      productoId: 'prod-1',
      autor: 'Carlos M.',
      calificacion: 5,
      titulo: 'Excelente calidad y durabilidad',
      comentario: 'Compré este kit para trabajos en casa y superó mis expectativas. Materiales muy resistentes y ergonómicos.',
      fotos: [],
      fecha: '2026-08-10T14:30:00Z',
      verificado: true,
    },
    {
      id: 'rev-2',
      productoId: 'prod-1',
      autor: 'Valeria R.',
      calificacion: 4,
      titulo: 'Muy buen producto',
      comentario: 'Llegó en el tiempo prometido. Todo en orden y muy completo.',
      fotos: [],
      fecha: '2026-08-18T09:15:00Z',
      verificado: true,
    },
  ],
  'prod-2': [
    {
      id: 'rev-3',
      productoId: 'prod-2',
      autor: 'Andrés P.',
      calificacion: 5,
      titulo: 'Muy recomendado',
      comentario: 'Excelente producto, tal cual como en las fotos y la descripción.',
      fotos: [],
      fecha: '2026-08-15T11:20:00Z',
      verificado: true,
    },
  ],
};

@Injectable({ providedIn: 'root' })
export class ReviewService {
  /** Obtiene las reseñas asociadas a un producto. */
  getByProductId(productId: string): ProductReview[] {
    const all = this.getAllStoredReviews();
    const storedForProduct = all.filter((r) => r.productoId === productId);
    
    // Si no hay en localStorage, usar los por defecto para ese producto (si existen)
    const defaults = DEFAULT_REVIEWS[productId] || [];
    
    // Combinar evitando duplicados por id
    const combined = [...storedForProduct];
    for (const def of defaults) {
      if (!combined.some((r) => r.id === def.id)) {
        combined.push(def);
      }
    }

    return combined.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }

  /** Agrega una nueva reseña al almacenamiento local. */
  addReview(newReview: {
    productoId: string;
    autor: string;
    calificacion: number;
    titulo: string;
    comentario: string;
    fotos?: string[];
  }): ProductReview {
    const review: ProductReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      productoId: newReview.productoId,
      autor: newReview.autor.trim() || 'Usuario de Jobsy',
      calificacion: newReview.calificacion,
      titulo: newReview.titulo.trim(),
      comentario: newReview.comentario.trim(),
      fotos: newReview.fotos || [],
      fecha: new Date().toISOString(),
      verificado: true, // temporalmente todos como verificado hasta tener backend real
    };

    const all = this.getAllStoredReviews();
    all.unshift(review);
    this.saveAllReviews(all);

    return review;
  }

  private getAllStoredReviews(): ProductReview[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as ProductReview[];
    } catch {
      return [];
    }
  }

  private saveAllReviews(reviews: ProductReview[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.error('Error guardando reseña en localStorage:', e);
    }
  }
}
