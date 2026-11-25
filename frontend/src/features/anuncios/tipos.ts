// Tipos espelhando exatamente os DTOs do backend (pacote br.edu.ifpb.marketplace.anuncio).

export type Modalidade = 'venda' | 'doacao';
export type EstadoAnuncio = 'ativo' | 'pausado' | 'reservado' | 'vendido' | 'concluido';
export type EstadoConservacao = 'novo' | 'seminovo' | 'usado';

export interface Categoria {
  id: number;
  nome: string;
  slug: string;
}

export interface OpcaoEstadoConservacao {
  valor: EstadoConservacao;
  rotulo: string;
}

export interface FotoAnuncio {
  id: number;
  /** URL assinada, vale 1 hora. Nunca persistir. */
  url: string;
  capa: boolean;
}

export interface Anunciante {
  id: number;
  nome: string;
  curso?: { id: number; nome: string } | null;
  telefone?: string | null;
  fotoUrl?: string | null;
}

export interface AnuncioDetalhe {
  id: number;
  titulo: string;
  descricao: string;
  modalidade: Modalidade;
  /** Em reais; null em doações. */
  preco: number | null;
  estado: EstadoAnuncio;
  estadoConservacao: EstadoConservacao;
  categoria: Categoria;
  localEntrega: string;
  capaUrl: string | null;
  fotos: FotoAnuncio[];
  anunciante: Anunciante;
  publicadoEm: string;
  atualizadoEm: string;
}

/** Valores do formulário (estado local da tela). Preço como texto digitado. */
export interface DadosAnuncioForm {
  titulo: string;
  descricao: string;
  modalidade: Modalidade;
  /** Texto do campo, aceita "80", "80,5" ou "80.50". Ignorado em doações. */
  preco: string;
  estadoConservacao: EstadoConservacao;
  categoriaId: number | null;
  localEntrega: string;
}

/** Uma foto nova escolhida pelo usuário (ainda não enviada). */
export type FotoNova = File;

/** Seleção de capa: uma foto já existente (id) ou uma nova (posição em `fotosNovas`). */
export type CapaSelecionada =
  | { tipo: 'existente'; id: number }
  | { tipo: 'nova'; indice: number };

export interface EntradaCriar {
  dados: DadosAnuncioForm;
  fotosNovas: FotoNova[];
  /** Posição (a partir de 0) da capa em fotosNovas. Padrão 0. */
  capaIndice?: number;
}

export interface EntradaEditar {
  id: number;
  dados: DadosAnuncioForm;
  /** Ids das fotos atuais que continuam, na ordem de exibição. */
  fotosMantidas: number[];
  fotosNovas: FotoNova[];
  /** Omitir para manter a capa atual (se mantida) ou usar a primeira. */
  capa?: CapaSelecionada;
}

/** Formato de erro da API: { mensagem, campos }. */
export interface ErroApi {
  status: number;
  mensagem: string;
  /** Mensagem por campo inválido (ex.: { preco: "Obrigatório em vendas." }). */
  campos: Record<string, string>;
}

export type StatusRequisicao = 'idle' | 'carregando' | 'sucesso' | 'erro';

export const MAX_FOTOS = 10;
export const MAX_BYTES_FOTO = 5 * 1024 * 1024;
export const TIPOS_FOTO_ACEITOS = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const ESTADOS_POR_MODALIDADE: Record<Modalidade, EstadoAnuncio[]> = {
  venda: ['ativo', 'pausado', 'reservado', 'vendido'],
  doacao: ['ativo', 'pausado', 'reservado', 'concluido'],
};
