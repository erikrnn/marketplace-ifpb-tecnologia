import type { TamanhoPagina } from '../types/anuncio';

import styles from './Paginacao.module.css';

interface PaginacaoProps {
  pagina: number;
  tamanho: TamanhoPagina;
  total: number;
  totalPaginas: number;
  onMudarPagina: (pagina: number) => void;
  onMudarTamanho: (tamanho: TamanhoPagina) => void;
}

export function Paginacao({
  pagina,
  tamanho,
  total,
  totalPaginas,
  onMudarPagina,
  onMudarTamanho,
}: PaginacaoProps) {
  const inicio =
    total === 0 || pagina > totalPaginas
      ? 0
      : (pagina - 1) * tamanho + 1;

  const fim =
    inicio === 0
      ? 0
      : Math.min(pagina * tamanho, total);

  const paginas = Array.from(
    new Set([
      1,
      pagina - 1,
      pagina,
      pagina + 1,
      totalPaginas,
    ]),
  )
    .filter((numero) => numero > 0 && numero <= totalPaginas)
    .sort((a, b) => a - b);

  return (
    <div className={styles.container}>
      <div className={styles.informacoes}>
        <p>
          Exibindo {inicio} a {fim} de {total} anúncios
        </p>

        <label className={styles.tamanho}>
          Itens por página

          <select
            value={tamanho}
            onChange={(event) =>
              onMudarTamanho(
                Number(event.target.value) as TamanhoPagina,
              )
            }
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>

      {totalPaginas > 0 && (
        <nav
          className={styles.navegacao}
          aria-label="Paginação dos anúncios"
        >
          <button
            type="button"
            disabled={pagina <= 1}
            onClick={() =>
              onMudarPagina(
                Math.min(pagina - 1, totalPaginas),
              )
            }
          >
            Anterior
          </button>

          {paginas.map((numero, indice) => (
            <span
              key={numero}
              className={styles.grupoPagina}
            >
              {indice > 0 &&
                numero - paginas[indice - 1] > 1 && (
                  <span className={styles.reticencias}>
                    ...
                  </span>
                )}

              <button
                type="button"
                className={
                  numero === pagina
                    ? styles.paginaAtiva
                    : undefined
                }
                aria-current={
                  numero === pagina ? 'page' : undefined
                }
                aria-label={`Página ${numero}`}
                onClick={() => onMudarPagina(numero)}
              >
                {numero}
              </button>
            </span>
          ))}

          <button
            type="button"
            disabled={pagina >= totalPaginas}
            onClick={() => onMudarPagina(pagina + 1)}
          >
            Próxima
          </button>
        </nav>
      )}
    </div>
  );
}