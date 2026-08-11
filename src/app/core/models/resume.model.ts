/** Usuarios_Api — hoja de vida */
export interface Resume {
  id: string;
  userId: string;
  resumenProfesional: string;
  experiencias: { cargo: string; empresa: string; desde: string; hasta?: string; descripcion: string }[];
  educacion: { titulo: string; institucion: string; ano: string }[];
  habilidades: string[];
  certificaciones: string[];
  archivoUrl?: string;
}
