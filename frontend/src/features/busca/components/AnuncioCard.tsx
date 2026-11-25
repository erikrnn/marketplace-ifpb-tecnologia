import { Link } from 'react-router-dom';
import type {
  AnuncioResumo,
  EstadoConservacao,
} from '../types/anuncio';

import styles from './AnuncioCard.module.css';

interface AnuncioCardProps {
  anuncio: AnuncioResumo;
}

const rotulosConservacao: Record<EstadoConservacao, string> = {
  novo: 'Novo',
  seminovo: 'Seminovo',
  usado: 'Usado',
};

const formatadorPreco = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function AnuncioCard({ anuncio }: AnuncioCardProps) {
  const isDoacao = anuncio.modalidade === 'doacao';

  return (
    <article className={styles.card}>
      <img
        src={anuncio.capaUrl}
        alt={anuncio.titulo}
        className={styles.imagem}
        loading="lazy"
      />

      <div className={styles.conteudo}>
        <span className={styles.categoria}>
          {anuncio.categoria.nome}
        </span>

        <h2 className={styles.titulo}>
          {anuncio.titulo}
        </h2>

        <strong
          className={isDoacao ? styles.doacao : styles.preco}
        >
          {isDoacao
            ? 'Doação'
            : anuncio.preco !== null
              ? formatadorPreco.format(anuncio.preco)
              : 'Preço indisponível'}
        </strong>

        <span className={styles.conservacao}>
          {rotulosConservacao[anuncio.estadoConservacao]}
        </span>

        <p className={styles.anunciante}>
          {anuncio.anunciante.nome}
        </p>

        <Link
          to={`/anuncios/${anuncio.id}`}
          className={styles.link}
          aria-label={`Ver detalhes de ${anuncio.titulo}`}
        >
          Ver detalhes
        </Link>
      </div>
    </article>
  );
}