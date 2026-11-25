import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  alterarEstadoAnuncio,
  buscarAnuncio,
  criarAnuncio,
  editarAnuncio,
} from './anunciosApi';
import { normalizarErro } from './erro';
import type {
  AnuncioDetalhe,
  EntradaCriar,
  EntradaEditar,
  ErroApi,
  EstadoAnuncio,
  StatusRequisicao,
} from './tipos';

/**
 * Estado global de anúncios (RF03): só o anúncio em detalhe e o status das requisições.
 * Formulário em edição e pré-visualização das fotos ficam locais na tela.
 * NÃO persistir: as URLs das fotos expiram em 1 hora.
 */
export interface AnunciosState {
  atual: AnuncioDetalhe | null;
  statusBusca: StatusRequisicao;
  erroBusca: ErroApi | null;
  statusSalvar: StatusRequisicao; // criar e editar
  erroSalvar: ErroApi | null;
  statusEstado: StatusRequisicao;
  erroEstado: ErroApi | null;
}

const estadoInicial: AnunciosState = {
  atual: null,
  statusBusca: 'idle',
  erroBusca: null,
  statusSalvar: 'idle',
  erroSalvar: null,
  statusEstado: 'idle',
  erroEstado: null,
};

/** O token vem do slice `auth` (Área A): state.auth.token. */
function tokenDe(getState: () => unknown): string | null {
  const s = getState() as { auth?: { token?: string | null } };
  return s.auth?.token ?? null;
}

type Rejeicao = { rejectValue: ErroApi };

export const buscarAnuncioThunk = createAsyncThunk<AnuncioDetalhe, number, Rejeicao>(
  'anuncios/buscar',
  async (id, { getState, rejectWithValue }) => {
    try {
      return await buscarAnuncio(id, tokenDe(getState));
    } catch (e) {
      return rejectWithValue(normalizarErro(e));
    }
  },
);

export const criarAnuncioThunk = createAsyncThunk<AnuncioDetalhe, EntradaCriar, Rejeicao>(
  'anuncios/criar',
  async (entrada, { getState, rejectWithValue }) => {
    try {
      return await criarAnuncio(entrada, tokenDe(getState));
    } catch (e) {
      return rejectWithValue(normalizarErro(e));
    }
  },
);

export const editarAnuncioThunk = createAsyncThunk<AnuncioDetalhe, EntradaEditar, Rejeicao>(
  'anuncios/editar',
  async (entrada, { getState, rejectWithValue }) => {
    try {
      return await editarAnuncio(entrada, tokenDe(getState));
    } catch (e) {
      return rejectWithValue(normalizarErro(e));
    }
  },
);

export const alterarEstadoThunk = createAsyncThunk<
  AnuncioDetalhe,
  { id: number; estado: EstadoAnuncio },
  Rejeicao
>('anuncios/alterarEstado', async ({ id, estado }, { getState, rejectWithValue }) => {
  try {
    return await alterarEstadoAnuncio(id, estado, tokenDe(getState));
  } catch (e) {
    return rejectWithValue(normalizarErro(e));
  }
});

const erroDe = (a: { payload?: ErroApi; error: { message?: string } }): ErroApi =>
  a.payload ?? { status: 0, mensagem: a.error.message ?? 'Erro inesperado.', campos: {} };

const slice = createSlice({
  name: 'anuncios',
  initialState: estadoInicial,
  reducers: {
    /** Chamar ao sair das telas de anúncio ou ao abrir o formulário de criação. */
    limparAnuncio(state) {
      state.atual = null;
      state.statusBusca = 'idle';
      state.erroBusca = null;
    },
    limparErrosAnuncio(state) {
      state.erroSalvar = null;
      state.erroEstado = null;
      state.statusSalvar = 'idle';
      state.statusEstado = 'idle';
    },
    definirAnuncioAtual(state, action: PayloadAction<AnuncioDetalhe | null>) {
      state.atual = action.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(buscarAnuncioThunk.pending, (s, a) => {
      s.statusBusca = 'carregando';
      s.erroBusca = null;
      // Ao trocar de anúncio, não mostrar o anterior.
      if (s.atual && s.atual.id !== a.meta.arg) s.atual = null;
    })
      .addCase(buscarAnuncioThunk.fulfilled, (s, a) => {
        s.statusBusca = 'sucesso';
        s.atual = a.payload;
      })
      .addCase(buscarAnuncioThunk.rejected, (s, a) => {
        s.statusBusca = 'erro';
        s.erroBusca = erroDe(a);
        s.atual = null;
      });

    for (const t of [criarAnuncioThunk, editarAnuncioThunk]) {
      b.addCase(t.pending, (s) => {
        s.statusSalvar = 'carregando';
        s.erroSalvar = null;
      })
        .addCase(t.fulfilled, (s, a) => {
          s.statusSalvar = 'sucesso';
          s.atual = a.payload;
        })
        .addCase(t.rejected, (s, a) => {
          s.statusSalvar = 'erro';
          s.erroSalvar = erroDe(a);
        });
    }

    b.addCase(alterarEstadoThunk.pending, (s) => {
      s.statusEstado = 'carregando';
      s.erroEstado = null;
    })
      .addCase(alterarEstadoThunk.fulfilled, (s, a) => {
        s.statusEstado = 'sucesso';
        s.atual = a.payload;
      })
      .addCase(alterarEstadoThunk.rejected, (s, a) => {
        s.statusEstado = 'erro';
        s.erroEstado = erroDe(a);
      });
  },
});

export const { limparAnuncio, limparErrosAnuncio, definirAnuncioAtual } = slice.actions;
export const anunciosReducer = slice.reducer;
export default slice.reducer;

// Seletores (state.anuncios — registrar o reducer com essa chave na store).
type ComAnuncios = { anuncios: AnunciosState };
export const selecionarAnuncioAtual = (s: ComAnuncios) => s.anuncios.atual;
export const selecionarStatusBusca = (s: ComAnuncios) => s.anuncios.statusBusca;
export const selecionarErroBusca = (s: ComAnuncios) => s.anuncios.erroBusca;
export const selecionarStatusSalvar = (s: ComAnuncios) => s.anuncios.statusSalvar;
export const selecionarErroSalvar = (s: ComAnuncios) => s.anuncios.erroSalvar;
export const selecionarStatusEstado = (s: ComAnuncios) => s.anuncios.statusEstado;
export const selecionarErroEstado = (s: ComAnuncios) => s.anuncios.erroEstado;
