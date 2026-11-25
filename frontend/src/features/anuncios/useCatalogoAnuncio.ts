import { useEffect, useState } from 'react';
import { listarCategorias, listarEstadosConservacao } from './anunciosApi';
import { normalizarErro } from './erro';
import type { Categoria, ErroApi, OpcaoEstadoConservacao } from './tipos';

/** Listas do formulário (categorias e estados de conservação). Estado local, fora do Redux. */
export function useCatalogoAnuncio() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [estadosConservacao, setEstados] = useState<OpcaoEstadoConservacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<ErroApi | null>(null);

  useEffect(() => {
    let ativo = true;
    Promise.all([listarCategorias(), listarEstadosConservacao()])
      .then(([c, e]) => {
        if (!ativo) return;
        setCategorias(c);
        setEstados(e);
      })
      .catch((e) => ativo && setErro(normalizarErro(e)))
      .finally(() => ativo && setCarregando(false));
    return () => {
      ativo = false;
    };
  }, []);

  return { categorias, estadosConservacao, carregando, erro };
}
