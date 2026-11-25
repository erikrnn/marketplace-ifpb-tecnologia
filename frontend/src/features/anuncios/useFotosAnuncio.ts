import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { filtrarFotos } from './validacao';
import type { CapaSelecionada, FotoAnuncio } from './tipos';

/** Item exibido na galeria do formulário (existente ou nova), com pré-visualização. */
export interface ItemFoto {
  /** Chave estável para React. */
  chave: string;
  origem: 'existente' | 'nova';
  /** Id da foto (só existentes). */
  id?: number;
  arquivo?: File;
  /** URL de pré-visualização (URL assinada da API ou blob: local). */
  previewUrl: string;
  capa: boolean;
}

/**
 * Estado LOCAL das fotos do formulário (criação e edição).
 * - Criação: useFotosAnuncio() ; Edição: useFotosAnuncio(anuncio.fotos).
 * - Existentes vêm primeiro (ordem do backend), novas depois — mesma ordem que a API usa.
 * - `fotosMantidas`, `fotosNovas` e `capa` já saem prontos para os thunks.
 */
export function useFotosAnuncio(fotosIniciais: FotoAnuncio[] = []) {
  const [existentes, setExistentes] = useState<FotoAnuncio[]>(fotosIniciais);
  const [novas, setNovas] = useState<{ chave: string; arquivo: File; url: string }[]>([]);
  const [capaChave, setCapaChave] = useState<string | null>(() => {
    const c = fotosIniciais.find((f) => f.capa) ?? fotosIniciais[0];
    return c ? `e-${c.id}` : null;
  });
  const [erros, setErros] = useState<string[]>([]);
  const contador = useRef(0);
  const novasRef = useRef(novas);
  novasRef.current = novas;

  // Libera as URLs blob: ao desmontar.
  useEffect(() => () => novasRef.current.forEach((n) => URL.revokeObjectURL(n.url)), []);

  const adicionar = useCallback(
    (arquivos: File[] | FileList) => {
      const { aceitas, erros: e } = filtrarFotos(Array.from(arquivos), existentes.length + novas.length);
      setErros(e);
      if (!aceitas.length) return;
      const itens = aceitas.map((arquivo) => ({
        chave: `n-${contador.current++}`,
        arquivo,
        url: URL.createObjectURL(arquivo),
      }));
      setNovas((atual) => [...atual, ...itens]);
      setCapaChave((c) => c ?? itens[0].chave);
    },
    [existentes.length, novas.length],
  );

  const remover = useCallback(
    (chave: string) => {
      setErros([]);
      if (chave.startsWith('e-')) {
        const restantes = existentes.filter((f) => `e-${f.id}` !== chave);
        setExistentes(restantes);
        if (capaChave === chave)
          setCapaChave(restantes[0] ? `e-${restantes[0].id}` : (novas[0]?.chave ?? null));
      } else {
        const alvo = novas.find((n) => n.chave === chave);
        if (alvo) URL.revokeObjectURL(alvo.url);
        const restantes = novas.filter((n) => n.chave !== chave);
        setNovas(restantes);
        if (capaChave === chave)
          setCapaChave(existentes[0] ? `e-${existentes[0].id}` : (restantes[0]?.chave ?? null));
      }
    },
    [existentes, novas, capaChave],
  );

  const definirCapa = useCallback((chave: string) => setCapaChave(chave), []);

  const itens: ItemFoto[] = useMemo(
    () => [
      ...existentes.map((f) => ({
        chave: `e-${f.id}`,
        origem: 'existente' as const,
        id: f.id,
        previewUrl: f.url,
        capa: capaChave === `e-${f.id}`,
      })),
      ...novas.map((n) => ({
        chave: n.chave,
        origem: 'nova' as const,
        arquivo: n.arquivo,
        previewUrl: n.url,
        capa: capaChave === n.chave,
      })),
    ],
    [existentes, novas, capaChave],
  );

  const capa: CapaSelecionada | undefined = useMemo(() => {
    if (!capaChave) return undefined;
    if (capaChave.startsWith('e-')) return { tipo: 'existente', id: Number(capaChave.slice(2)) };
    const indice = novas.findIndex((n) => n.chave === capaChave);
    return indice >= 0 ? { tipo: 'nova', indice } : undefined;
  }, [capaChave, novas]);

  return {
    itens,
    total: existentes.length + novas.length,
    adicionar,
    remover,
    definirCapa,
    /** Mensagens de arquivos recusados na última seleção (tipo/tamanho/limite). */
    erros,
    /** Para criar: `fotosNovas` e `capaIndice`. */
    fotosNovas: novas.map((n) => n.arquivo),
    capaIndice: capa?.tipo === 'nova' ? capa.indice : 0,
    /** Para editar: `fotosMantidas`, `fotosNovas` e `capa`. */
    fotosMantidas: existentes.map((f) => f.id),
    capa,
  };
}
