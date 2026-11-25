export type Modalidade = 'venda' | 'doacao';

export type EstadoAnuncio =
  | 'ativo'
  | 'pausado'
  | 'reservado'
  | 'vendido'
  | 'concluido';

export type EstadoConservacao = 'novo' | 'seminovo' | 'usado';

export type Ordem = 'data' | 'preco';

export type Direcao = 'asc' | 'desc';

export type TamanhoPagina = 5 | 10 | 25 | 50;

export interface Categoria {
  id: number;
  nome: string;
  slug: string;
}

export interface Curso {
  id: number;
  nome: string;
}

export interface AnuncianteResumo {
  id: number;
  nome: string;
}

export interface AnunciantePerfil extends AnuncianteResumo {
  curso: Curso;
  telefone: string | null;
  fotoUrl: string | null;
}

export interface FotoAnuncio {
  id: number;
  url: string;
  capa: boolean;
}

export interface AnuncioResumo {
  id: number;
  titulo: string;
  modalidade: Modalidade;
  preco: number | null;
  estado: EstadoAnuncio;
  estadoConservacao: EstadoConservacao;
  categoria: Categoria;
  capaUrl: string;
  anunciante: AnuncianteResumo;
  publicadoEm: string;
}

export interface AnuncioDetalhe extends AnuncioResumo {
  descricao: string;
  localEntrega: string;
  fotos: FotoAnuncio[];
  anunciante: AnunciantePerfil;
  atualizadoEm: string;
}

export interface Pagina<T> {
  itens: T[];
  pagina: number;
  tamanho: number;
  total: number;
  totalPaginas: number;
}

export interface FiltrosAnuncios {
  modalidade: Modalidade;
  categoria?: string;
  precoMin?: number;
  precoMax?: number;
  ordem?: Ordem;
  direcao?: Direcao;
  pagina?: number;
  tamanho?: TamanhoPagina;
}