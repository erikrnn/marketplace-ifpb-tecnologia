import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { AnuncioCard } from '../components/AnuncioCard';
import { FiltrosBusca } from '../components/FiltrosBusca';

import {
  buscarAnuncios,
  buscarCategorias,
} from '../services/anuncioService';

import { lerFiltros } from '../utils/filtros';

import type {
  AnuncioResumo,
  Categoria,
  Modalidade,
  Pagina,
} from '../types/anuncio';

import styles from './BuscaAnuncios.module.css';

interface BuscaAnunciosProps {
  modalidade: Modalidade;
  token: string;
}

export function BuscaAnuncios({
  modalidade,
  token,
}: BuscaAnunciosProps) {
  const [parametros, setParametros] = useSearchParams();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [erroCategorias, setErroCategorias] =
    useState<string | null>(null);

  const [resultado, setResultado] =
    useState<Pagina<AnuncioResumo> | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const filtros = useMemo(
    () => lerFiltros(parametros, modalidade),
    [parametros, modalidade],
  );

  const titulo =
    modalidade === 'venda' ? 'Vendas' : 'Doações';

  useEffect(() => {
    const controller = new AbortController();

    setErroCategorias(null);

    buscarCategorias(controller.signal)
      .then((dados) => {
        if (!controller.signal.aborted) {
          setCategorias(dados);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setErroCategorias(
            'Não foi possível carregar as categorias.',
          );
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    setCarregando(true);
    setErro(null);
    setResultado(null);

    buscarAnuncios(
      filtros,
      token,
      controller.signal,
    )
      .then((dados) => {
        if (!controller.signal.aborted) {
          setResultado(dados);
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setErro(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar os anúncios.',
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      });

    return () => controller.abort();
  }, [filtros, token]);

  function limparFiltros() {
    const novosParametros = new URLSearchParams();

    novosParametros.set(
      'tamanho',
      String(filtros.tamanho ?? 10),
    );

    setParametros(novosParametros);
  }

  return (
    <main className={styles.pagina}>
      <header className={styles.cabecalho}>
        <h1>{titulo}</h1>

        <p>
          {modalidade === 'venda'
            ? 'Encontre produtos de tecnologia à venda.'
            : 'Encontre produtos disponíveis para doação.'}
        </p>
      </header>

      {erroCategorias && (
        <p className={styles.erro} role="alert">
          {erroCategorias}
        </p>
      )}

      <FiltrosBusca
        key={`${modalidade}-${parametros.toString()}-${categorias.length}`}
        filtros={filtros}
        categorias={categorias}
        onAplicar={(novosParametros) =>
          setParametros(novosParametros)
        }
        onLimpar={limparFiltros}
      />

      {carregando && (
        <p className={styles.mensagem} role="status">
          Carregando anúncios...
        </p>
      )}

      {erro && (
        <p className={styles.erro} role="alert">
          {erro}
        </p>
      )}

      {!carregando && !erro && resultado && (
        <>
          <p className={styles.total}>
            {resultado.total} anúncio(s) encontrado(s).
          </p>

          {resultado.itens.length === 0 ? (
            <p className={styles.mensagem}>
              Nenhum anúncio encontrado.
            </p>
          ) : (
            <section
              className={styles.grid}
              aria-label="Lista de anúncios"
            >
              {resultado.itens.map((anuncio) => (
                <AnuncioCard
                  key={anuncio.id}
                  anuncio={anuncio}
                />
              ))}
            </section>
          )}
        </>
      )}
    </main>
  );
}