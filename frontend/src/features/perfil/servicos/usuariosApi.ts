import type { AnuncioResumo, DadosUsuario, Pagina, Perfil, Usuario } from '../../../tipos/api';
import { requisitar } from './http';

// GET /usuarios/eu: dados do usuário logado
export function buscarUsuarioLogado(): Promise<Usuario> {
    return requisitar<Usuario>('/usuarios/eu');
}

// PUT /usuarios/eu: edita nome, curso e telefone (JSON)
export function atualizarUsuarioLogado(dados: DadosUsuario): Promise<Usuario> {
    return requisitar<Usuario>('/usuarios/eu', { metodo: 'PUT', json: dados });
}

// PUT /usuarios/eu/foto: foto de perfil (multipart, campo "foto")
export function enviarFotoPerfil(arquivo: File): Promise<Usuario> {
    const formData = new FormData();
    formData.append('foto', arquivo);
    return requisitar<Usuario>('/usuarios/eu/foto', { metodo: 'PUT', formData });
}

// GET /usuarios/{id}: perfil público de um estudante
export function buscarPerfil(id: number): Promise<Perfil> {
    return requisitar<Perfil>(`/usuarios/${id}`);
}

// GET /usuarios/{id}/anuncios: o dono vê todos; os outros, só os ativos
// (quem filtra é o backend). Mais recentes primeiro.
export function listarAnunciosDoUsuario(
    id: number,
    pagina: number,
    tamanho: number,
): Promise<Pagina<AnuncioResumo>> {
    return requisitar<Pagina<AnuncioResumo>>(
        `/usuarios/${id}/anuncios?pagina=${pagina}&tamanho=${tamanho}`,
    );
}