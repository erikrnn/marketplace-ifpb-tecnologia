import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  buscarAnuncioThunk,
  selecionarAnuncioAtual,
  selecionarErroBusca,
  selecionarStatusBusca,
} from '../anunciosSlice';
import FormularioAnuncio from '../componentes/FormularioAnuncio';
import SeletorEstado from '../componentes/SeletorEstado';

/** Rota /anuncios/:id/editar (só o dono). */
export default function EditarAnuncioPage() {
  const id = Number(useParams().id);
  const dispatch = useAppDispatch();
  const atual = useAppSelector(selecionarAnuncioAtual);
  const status = useAppSelector(selecionarStatusBusca);
  const erro = useAppSelector(selecionarErroBusca);
  const usuarioId = useAppSelector((s) => s.auth.usuario?.id);

  useEffect(() => {
    if (Number.isFinite(id)) void dispatch(buscarAnuncioThunk(id));
  }, [dispatch, id]);

  if (!Number.isFinite(id)) return <p className="erro-geral">Anúncio inválido.</p>;
  if (erro)
    return (
      <main className="anuncio-pagina">
        <p className="erro-geral" role="alert">{erro.mensagem}</p>
      </main>
    );
  // Só mostra o formulário com o anúncio certo já carregado (as fotos iniciais são lidas uma vez).
  if (!atual || atual.id !== id || status === 'carregando')
    return <main className="anuncio-pagina"><p>Carregando…</p></main>;

  if (atual.anunciante.id !== usuarioId)
    return (
      <main className="anuncio-pagina">
        <p className="erro-geral" role="alert">Só o anunciante pode editar este anúncio.</p>
        <Link to={`/anuncios/${id}`}>Voltar ao anúncio</Link>
      </main>
    );

  return (
    <main className="anuncio-pagina anuncio-estreita">
      <h1>Editar anúncio</h1>
      <SeletorEstado anuncio={atual} />
      <FormularioAnuncio key={atual.id} anuncio={atual} />
    </main>
  );
}
