import { Component, inject, input, signal, computed, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ProductService, CartService, ReviewService, AuthService } from '../../../core/services';
import { Product, ProductReview } from '../../../core/models';
import { CopPipe } from '../../../shared/pipes';
import { RatingStarsComponent } from '../../../shared/components/rating-stars/rating-stars';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'jobsy-product-detail',
  standalone: true,
  imports: [IconComponent, RouterLink, FormsModule, DatePipe, CopPipe, RatingStarsComponent, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './detalle-producto.html',
  styleUrl: './detalle-producto.scss',
})
export class ProductDetailPage implements OnInit {
  private productService = inject(ProductService);
  private reviewService = inject(ReviewService);
  private authService = inject(AuthService);
  private cart = inject(CartService);
  private router = inject(Router);

  readonly id = input.required<string>();

  readonly product = signal<Product | undefined>(undefined);
  readonly loading = signal(true);
  readonly cantidad = signal(1);

  // ---- Reseñas ----
  readonly reviews = signal<ProductReview[]>([]);
  readonly mostrarFormulario = signal(false);
  readonly guardandoResena = signal(false);
  readonly mensajeExito = signal<string | null>(null);
  readonly mensajeError = signal<string | null>(null);

  // Formulario
  nuevaCalificacion = 5;
  nuevoAutor = '';
  nuevoTitulo = '';
  nuevoComentario = '';
  nuevasFotos: string[] = [];

  readonly totalResenas = computed(() => this.reviews().length);

  readonly promedioCalificacion = computed(() => {
    const list = this.reviews();
    if (!list.length) return this.product()?.calificacion ?? 5;
    const sum = list.reduce((acc, r) => acc + r.calificacion, 0);
    return Number((sum / list.length).toFixed(1));
  });

  readonly distribucionEstrellas = computed(() => {
    const list = this.reviews();
    const total = list.length || 1;
    const conteo = [0, 0, 0, 0, 0]; // 1 a 5
    for (const r of list) {
      const idx = Math.min(Math.max(Math.round(r.calificacion) - 1, 0), 4);
      conteo[idx]++;
    }
    return [5, 4, 3, 2, 1].map((stars) => {
      const count = conteo[stars - 1];
      const porcentaje = Math.round((count / total) * 100);
      return { stars, count, porcentaje };
    });
  });

  ngOnInit(): void {
    const user = this.authService.user();
    if (user) {
      this.nuevoAutor = `${user.nombre} ${user.apellido || ''}`.trim();
    }

    this.productService.getById(this.id()).subscribe((p) => {
      this.product.set(p);
      this.loading.set(false);
      this.cargarResenas();
    });
  }

  cargarResenas(): void {
    const list = this.reviewService.getByProductId(this.id());
    this.reviews.set(list);
  }

  cambiarCantidad(delta: number): void {
    const max = this.product()?.stock ?? 1;
    this.cantidad.update((c) => Math.min(Math.max(c + delta, 1), max));
  }

  agregar(irAlCarrito = false): void {
    const p = this.product();
    if (!p) return;

    this.cart.add(p, this.cantidad());
    if (irAlCarrito) this.router.navigate(['/tienda/carrito']);
  }

  toggleFormulario(): void {
    this.mostrarFormulario.update((v) => !v);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  setCalificacion(estrellas: number): void {
    this.nuevaCalificacion = estrellas;
  }

  onFotosSeleccionadas(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    const maxFotos = 4;
    const maxBytes = 3 * 1024 * 1024; // 3MB por foto

    if (this.nuevasFotos.length + files.length > maxFotos) {
      this.mensajeError.set(`Puedes adjuntar un máximo de ${maxFotos} fotos.`);
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        this.mensajeError.set('Solo se permiten archivos de imagen.');
        continue;
      }

      if (file.size > maxBytes) {
        this.mensajeError.set(`La imagen "${file.name}" supera el límite de 3MB.`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (base64 && this.nuevasFotos.length < maxFotos) {
          this.nuevasFotos.push(base64);
        }
      };
      reader.readAsDataURL(file);
    }

    // Resetear input para permitir seleccionar el mismo archivo si se desea
    input.value = '';
  }

  eliminarFoto(index: number): void {
    this.nuevasFotos.splice(index, 1);
  }

  enviarResena(): void {
    this.mensajeError.set(null);
    this.mensajeExito.set(null);

    if (!this.nuevoAutor.trim()) {
      this.mensajeError.set('Por favor ingresa tu nombre.');
      return;
    }

    if (!this.nuevoTitulo.trim()) {
      this.mensajeError.set('Por favor ingresa un título para tu reseña.');
      return;
    }

    if (!this.nuevoComentario.trim() || this.nuevoComentario.trim().length < 10) {
      this.mensajeError.set('El comentario debe tener al menos 10 caracteres.');
      return;
    }

    this.guardandoResena.set(true);

    try {
      this.reviewService.addReview({
        productoId: this.id(),
        autor: this.nuevoAutor,
        calificacion: this.nuevaCalificacion,
        titulo: this.nuevoTitulo,
        comentario: this.nuevoComentario,
        fotos: [...this.nuevasFotos],
      });

      this.cargarResenas();

      // Limpiar formulario
      this.nuevoTitulo = '';
      this.nuevoComentario = '';
      this.nuevasFotos = [];
      this.nuevaCalificacion = 5;
      this.guardandoResena.set(false);
      this.mostrarFormulario.set(false);
      this.mensajeExito.set('¡Gracias por tu opinión! Tu reseña ha sido publicada con éxito.');
    } catch {
      this.guardandoResena.set(false);
      this.mensajeError.set('Ocurrió un error al guardar la reseña. Inténtalo de nuevo.');
    }
  }
}

