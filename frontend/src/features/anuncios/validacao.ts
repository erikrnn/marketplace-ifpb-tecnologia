import { normalizarPreco } from './formData';
import {
  MAX_BYTES_FOTO,
  MAX_FOTOS,
  TIPOS_FOTO_ACEITOS,
  type DadosAnuncioForm,
  type EstadoAnuncio,
  type Modalidade,
  ESTADOS_POR_MODALIDADE,
} from './tipos';

export type ErrosForm = Partial<Record<keyof DadosAnuncioForm | 'fotos', string>>;

/** Validação do lado do cliente (a API valida de novo e devolve `campos`). */
export function validarAnuncio(d: DadosAnuncioForm, totalFotos: number): ErrosForm {
  const e: ErrosForm = {};
  if (!d.titulo.trim()) e.titulo = 'Obrigatório.';
  else if (d.titulo.trim().length > 100) e.titulo = 'No máximo 100 caracteres.';
  if (!d.descricao.trim()) e.descricao = 'Obrigatório.';
  else if (d.descricao.trim().length > 2000) e.descricao = 'No máximo 2000 caracteres.';
  if (!d.localEntrega.trim()) e.localEntrega = 'Obrigatório.';
  else if (d.localEntrega.trim().length > 200) e.localEntrega = 'No máximo 200 caracteres.';
  if (d.categoriaId === null) e.categoriaId = 'Obrigatório.';
  if (d.modalidade === 'venda') {
    const p = normalizarPreco(d.preco);
    if (!d.preco.trim()) e.preco = 'Obrigatório em vendas.';
    else if (p === null) e.preco = 'Use até 2 casas decimais.';
    else if (Number(p) <= 0) e.preco = 'Deve ser maior que zero.';
    else if (Number(p) >= 10_000_000) e.preco = 'Valor muito alto.';
  }
  if (totalFotos < 1) e.fotos = 'Envie ao menos 1 foto.';
  else if (totalFotos > MAX_FOTOS) e.fotos = `No máximo ${MAX_FOTOS} fotos.`;
  return e;
}

/** Valida um arquivo escolhido. Retorna mensagem de erro ou null. */
export function validarArquivoFoto(f: File): string | null {
  if (!(TIPOS_FOTO_ACEITOS as readonly string[]).includes(f.type))
    return `"${f.name}": use JPEG, PNG ou WebP.`;
  if (f.size > MAX_BYTES_FOTO) return `"${f.name}": a foto pode ter no máximo 5 MB.`;
  return null;
}

/** Separa arquivos aceitos dos recusados, respeitando o limite total de fotos. */
export function filtrarFotos(
  novos: File[],
  jaSelecionadas: number,
): { aceitas: File[]; erros: string[] } {
  const aceitas: File[] = [];
  const erros: string[] = [];
  for (const f of novos) {
    const msg = validarArquivoFoto(f);
    if (msg) erros.push(msg);
    else if (jaSelecionadas + aceitas.length >= MAX_FOTOS)
      erros.push(`Limite de ${MAX_FOTOS} fotos atingido.`);
    else aceitas.push(f);
  }
  return { aceitas, erros };
}

/** Estados que o dono pode escolher para a modalidade (vendido só em venda, concluido só em doação). */
export function estadosPermitidos(m: Modalidade): EstadoAnuncio[] {
  return ESTADOS_POR_MODALIDADE[m];
}

export function rotuloEstado(e: EstadoAnuncio, m: Modalidade): string {
  if (e === 'concluido') return 'Concluído';
  if (e === 'vendido') return 'Vendido';
  return { ativo: 'Ativo', pausado: 'Pausado', reservado: 'Reservado' }[e as 'ativo'];
}
