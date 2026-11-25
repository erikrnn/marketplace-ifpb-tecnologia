// Tipos que espelham as respostas reais do backend (records Java em
// backend/src/main/java/br/edu/ifpb/marketplace). Os valores de enum
// chegam em minúsculas, exatamente como estão aqui.

export type Papel = 'estudante' | 'administrador';
export type Modalidade = 'venda' | 'doacao';
export type EstadoAnuncio = 'ativo' | 'pausado' | 'reservado' | 'vendido' | 'concluido';
export type EstadoConservacao = 'novo' | 'seminovo' | 'usado';

export interface Curso {
    id: number;
    nome: string;
}

export interface Categoria {
    id: number;
    nome: string;
    slug: string;
}

// Usuário logado: GET /usuarios/eu, PUT /usuarios/eu, PUT /usuarios/eu/foto
export interface Usuario {
    id: number;
    nome: string;
    email: string;
    curso: Curso;
    telefone: string | null;
    fotoUrl: string | null; // URL assinada: vale 1 hora, nunca guardar
    papel: Papel;
}

// Perfil público de qualquer estudante: GET /usuarios/{id} (sem e-mail)
export interface Perfil {
    id: number;
    nome: string;
    curso: Curso;
    telefone: string | null;
    fotoUrl: string | null; // URL assinada: vale 1 hora, nunca guardar
}

export interface Anunciante {
    id: number;
    nome: string;
}

// Anúncio nas listagens: GET /usuarios/{id}/anuncios
export interface AnuncioResumo {
    id: number;
    titulo: string;
    modalidade: Modalidade;
    preco: number | null; // em reais; null em doações
    estado: EstadoAnuncio;
    estadoConservacao: EstadoConservacao;
    categoria: Categoria;
    capaUrl: string; // URL assinada: vale 1 hora, nunca guardar
    anunciante: Anunciante;
    publicadoEm: string; // data ISO, ex.: "2026-09-05T13:10:00Z"
}

// Toda listagem paginada da API. "pagina" começa em 1.
export interface Pagina<T> {
    itens: T[];
    pagina: number;
    tamanho: number;
    total: number;
    totalPaginas: number;
}

// Corpo de todo erro da API. "campos" traz a mensagem de cada campo inválido.
export interface ErroResposta {
    mensagem: string;
    campos?: Record<string, string>;
}

// Dados que PUT /usuarios/eu aceita (o e-mail não muda)
export interface DadosUsuario {
    nome: string;
    cursoId: number;
    telefone: string; // vazio remove o telefone
}