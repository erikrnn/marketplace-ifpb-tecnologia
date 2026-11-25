import type { ReactNode } from 'react';
import { Botao } from '../../../components/ui';
import { usePerfil } from '../hooks/usePerfil';
import { CabecalhoPerfil } from './CabecalhoPerfil';
import { ListaAnuncios } from './ListaAnuncios';
import estilos from './PerfilTela.module.css';

interface PerfilTelaProps {
    alvo: number | 'eu'; // id de outro estudante, ou 'eu' para o próprio perfil
    acoes?: ReactNode; // botões do cabeçalho (ex.: "Editar perfil")
    mostrarEstadoAtivo?: boolean;
    tituloAnuncios?: string;
    textoVazio?: string;
}

export function PerfilTela({
    alvo,
    acoes,
    mostrarEstadoAtivo = false,
    tituloAnuncios = 'Anúncios',
    textoVazio,
}: PerfilTelaProps) {
    const {
        perfil,
        erroPerfil,
        carregandoPerfil,
        anuncios,
        erroAnuncios,
        carregandoAnuncios,
        mudarPagina,
        mudarTamanho,
        recarregar,
    } = usePerfil(alvo);

    if (erroPerfil) {
        return (
            <main className={estilos.pagina}>
                <div className={estilos.aviso} role="alert">
                    <p>
                        {erroPerfil.status === 404 ? 'Estudante não encontrado.' : erroPerfil.message}
                    </p>
                    {erroPerfil.status !== 404 && (
                        <Botao variante="secundario" onClick={recarregar}>
                            Tentar novamente
                        </Botao>
                    )}
                </div>
            </main>
        );
    }

    if (carregandoPerfil || !perfil) {
        return (
            <main className={estilos.pagina}>
                <p className={estilos.aviso} role="status">
                    Carregando perfil…
                </p>
            </main>
        );
    }

    return (
        <main className={estilos.pagina}>
            <CabecalhoPerfil perfil={perfil} acoes={acoes} />

            <section className={estilos.secao} aria-labelledby="titulo-anuncios">
                <h2 id="titulo-anuncios" className={estilos.titulo}>
                    {tituloAnuncios}
                </h2>
                <ListaAnuncios
                    anuncios={anuncios}
                    carregando={carregandoAnuncios}
                    erro={erroAnuncios}
                    aoMudarPagina={mudarPagina}
                    aoMudarTamanho={mudarTamanho}
                    aoTentarNovamente={recarregar}
                    mostrarEstadoAtivo={mostrarEstadoAtivo}
                    textoVazio={textoVazio}
                />
            </section>
        </main>
    );
}