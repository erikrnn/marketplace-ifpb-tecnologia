import { Link } from 'react-router-dom';
import { Botao, Cartao, Paginacao, Selo } from '../../../components/ui';
import type { AnuncioResumo, Pagina } from '../../../tipos/api';
import { formatarPreco, rotuloEstado, tomEstado } from '../../../utilitarios/formatadores';
import type { ErroApi } from '../servicos/http';
import estilos from './ListaAnuncios.module.css';

interface ListaAnunciosProps {
    anuncios: Pagina<AnuncioResumo> | null;
    carregando: boolean;
    erro: ErroApi | null;
    aoMudarPagina: (pagina: number) => void;
    aoMudarTamanho: (tamanho: number) => void;
    aoTentarNovamente: () => void;
    mostrarEstadoAtivo?: boolean; // no próprio perfil, mostra "Ativo" também
    textoVazio?: string;
}

export function ListaAnuncios({
    anuncios,
    carregando,
    erro,
    aoMudarPagina,
    aoMudarTamanho,
    aoTentarNovamente,
    mostrarEstadoAtivo = false,
    textoVazio = 'Nenhum anúncio por aqui ainda.',
}: ListaAnunciosProps) {
    if (erro) {
        return (
            <div className={estilos.mensagem} role="alert">
                <p>{erro.message}</p>
                <Botao variante="secundario" onClick={aoTentarNovamente}>
                    Tentar novamente
                </Botao>
            </div>
        );
    }

    if (!anuncios) {
        return (
            <p className={estilos.mensagem} role="status">
                Carregando anúncios…
            </p>
        );
    }

    if (anuncios.itens.length === 0) {
        return <p className={estilos.mensagem}>{textoVazio}</p>;
    }

    return (
        <div>
            <ul className={estilos.grade} aria-busy={carregando} data-carregando={carregando}>
                {anuncios.itens.map((anuncio) => {
                    const mostrarSelo = mostrarEstadoAtivo || anuncio.estado !== 'ativo';
                    return (
                        <li key={anuncio.id}>
                            <Link to={`/anuncios/${anuncio.id}`} className={estilos.link}>
                                <Cartao
                                    titulo={anuncio.titulo}
                                    imagemUrl={anuncio.capaUrl}
                                    selo={
                                        mostrarSelo ? (
                                            <Selo tom={tomEstado(anuncio.estado)}>{rotuloEstado(anuncio.estado)}</Selo>
                                        ) : undefined
                                    }
                                >
                                    <strong>{formatarPreco(anuncio.preco, anuncio.modalidade)}</strong>
                                    <span className={estilos.categoria}>{anuncio.categoria.nome}</span>
                                </Cartao>
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <Paginacao
                className={estilos.paginacao}
                paginaAtual={anuncios.pagina}
                totalPaginas={anuncios.totalPaginas}
                aoMudarPagina={aoMudarPagina}
                tamanho={anuncios.tamanho}
                aoMudarTamanho={aoMudarTamanho}
            />
        </div>
    );
}