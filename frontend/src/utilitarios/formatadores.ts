import type { EstadoAnuncio, Modalidade } from '../tipos/api';

const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

// 80 -> "R$ 80,00". Doações não têm preço.
export function formatarPreco(preco: number | null, modalidade: Modalidade): string {
    if (modalidade === 'doacao' || preco === null) {
        return 'Doação';
    }
    return formatadorMoeda.format(preco);
}

// "vendido" (venda) e "concluido" (doação) são o mesmo ponto final do anúncio,
// mas a API usa um nome para cada modalidade.
const rotulosEstado: Record<EstadoAnuncio, string> = {
    ativo: 'Ativo',
    pausado: 'Pausado',
    reservado: 'Reservado',
    vendido: 'Vendido',
    concluido: 'Concluído',
};

export function rotuloEstado(estado: EstadoAnuncio): string {
    return rotulosEstado[estado];
}

type TomSelo = 'neutro' | 'sucesso' | 'aviso' | 'info';

const tonsEstado: Record<EstadoAnuncio, TomSelo> = {
    ativo: 'sucesso',
    pausado: 'neutro',
    reservado: 'aviso',
    vendido: 'info',
    concluido: 'info',
};

export function tomEstado(estado: EstadoAnuncio): TomSelo {
    return tonsEstado[estado];
}