import type { AnuncioDetalhe, DadosAnuncioForm } from './tipos';

export const formularioVazio: DadosAnuncioForm = {
  titulo: '',
  descricao: '',
  modalidade: 'venda',
  preco: '',
  estadoConservacao: 'usado',
  categoriaId: null,
  localEntrega: '',
};

/** Preenche o formulário de edição a partir do detalhe. */
export function formularioDe(a: AnuncioDetalhe): DadosAnuncioForm {
  return {
    titulo: a.titulo,
    descricao: a.descricao,
    modalidade: a.modalidade,
    preco: a.preco === null ? '' : a.preco.toFixed(2),
    estadoConservacao: a.estadoConservacao,
    categoriaId: a.categoria.id,
    localEntrega: a.localEntrega,
  };
}
