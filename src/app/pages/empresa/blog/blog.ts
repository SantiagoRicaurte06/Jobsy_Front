import { Component, signal, computed } from '@angular/core';
import { IconComponent } from '../../../shared/components/icon/icon';

interface Post {
  id: string;
  titulo: string;
  resumen: string;
  categoria: string;
  fecha: string;
  minutos: number;
  imagen: string;
}

/** Blog institucional: consejos para empleadores y empleados del hogar. */
@Component({
  selector: 'jobsy-blog',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class BlogPage {
  private foto(id: string): string {
    return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=700&h=460&q=75`;
  }

  readonly categorias = ['Todos', 'Para empleadores', 'Para empleados', 'Seguridad', 'Novedades Jobsy'];
  readonly categoriaActiva = signal('Todos');

  readonly posts: Post[] = [
    {
      id: 'p1',
      titulo: '5 preguntas clave antes de contratar servicio domestico',
      resumen:
        'Una guia corta para verificar experiencia, referencias y disponibilidad antes de agendar la primera visita.',
      categoria: 'Para empleadores',
      fecha: '12 ago 2026',
      minutos: 4,
      imagen: this.foto('1581578731548-c64695cc6952'),
    },
    {
      id: 'p2',
      titulo: 'Como armar un perfil que consiga mas ofertas',
      resumen:
        'Fotos, descripcion y disponibilidad: los tres ajustes que mas mejoran la visibilidad de tu perfil en Jobsy.',
      categoria: 'Para empleados',
      fecha: '30 jul 2026',
      minutos: 5,
      imagen: this.foto('1600585154340-be6161a56a0c'),
    },
    {
      id: 'p3',
      titulo: 'Verificacion de identidad: como protegemos cada perfil',
      resumen:
        'Repasamos el proceso que sigue Jobsy para validar documentos y referencias antes de publicar un perfil.',
      categoria: 'Seguridad',
      fecha: '18 jul 2026',
      minutos: 6,
      imagen: this.foto('1521791136064-7986c2920216'),
    },
    {
      id: 'p4',
      titulo: 'Nueva tienda Jobsy: insumos de aseo con envio en Yopal',
      resumen:
        'Lanzamos la tienda dentro de la app para que compres los insumos de limpieza que usas todos los dias.',
      categoria: 'Novedades Jobsy',
      fecha: '02 jul 2026',
      minutos: 3,
      imagen: this.foto('1563453392212-326f5e854473'),
    },
    {
      id: 'p5',
      titulo: 'Jardineria basica: mantenimiento mes a mes',
      resumen:
        'Una checklist simple para dejar cualquier jardin en buen estado durante todo el ano.',
      categoria: 'Para empleados',
      fecha: '20 jun 2026',
      minutos: 4,
      imagen: this.foto('1529303906282-705ca092db6f'),
    },
    {
      id: 'p6',
      titulo: 'Como calificar bien y por que importa',
      resumen:
        'Las calificaciones alimentan la confianza de toda la comunidad. Te contamos como dejar una buena resena.',
      categoria: 'Para empleadores',
      fecha: '05 jun 2026',
      minutos: 3,
      imagen: this.foto('1585183575305-750ab15467b6'),
    },
  ];

  readonly postsFiltrados = computed(() => {
    const cat = this.categoriaActiva();
    if (cat === 'Todos') return this.posts;
    return this.posts.filter((p) => p.categoria === cat);
  });

  setCategoria(cat: string): void {
    this.categoriaActiva.set(cat);
  }
}
