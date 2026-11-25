import { useEffect, useState } from 'react';
import type { AnuncioResumo, Pagina, Perfil } from '../../../tipos/api';
import { comoErroApi, type ErroApi } from '../servicos/http';
import {
    buscarPerfil,
    buscarUsuarioLogado,
    listarAnunciosDoUsuario,
} from '../servicos/usuariosApi';

// alvo: id de outro estudante, ou 'eu' para o próprio perfil.
export function usePerfil(alvo: number | 'eu') {
    const [perfil, setPerfil] = useState<Perfil | null>(null);
    const [erroPerfil, setErroPerfil] = useState<ErroApi | null>(null);
    const [carregandoPerfil, setCarregandoPerfil] = useState(true);

    const [anuncios, setAnuncios] = useState<Pagina<AnuncioResumo> | null>(null);
    const [erroAnuncios, setErroAnuncios] = useState<ErroApi | null>(null);
    const [carregandoAnuncios, setCarregandoAnuncios] = useState(true);

    const [pagina, setPagina] = useState(1);
    const [tamanho, setTamanho] = useState(10);
    const [tentativa, setTentativa] = useState(0); // aumenta para forçar nova busca

    // 1) Busca o perfil.
    useEffect(() => {
        let cancelado = false;
        // Usuario (de /usuarios/eu) tem todos os campos de Perfil, então serve nos dois casos.
        const busca: Promise<Perfil> = alvo === 'eu' ? buscarUsuarioLogado() : buscarPerfil(alvo);

        busca
            .then((dados) => {
                if (cancelado) return;
                setPerfil(dados);
                setErroPerfil(null);
            })
            .catch((erro: unknown) => {
                if (!cancelado) setErroPerfil(comoErroApi(erro));
            })
            .finally(() => {
                if (!cancelado) setCarregandoPerfil(false);
            });

        return () => {
            cancelado = true;
        };
    }, [alvo, tentativa]);

    // 2) Busca os anúncios. Para 'eu', espera o perfil chegar para saber o id.
    const idDosAnuncios = alvo === 'eu' ? perfil?.id : alvo;

    useEffect(() => {
        if (idDosAnuncios === undefined) return;
        let cancelado = false;

        listarAnunciosDoUsuario(idDosAnuncios, pagina, tamanho)
            .then((dados) => {
                if (cancelado) return;
                setAnuncios(dados);
                setErroAnuncios(null);
            })
            .catch((erro: unknown) => {
                if (!cancelado) setErroAnuncios(comoErroApi(erro));
            })
            .finally(() => {
                if (!cancelado) setCarregandoAnuncios(false);
            });

        return () => {
            cancelado = true;
        };
    }, [idDosAnuncios, pagina, tamanho, tentativa]);

    function mudarPagina(novaPagina: number) {
        setPagina(novaPagina);
        setCarregandoAnuncios(true);
    }

    function mudarTamanho(novoTamanho: number) {
        setTamanho(novoTamanho);
        setPagina(1); // o tamanho mudou: a página antiga pode nem existir mais
        setCarregandoAnuncios(true);
    }

    function recarregar() {
        setErroPerfil(null);
        setErroAnuncios(null);
        setCarregandoPerfil(true);
        setCarregandoAnuncios(true);
        setTentativa((valor) => valor + 1);
    }

    return {
        perfil,
        erroPerfil,
        carregandoPerfil,
        anuncios,
        erroAnuncios,
        carregandoAnuncios,
        mudarPagina,
        mudarTamanho,
        recarregar,
    };
}