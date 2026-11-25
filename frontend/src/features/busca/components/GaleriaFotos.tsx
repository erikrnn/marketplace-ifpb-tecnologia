import { useState } from 'react';

import type { FotoAnuncio } from '../types/anuncio';

import styles from './GaleriaFotos.module.css';

interface GaleriaFotosProps {
  fotos: FotoAnuncio[];
  titulo: string;
}

export function GaleriaFotos({
  fotos,
  titulo,
}: GaleriaFotosProps) {
  const [fotoSelecionada, setFotoSelecionada] =
    useState<number | null>(null);

  if (fotos.length === 0) {
    return (
      <div className={styles.semFoto}>
        Nenhuma fotografia disponível.
      </div>
    );
  }

  const indiceSelecionado = fotos.findIndex(
    (foto) => foto.id === fotoSelecionada,
  );

  const indiceCapa = fotos.findIndex(
    (foto) => foto.capa,
  );

  const indiceAtual =
    indiceSelecionado >= 0
      ? indiceSelecionado
      : Math.max(indiceCapa, 0);

  const fotoAtual = fotos[indiceAtual];

  function fotoAnterior() {
    const novoIndice =
      (indiceAtual - 1 + fotos.length) % fotos.length;

    setFotoSelecionada(fotos[novoIndice].id);
  }

  function proximaFoto() {
    const novoIndice =
      (indiceAtual + 1) % fotos.length;

    setFotoSelecionada(fotos[novoIndice].id);
  }

  return (
    <div className={styles.galeria}>
      <div className={styles.principal}>
        <img
          src={fotoAtual.url}
          alt={`${titulo} - Foto ${indiceAtual + 1}`}
          className={styles.imagem}
        />
      </div>

      {fotos.length > 1 && (
        <>
          <div className={styles.controles}>
            <button
              type="button"
              onClick={fotoAnterior}
              aria-label="Fotografia anterior"
            >
              Anterior
            </button>

            <span aria-live="polite">
              {indiceAtual + 1} de {fotos.length}
            </span>

            <button
              type="button"
              onClick={proximaFoto}
              aria-label="Próxima fotografia"
            >
              Próxima
            </button>
          </div>

          <div className={styles.miniaturas}>
            {fotos.map((foto, indice) => (
              <button
                key={foto.id}
                type="button"
                className={
                  foto.id === fotoAtual.id
                    ? `${styles.miniatura} ${styles.selecionada}`
                    : styles.miniatura
                }
                onClick={() =>
                  setFotoSelecionada(foto.id)
                }
                aria-label={`Visualizar fotografia ${indice + 1}`}
                aria-pressed={foto.id === fotoAtual.id}
              >
                <img
                  src={foto.url}
                  alt={`${titulo} - Miniatura ${indice + 1}`}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}