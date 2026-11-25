import { useEffect, useState } from 'react';

import { AnuncioCard } from '../components/AnuncioCard';
import { buscarAnuncios } from '../services/anuncioService';

import type {
  AnuncioResumo,
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
  const [resultado, setResultado] =
    useState<Pagina<AnuncioResumo> | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const titulo =
    modalidade === 'venda' ? 'Vendas' : 'Doações';

  useEffect(() => {
    const controller = new AbortController();

    setCarregando(true);
    setErro(null);
    setResultado(null);

    buscarAnuncios(
      {
        modalidade,
        ordem: 'data',
        direcao: 'desc',
        pagina: 1,
        tamanho: 10,
      },
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
  }, [modalidade, token]);

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