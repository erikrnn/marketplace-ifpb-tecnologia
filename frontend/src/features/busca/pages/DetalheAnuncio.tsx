import { Link } from 'react-router-dom';
import { GaleriaFotos } from '../components/GaleriaFotos';

import type {
  AnuncioDetalhe,
  EstadoAnuncio,
  EstadoConservacao,
} from '../types/anuncio';

import styles from './DetalheAnuncio.module.css';

interface DetalheAnuncioProps {
  anuncio: AnuncioDetalhe | null;
  carregando: boolean;
  erro: string | null;
}

const rotulosConservacao: Record<EstadoConservacao, string> = {
  novo: 'Novo',
  seminovo: 'Seminovo',
  usado: 'Usado',
};

const rotulosEstado: Record<EstadoAnuncio, string> = {
  ativo: 'Ativo',
  pausado: 'Pausado',
  reservado: 'Reservado',
  vendido: 'Vendido',
  concluido: 'Concluído',
};

const formatadorPreco = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const formatadorData = new Intl.DateTimeFormat('pt-BR');

export function DetalheAnuncio({
  anuncio,
  carregando,
  erro,
}: DetalheAnuncioProps) {
  if (carregando) {
    return (
      <main className={styles.pagina}>
        <p className={styles.mensagem} role="status">
          Carregando anúncio...
        </p>
      </main>
    );
  }

  if (erro || !anuncio) {
    return (
      <main className={styles.pagina}>
        <p className={styles.erro} role="alert">
          {erro ?? 'Anúncio não encontrado.'}
        </p>

        <Link to="/vendas" className={styles.voltar}>
          Voltar aos anúncios
        </Link>
      </main>
    );
  }

  const isDoacao = anuncio.modalidade === 'doacao';

  const rotaVoltar = isDoacao ? '/doacoes' : '/vendas';

  return (
    <main className={styles.pagina}>
      <Link to={rotaVoltar} className={styles.voltar}>
        ← Voltar aos anúncios
      </Link>

      <div className={styles.layout}>
        <section
          className={styles.fotografias}
          aria-label="Fotografias do anúncio"
        >
          <GaleriaFotos
            key={anuncio.id}
            fotos={anuncio.fotos}
            titulo={anuncio.titulo}
          />
        </section>

        <section className={styles.informacoes}>
          <span className={styles.categoria}>{anuncio.categoria.nome}</span>

          <h1 className={styles.titulo}>{anuncio.titulo}</h1>

          <span className={styles.estado}>{rotulosEstado[anuncio.estado]}</span>

          <strong className={isDoacao ? styles.doacao : styles.preco}>
            {isDoacao
              ? "Doação"
              : anuncio.preco !== null
                ? formatadorPreco.format(anuncio.preco)
                : "Preço indisponível"}
          </strong>

          <dl className={styles.dados}>
            <div>
              <dt>Modalidade</dt>
              <dd>{isDoacao ? "Doação" : "Venda"}</dd>
            </div>

            <div>
              <dt>Estado de conservação</dt>
              <dd>{rotulosConservacao[anuncio.estadoConservacao]}</dd>
            </div>

            <div>
              <dt>Local de entrega</dt>
              <dd>{anuncio.localEntrega}</dd>
            </div>

            <div>
              <dt>Publicado em</dt>
              <dd>{formatadorData.format(new Date(anuncio.publicadoEm))}</dd>
            </div>
          </dl>

          <section className={styles.descricao}>
            <h2>Descrição</h2>
            <p>{anuncio.descricao}</p>
          </section>

          <section className={styles.anunciante}>
            <h2>Sobre o anunciante</h2>

            <div className={styles.perfil}>
              {anuncio.anunciante.fotoUrl ? (
                <img
                  src={anuncio.anunciante.fotoUrl}
                  alt={`Foto de ${anuncio.anunciante.nome}`}
                  className={styles.avatar}
                />
              ) : (
                <span className={styles.avatarVazio} aria-hidden="true">
                  {anuncio.anunciante.nome.charAt(0)}
                </span>
              )}

              <div>
                <strong>{anuncio.anunciante.nome}</strong>

                <p>{anuncio.anunciante.curso.nome}</p>

                {anuncio.anunciante.telefone && (
                  <p>{anuncio.anunciante.telefone}</p>
                )}

                <Link
                  to={`/usuarios/${anuncio.anunciante.id}`}
                  className={styles.linkPerfil}
                >
                  Ver perfil
                </Link>
              </div>
            </div>
          </section>

          <div className={styles.acoes}>
            <button type="button" disabled>
              Tenho interesse
            </button>

            <button type="button" disabled>
              Negociar
            </button>
          </div>

          <p className={styles.aviso}>
            Interesse e negociação estarão disponíveis nas próximas etapas.
          </p>
        </section>
      </div>
    </main>
  );
}