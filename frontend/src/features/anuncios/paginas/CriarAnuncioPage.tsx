import { useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { limparAnuncio, limparErrosAnuncio } from '../anunciosSlice';
import FormularioAnuncio from '../componentes/FormularioAnuncio';

/** Rota /anuncios/novo */
export default function CriarAnuncioPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(limparAnuncio());
    dispatch(limparErrosAnuncio());
  }, [dispatch]);

  return (
    <main className="anuncio-pagina anuncio-estreita">
      <h1>Novo anúncio</h1>
      <FormularioAnuncio />
    </main>
  );
}
