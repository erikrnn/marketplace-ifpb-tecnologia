import type { ErroResposta } from '../../../tipos/api';

const URL_API: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

// ATENÇÃO (merge): a chave "token" é uma suposição. Quando o cliente da Área A
// existir, este arquivo inteiro é substituído por ele.
const CHAVE_TOKEN = 'token';

function obterToken(): string | null {
    return localStorage.getItem(CHAVE_TOKEN);
}

// Erro padrão do projeto: leva o status HTTP, a mensagem e os erros por campo.
export class ErroApi extends Error {
    status: number;
    campos: Record<string, string>;

    constructor(status: number, mensagem: string, campos: Record<string, string> = {}) {
        super(mensagem);
        this.name = 'ErroApi';
        this.status = status;
        this.campos = campos;
    }
}

// Garante que o que foi capturado num catch vire um ErroApi.
export function comoErroApi(erro: unknown): ErroApi {
    return erro instanceof ErroApi ? erro : new ErroApi(0, 'Algo deu errado. Tente novamente.');
}


function mensagemPadrao(status: number): string {
    if (status === 401) return 'Sessão expirada. Faça login novamente.';
    if (status === 404) return 'Não encontrado.';
    if (status === 413) return 'Arquivo grande demais. A foto deve ter no máximo 5 MB.';
    return 'Algo deu errado. Tente novamente.';
}

async function lerErro(resposta: Response): Promise<ErroApi> {
    try {
        const corpo = (await resposta.json()) as Partial<ErroResposta>;
        return new ErroApi(
            resposta.status,
            corpo.mensagem ?? mensagemPadrao(resposta.status),
            corpo.campos ?? {},
        );
    } catch {
        // Resposta sem JSON (ex.: erro de proxy): usa a mensagem padrão do status.
        return new ErroApi(resposta.status, mensagemPadrao(resposta.status));
    }
}

interface Opcoes {
    metodo?: 'GET' | 'POST' | 'PUT' | 'PATCH';
    json?: unknown; // corpo em JSON
    formData?: FormData; // corpo multipart (upload)
    publico?: boolean; // true = não envia o token
}

export async function requisitar<T>(caminho: string, opcoes: Opcoes = {}): Promise<T> {
    const cabecalhos: Record<string, string> = {};
    const token = obterToken();
    if (token && !opcoes.publico) {
        cabecalhos['Authorization'] = `Bearer ${token}`;
    }

    let corpo: BodyInit | undefined;
    if (opcoes.formData) {
        // Upload: NÃO definir Content-Type. O navegador coloca "multipart/form-data"
        // com o "boundary" sozinho; se definirmos à mão, o backend não lê os campos.
        corpo = opcoes.formData;
    } else if (opcoes.json !== undefined) {
        cabecalhos['Content-Type'] = 'application/json';
        corpo = JSON.stringify(opcoes.json);
    }

    let resposta: Response;
    try {
        resposta = await fetch(`${URL_API}${caminho}`, {
            method: opcoes.metodo ?? 'GET',
            headers: cabecalhos,
            body: corpo,
        });
    } catch {
        throw new ErroApi(0, 'Não foi possível conectar ao servidor. Verifique se a API está no ar.');
    }

    if (!resposta.ok) {
        throw await lerErro(resposta);
    }
    return (await resposta.json()) as T;
}