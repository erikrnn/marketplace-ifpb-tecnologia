import { describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { montarFormDataCriar, montarFormDataEditar, normalizarPreco } from './formData';
import { validarAnuncio, filtrarFotos } from './validacao';
import reducer, {
  alterarEstadoThunk,
  buscarAnuncioThunk,
  criarAnuncioThunk,
} from './anunciosSlice';
import type { DadosAnuncioForm } from './tipos';

const base: DadosAnuncioForm = {
  titulo: ' Fone ',
  descricao: 'Bom',
  modalidade: 'venda',
  preco: '80,5',
  estadoConservacao: 'usado',
  categoriaId: 4,
  localEntrega: 'Bloco A',
};
const foto = (n: string, size = 10, type = 'image/png') =>
  new File([new Uint8Array(size)], n, { type });

describe('preço', () => {
  it('normaliza', () => {
    expect(normalizarPreco('80')).toBe('80.00');
    expect(normalizarPreco('80,5')).toBe('80.50');
    expect(normalizarPreco('R$ 1.234,56')).toBe('1234.56');
    expect(normalizarPreco('80.123')).toBeNull();
    expect(normalizarPreco('')).toBeNull();
  });
});

describe('FormData', () => {
  it('criar: preço e capaIndice; doação sem preço', () => {
    const fd = montarFormDataCriar({ dados: base, fotosNovas: [foto('a.png'), foto('b.png')], capaIndice: 1 });
    expect(fd.get('preco')).toBe('80.50');
    expect(fd.get('titulo')).toBe('Fone');
    expect(fd.getAll('fotos')).toHaveLength(2);
    expect(fd.get('capaIndice')).toBe('1');
    const doa = montarFormDataCriar({ dados: { ...base, modalidade: 'doacao' }, fotosNovas: [foto('a.png')] });
    expect(doa.has('preco')).toBe(false);
  });
  it('editar: fotosMantidas repetido e capaId XOR capaIndice', () => {
    const a = montarFormDataEditar({ id: 1, dados: base, fotosMantidas: [3, 5], fotosNovas: [], capa: { tipo: 'existente', id: 5 } });
    expect(a.getAll('fotosMantidas')).toEqual(['3', '5']);
    expect(a.get('capaId')).toBe('5');
    expect(a.has('capaIndice')).toBe(false);
    const b = montarFormDataEditar({ id: 1, dados: base, fotosMantidas: [3], fotosNovas: [foto('n.png')], capa: { tipo: 'nova', indice: 0 } });
    expect(b.get('capaIndice')).toBe('0');
    expect(b.has('capaId')).toBe(false);
  });
});

describe('validação', () => {
  it('regras', () => {
    expect(validarAnuncio(base, 1)).toEqual({});
    expect(validarAnuncio({ ...base, preco: '' }, 1).preco).toBeDefined();
    expect(validarAnuncio({ ...base, modalidade: 'doacao', preco: '' }, 1).preco).toBeUndefined();
    expect(validarAnuncio(base, 0).fotos).toBeDefined();
    expect(validarAnuncio(base, 11).fotos).toBeDefined();
  });
  it('fotos: tipo, tamanho e limite', () => {
    const r = filtrarFotos([foto('a.gif', 1, 'image/gif'), foto('b.png', 6 * 1024 * 1024), foto('c.png')], 9);
    expect(r.aceitas).toHaveLength(1);
    expect(r.erros).toHaveLength(2);
  });
});

describe('slice + thunks', () => {
  const resposta = { id: 7, estado: 'ativo' };
  function loja() {
    return configureStore({ reducer: { auth: (s = { token: 'tok' }) => s, anuncios: reducer } });
  }
  it('envia Bearer, guarda o anúncio e trata erro por campo', async () => {
    const chamadas: { url: string; init: RequestInit }[] = [];
    globalThis.fetch = (async (url: string, init: RequestInit) => {
      chamadas.push({ url, init });
      if (url.endsWith('/anuncios/9'))
        return new Response(JSON.stringify({ mensagem: 'Dados inválidos.', campos: { preco: 'Obrigatório em vendas.' } }), { status: 400 });
      return new Response(JSON.stringify(resposta), { status: 200 });
    }) as typeof fetch;
    const s = loja();
    await s.dispatch(criarAnuncioThunk({ dados: base, fotosNovas: [foto('a.png')] }) as never);
    expect((s.getState().anuncios as { atual: unknown }).atual).toEqual(resposta);
    expect(new Headers(chamadas[0].init.headers).get('Authorization')).toBe('Bearer tok');
    expect(new Headers(chamadas[0].init.headers).has('Content-Type')).toBe(false);
    await s.dispatch(alterarEstadoThunk({ id: 7, estado: 'reservado' }) as never);
    expect(chamadas[1].init.method).toBe('PATCH');
    expect(chamadas[1].init.body).toBe(JSON.stringify({ estado: 'reservado' }));
    await s.dispatch(buscarAnuncioThunk(9) as never);
    const st = s.getState().anuncios as { erroBusca: { campos: Record<string, string> } };
    expect(st.erroBusca.campos.preco).toBe('Obrigatório em vendas.');
  });
});
