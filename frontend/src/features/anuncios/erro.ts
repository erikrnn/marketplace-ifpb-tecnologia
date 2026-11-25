import type { ErroApi } from './tipos';

export function erroDeRede(): ErroApi {
  return {
    status: 0,
    mensagem: 'Não foi possível conectar ao servidor. Verifique se a API está rodando.',
    campos: {},
  };
}

/** Converte qualquer valor lançado em ErroApi. */
export function normalizarErro(e: unknown): ErroApi {
  if (e && typeof e === 'object' && 'status' in e && 'mensagem' in e) {
    const x = e as ErroApi;
    return { status: x.status, mensagem: x.mensagem, campos: x.campos ?? {} };
  }
  return { status: 0, mensagem: e instanceof Error ? e.message : 'Erro inesperado.', campos: {} };
}

/** Mensagens amigáveis para status sem corpo útil. */
export function mensagemPadrao(status: number): string {
  switch (status) {
    case 401:
      return 'Sessão expirada. Entre novamente.';
    case 403:
      return 'Só o anunciante pode fazer isso.';
    case 404:
      return 'Anúncio não encontrado.';
    case 413:
      return 'Cada foto pode ter no máximo 5 MB.';
    default:
      return 'Não foi possível concluir a operação.';
  }
}
