import { useState } from 'react';
import type { FormEvent } from 'react';

import type {
  Categoria,
  FiltrosAnuncios,
} from '../types/anuncio';

import styles from './FiltrosBusca.module.css';

interface FiltrosBuscaProps {
  filtros: FiltrosAnuncios;
  categorias: Categoria[];
  onAplicar: (parametros: URLSearchParams) => void;
  onLimpar: () => void;
}

export function FiltrosBusca({
  filtros,
  categorias,
  onAplicar,
  onLimpar,
}: FiltrosBuscaProps) {
  const [erro, setErro] = useState<string | null>(null);

  const isVenda = filtros.modalidade === 'venda';

  function aplicarFiltros(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const dados = new FormData(event.currentTarget);

    const categoria = String(dados.get('categoria') ?? '');
    const precoMin = String(dados.get('precoMin') ?? '');
    const precoMax = String(dados.get('precoMax') ?? '');

    if (
      isVenda &&
      precoMin !== '' &&
      precoMax !== '' &&
      Number(precoMin) > Number(precoMax)
    ) {
      setErro('O preço mínimo não pode ser maior que o máximo.');
      return;
    }

    setErro(null);

    const parametros = new URLSearchParams();

    if (categoria) {
      parametros.set('categoria', categoria);
    }

    if (isVenda) {
      if (precoMin !== '') {
        parametros.set('precoMin', precoMin);
      }

      if (precoMax !== '') {
        parametros.set('precoMax', precoMax);
      }
    }

    const ordenacao = String(
      dados.get('ordenacao') ?? 'data-desc',
    );

    const [ordem, direcao] = ordenacao.split('-');

    parametros.set('ordem', ordem);
    parametros.set('direcao', direcao);
    parametros.set('pagina', '1');
    parametros.set('tamanho', String(filtros.tamanho ?? 10));

    onAplicar(parametros);
  }

  return (
    <form
      className={styles.formulario}
      onSubmit={aplicarFiltros}
    >
      <h2 className={styles.titulo}>Filtros</h2>

      <div className={styles.campos}>
        <label className={styles.campo}>
          Categoria

          <select
            name="categoria"
            defaultValue={filtros.categoria ?? ''}
          >
            <option value="">Todas as categorias</option>

            {categorias.map((categoria) => (
              <option
                key={categoria.id}
                value={categoria.slug}
              >
                {categoria.nome}
              </option>
            ))}
          </select>
        </label>

        {isVenda && (
          <>
            <label className={styles.campo}>
              Preço mínimo (R$)

              <input
                type="number"
                name="precoMin"
                min="0"
                step="0.01"
                placeholder="0,00"
                defaultValue={filtros.precoMin ?? ''}
              />
            </label>

            <label className={styles.campo}>
              Preço máximo (R$)

              <input
                type="number"
                name="precoMax"
                min="0"
                step="0.01"
                placeholder="Sem limite"
                defaultValue={filtros.precoMax ?? ''}
              />
            </label>
          </>
        )}

        <label className={styles.campo}>
          Ordenar por

          <select
            name="ordenacao"
            defaultValue={
              `${filtros.ordem ?? 'data'}-${filtros.direcao ?? 'desc'}`
            }
          >
            <option value="data-desc">Mais recentes</option>
            <option value="data-asc">Mais antigos</option>

            {isVenda && (
              <>
                <option value="preco-asc">Menor preço</option>
                <option value="preco-desc">Maior preço</option>
              </>
            )}
          </select>
        </label>
      </div>

      {erro && (
        <p className={styles.erro} role="alert">
          {erro}
        </p>
      )}

      <div className={styles.acoes}>
        <button type="submit" className={styles.aplicar}>
          Aplicar filtros
        </button>

        <button
          type="reset"
          className={styles.limpar}
          onClick={() => {
            setErro(null);
            onLimpar();
          }}
        >
          Limpar filtros
        </button>
      </div>
    </form>
  );
}