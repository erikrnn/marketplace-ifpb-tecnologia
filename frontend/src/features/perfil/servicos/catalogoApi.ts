import type { Curso } from '../../../tipos/api';
import { requisitar } from './http';

// GET /cursos: público, usado no <select> da edição de perfil
export function listarCursos(): Promise<Curso[]> {
    return requisitar<Curso[]>('/cursos', { publico: true });
}