import type {
  AnuncioDetalhe,
  AnuncioResumo,
  Categoria,
  FiltrosAnuncios,
  Pagina,
} from '../types/anuncio';

const API_URL = 'http://localhost:8080';

async function requisitar<T>(
  caminho: string,
  token?: string,
  signal?: AbortSignal,
): Promise<T> {
  const headers = new Headers();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const resposta = await fetch(`${API_URL}${caminho}`, {
    headers,
    signal,
  });

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => null);

    throw new Error(
      erro?.mensagem || `Erro na requisição: ${resposta.status}`,
    );
  }

  return resposta.json() as Promise<T>;
}

export async function buscarCategorias(
  signal?: AbortSignal,
): Promise<Categoria[]> {
  return requisitar<Categoria[]>('/categorias', undefined, signal);
}

export async function buscarAnuncios(
  filtros: FiltrosAnuncios,
  token: string,
  signal?: AbortSignal,
): Promise<Pagina<AnuncioResumo>> {
  const parametros = new URLSearchParams();

  parametros.set('modalidade', filtros.modalidade);

  if (filtros.categoria) {
    parametros.set('categoria', filtros.categoria);
  }

  if (filtros.modalidade === 'venda') {
    if (filtros.precoMin !== undefined) {
      parametros.set('precoMin', String(filtros.precoMin));
    }

    if (filtros.precoMax !== undefined) {
      parametros.set('precoMax', String(filtros.precoMax));
    }
  }

  const ordem =
    filtros.modalidade === 'doacao'
      ? 'data'
      : filtros.ordem ?? 'data';

  parametros.set('ordem', ordem);
  parametros.set('direcao', filtros.direcao ?? 'desc');
  parametros.set('pagina', String(filtros.pagina ?? 1));
  parametros.set('tamanho', String(filtros.tamanho ?? 10));

  return requisitar<Pagina<AnuncioResumo>>(
    `/anuncios?${parametros.toString()}`,
    token,
    signal,
  );
}

export async function buscarAnuncioPorId(
  id: number,
  token: string,
  signal?: AbortSignal,
): Promise<AnuncioDetalhe> {
  return requisitar<AnuncioDetalhe>(
    `/anuncios/${id}`,
    token,
    signal,
  );
}