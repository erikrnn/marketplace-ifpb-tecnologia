import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  buscarAnuncioThunk,
  selecionarAnuncioAtual,
  selecionarErroBusca,
  selecionarStatusBusca,
} from '../anunciosSlice';
import SeletorEstado from '../componentes/SeletorEstado';
import { rotuloEstado } from '../validacao';

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** Rota /anuncios/:id — mostra o anúncio; o dono vê "Editar" e o seletor de estado. */
export default function DetalheAnuncioPage() {
  const id = Number(useParams().id);
  const dispatch = useAppDispatch();
  const anuncio = useAppSelector(selecionarAnuncioAtual);
  const status = useAppSelector(selecionarStatusBusca);
  const erro = useAppSelector(selecionarErroBusca);
  const usuarioId = useAppSelector((s) => s.auth.usuario?.id);
  const [fotoAtiva, setFotoAtiva] = useState<number | null>(null);

  useEffect(() => {
    setFotoAtiva(null);
    if (Number.isFinite(id)) void dispatch(buscarAnuncioThunk(id));
  }, [dispatch, id]);

  if (erro)
    return (
      <main className="anuncio-pagina">
        <p className="erro-geral" role="alert">{erro.mensagem}</p>
      </main>
    );
  if (!anuncio || anuncio.id !== id || status === 'carregando')
    return <main className="anuncio-pagina"><p>Carregando…</p></main>;

  const dono = anuncio.anunciante.id === usuarioId;
  const principal = anuncio.fotos.find((f) => f.id === fotoAtiva) ?? anuncio.fotos.find((f) => f.capa) ?? anuncio.fotos[0];

  return (
    <main className="anuncio-pagina">
      <div className="detalhe">
        <section>
          {principal && <img className="detalhe-foto" src={principal.url} alt={anuncio.titulo} />}
          <ul className="miniaturas">
            {anuncio.fotos.map((f) => (
              <li key={f.id}>
                <button type="button" onClick={() => setFotoAtiva(f.id)} aria-label="Ver foto">
                  <img src={f.url} alt="" className={f.id === principal?.id ? 'ativa' : ''} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h1>{anuncio.titulo}</h1>
          <p className="preco">{anuncio.preco === null ? 'Doação' : moeda.format(anuncio.preco)}</p>
          <p>
            <span className="selo selo-estado">{rotuloEstado(anuncio.estado, anuncio.modalidade)}</span>{' '}
            {anuncio.modalidade === 'venda' ? 'Venda' : 'Doação'} · {anuncio.categoria.nome} ·{' '}
            {anuncio.estadoConservacao}
          </p>
          <p style={{ whiteSpace: 'pre-wrap' }}>{anuncio.descricao}</p>
          <p><strong>Local de entrega:</strong> {anuncio.localEntrega}</p>
          <p>
            <strong>Anunciante:</strong>{' '}
            <Link to={`/usuarios/${anuncio.anunciante.id}`}>{anuncio.anunciante.nome}</Link>
          </p>

          {dono ? (
            <div className="painel-dono">
              <SeletorEstado anuncio={anuncio} />
              <Link className="btn btn-primario" to={`/anuncios/${anuncio.id}/editar`}>
                Editar anúncio
              </Link>
            </div>
          ) : (
            <div className="acoes">
              <button className="btn" disabled title="Disponível na Etapa 2">Tenho interesse</button>
              <button className="btn" disabled title="Disponível na Etapa 3">Negociar</button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
