import { erroDeRede, mensagemPadrao } from './erro';
import { montarFormDataCriar, montarFormDataEditar } from './formData';
import type {
  AnuncioDetalhe,
  Categoria,
  EntradaCriar,
  EntradaEditar,
  ErroApi,
  EstadoAnuncio,
  OpcaoEstadoConservacao,
} from './tipos';

export const API_URL: string =
  // Vite: VITE_API_URL; padrão do backend do professor.
  ((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_URL) ??
  'http://localhost:8080';

async function requisitar<T>(
  caminho: string,
  token: string | null,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  // Content-Type NUNCA é definido à mão para FormData (o navegador inclui o boundary).

  let resp: Response;
  try {
    resp = await fetch(`${API_URL}${caminho}`, { ...init, headers });
  } catch {
    throw erroDeRede();
  }

  if (!resp.ok) {
    let corpo: { mensagem?: string; campos?: Record<string, string> } = {};
    try {
      corpo = await resp.json();
    } catch {
      /* corpo vazio ou não JSON */
    }
    const erro: ErroApi = {
      status: resp.status,
      mensagem: corpo.mensagem || mensagemPadrao(resp.status),
      campos: corpo.campos ?? {},
    };
    throw erro;
  }
  return (await resp.json()) as T;
}

/** GET /anuncios/{id} — detalhe em qualquer estado. */
export function buscarAnuncio(id: number, token: string | null) {
  return requisitar<AnuncioDetalhe>(`/anuncios/${id}`, token);
}

/** POST /anuncios (multipart). Cria já ativo. */
export function criarAnuncio(entrada: EntradaCriar, token: string | null) {
  return requisitar<AnuncioDetalhe>('/anuncios', token, {
    method: 'POST',
    body: montarFormDataCriar(entrada),
  });
}

/** PUT /anuncios/{id} (multipart). Reenvia todos os campos. */
export function editarAnuncio(entrada: EntradaEditar, token: string | null) {
  return requisitar<AnuncioDetalhe>(`/anuncios/${entrada.id}`, token, {
    method: 'PUT',
    body: montarFormDataEditar(entrada),
  });
}

/** PATCH /anuncios/{id}/estado — corpo JSON { estado }. */
export function alterarEstadoAnuncio(id: number, estado: EstadoAnuncio, token: string | null) {
  return requisitar<AnuncioDetalhe>(`/anuncios/${id}/estado`, token, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado }),
  });
}

/** GET /categorias (público). Usar o `id` ao criar/editar; o `slug` é só do filtro de busca. */
export function listarCategorias() {
  return requisitar<Categoria[]>('/categorias', null);
}

/** GET /estados-conservacao (público). { valor, rotulo }. */
export function listarEstadosConservacao() {
  return requisitar<OpcaoEstadoConservacao[]>('/estados-conservacao', null);
}
