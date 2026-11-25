import type { DadosAnuncioForm, EntradaCriar, EntradaEditar } from './tipos';

/**
 * Converte o texto digitado em preço da API: ponto decimal, até 2 casas ("80.00").
 * Retorna null se vazio ou inválido.
 */
export function normalizarPreco(texto: string): string | null {
  const t = texto.trim().replace(/^R\$\s*/i, '').replace(/\s/g, '');
  if (!t) return null;
  // "1.234,56" -> "1234.56"; "80,5" -> "80.5"; "80.50" mantém.
  let n = t;
  if (n.includes(',')) n = n.replace(/\./g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(n)) return null;
  const [int, frac = ''] = n.split('.');
  return `${Number(int)}.${frac.padEnd(2, '0')}`;
}

function anexarCampos(fd: FormData, d: DadosAnuncioForm): void {
  fd.append('titulo', d.titulo.trim());
  fd.append('descricao', d.descricao.trim());
  fd.append('modalidade', d.modalidade);
  // Em doações o preço vai vazio: simplesmente não é enviado.
  if (d.modalidade === 'venda') {
    const preco = normalizarPreco(d.preco);
    if (preco !== null) fd.append('preco', preco);
  }
  fd.append('estadoConservacao', d.estadoConservacao);
  if (d.categoriaId !== null) fd.append('categoriaId', String(d.categoriaId));
  fd.append('localEntrega', d.localEntrega.trim());
}

/** Campos de POST /anuncios: ..., fotos (1 a 10 arquivos), capaIndice. */
export function montarFormDataCriar({ dados, fotosNovas, capaIndice }: EntradaCriar): FormData {
  const fd = new FormData();
  anexarCampos(fd, dados);
  fotosNovas.forEach((f) => fd.append('fotos', f));
  fd.append('capaIndice', String(capaIndice ?? 0));
  return fd;
}

/**
 * Campos de PUT /anuncios/{id}: todos os campos + fotosMantidas (um por id),
 * fotos (novas) e a capa por capaId (foto mantida) OU capaIndice (posição entre as novas),
 * nunca os dois.
 */
export function montarFormDataEditar({
  dados,
  fotosMantidas,
  fotosNovas,
  capa,
}: EntradaEditar): FormData {
  const fd = new FormData();
  anexarCampos(fd, dados);
  fotosMantidas.forEach((id) => fd.append('fotosMantidas', String(id)));
  fotosNovas.forEach((f) => fd.append('fotos', f));
  if (capa?.tipo === 'existente') fd.append('capaId', String(capa.id));
  else if (capa?.tipo === 'nova') fd.append('capaIndice', String(capa.indice));
  return fd;
}
