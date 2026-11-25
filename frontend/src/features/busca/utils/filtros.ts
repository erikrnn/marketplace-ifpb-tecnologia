import type {
  FiltrosAnuncios,
  Modalidade,
  TamanhoPagina,
} from '../types/anuncio';

function lerPreco(valor: string | null): number | undefined {
  if (valor === null || valor.trim() === '') {
    return undefined;
  }

  const numero = Number(valor);

  return Number.isFinite(numero) && numero >= 0
    ? numero
    : undefined;
}

export function lerFiltros(
  parametros: URLSearchParams,
  modalidade: Modalidade,
): FiltrosAnuncios {
  const pagina = Number(parametros.get('pagina'));
  const tamanho = Number(parametros.get('tamanho'));

  const precoMin = lerPreco(parametros.get('precoMin'));
  const precoMax = lerPreco(parametros.get('precoMax'));

  const faixaValida =
    precoMin === undefined ||
    precoMax === undefined ||
    precoMin <= precoMax;

  return {
    modalidade,
    categoria: parametros.get('categoria') || undefined,

    precoMin:
      modalidade === 'venda' && faixaValida
        ? precoMin
        : undefined,

    precoMax:
      modalidade === 'venda' && faixaValida
        ? precoMax
        : undefined,

    ordem:
      modalidade === 'venda' &&
      parametros.get('ordem') === 'preco'
        ? 'preco'
        : 'data',

    direcao:
      parametros.get('direcao') === 'asc'
        ? 'asc'
        : 'desc',

    pagina:
      Number.isInteger(pagina) && pagina > 0
        ? pagina
        : 1,

    tamanho: [5, 10, 25, 50].includes(tamanho)
      ? (tamanho as TamanhoPagina)
      : 10,
  };
}