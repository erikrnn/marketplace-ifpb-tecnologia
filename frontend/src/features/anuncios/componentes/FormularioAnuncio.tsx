import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  criarAnuncioThunk,
  editarAnuncioThunk,
  limparErrosAnuncio,
  selecionarErroSalvar,
  selecionarStatusSalvar,
} from '../anunciosSlice';
import { formularioDe, formularioVazio } from '../formularioInicial';
import { validarAnuncio, type ErrosForm } from '../validacao';
import { useCatalogoAnuncio } from '../useCatalogoAnuncio';
import { useFotosAnuncio } from '../useFotosAnuncio';
import type { AnuncioDetalhe, DadosAnuncioForm, Modalidade } from '../tipos';
import Campo from './Campo';
import GaleriaFotosForm from './GaleriaFotosForm';

interface Props {
  /** Se informado, o formulário edita este anúncio; senão, cria um novo. */
  anuncio?: AnuncioDetalhe;
}

/**
 * Formulário único de criação e edição (RF03).
 * Valores digitados e fotos ficam em estado local; só o envio passa pelos thunks.
 */
export default function FormularioAnuncio({ anuncio }: Props) {
  const editando = !!anuncio;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = useAppSelector(selecionarStatusSalvar);
  const erroApi = useAppSelector(selecionarErroSalvar);
  const catalogo = useCatalogoAnuncio();
  const fotos = useFotosAnuncio(anuncio?.fotos);

  const [dados, setDados] = useState<DadosAnuncioForm>(() =>
    anuncio ? formularioDe(anuncio) : formularioVazio,
  );
  const [errosCliente, setErrosCliente] = useState<ErrosForm>({});
  const enviando = status === 'carregando';

  // Ao abrir o formulário, descarta erros de uma tentativa anterior.
  useEffect(() => {
    dispatch(limparErrosAnuncio());
  }, [dispatch]);

  const mudar = <K extends keyof DadosAnuncioForm>(campo: K, valor: DadosAnuncioForm[K]) =>
    setDados((d) => ({ ...d, [campo]: valor }));

  // Mensagem de um campo: erro local primeiro, depois o devolvido pela API.
  const erroCampo = (campo: keyof DadosAnuncioForm, ...chavesApi: string[]) =>
    errosCliente[campo] ?? [campo, ...chavesApi].map((c) => erroApi?.campos[c]).find(Boolean);

  const erroFotos =
    errosCliente.fotos ??
    ['fotos', 'fotosMantidas', 'capaIndice', 'capaId'].map((c) => erroApi?.campos[c]).find(Boolean);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const erros = validarAnuncio(dados, fotos.total);
    setErrosCliente(erros);
    if (Object.keys(erros).length > 0) return;

    try {
      const salvo = editando
        ? await dispatch(
            editarAnuncioThunk({
              id: anuncio.id,
              dados,
              fotosMantidas: fotos.fotosMantidas,
              fotosNovas: fotos.fotosNovas,
              capa: fotos.capa,
            }),
          ).unwrap()
        : await dispatch(
            criarAnuncioThunk({
              dados,
              fotosNovas: fotos.fotosNovas,
              capaIndice: fotos.capaIndice,
            }),
          ).unwrap();
      navigate(`/anuncios/${salvo.id}`);
    } catch {
      /* o erro já está no Redux (erroSalvar) e é exibido abaixo */
    }
  };

  return (
    <form className="anuncio-form" onSubmit={enviar} noValidate>
      <Campo rotulo="Título" erro={erroCampo('titulo')}>
        <input
          value={dados.titulo}
          maxLength={100}
          onChange={(e) => mudar('titulo', e.target.value)}
        />
      </Campo>

      <Campo rotulo="Descrição" erro={erroCampo('descricao')}>
        <textarea
          rows={5}
          value={dados.descricao}
          maxLength={2000}
          onChange={(e) => mudar('descricao', e.target.value)}
        />
      </Campo>

      <div className="linha">
        <Campo
          rotulo="Modalidade"
          erro={erroCampo('modalidade')}
          dica={editando ? 'Para trocar, o estado atual precisa existir na nova modalidade.' : undefined}
        >
          <select
            value={dados.modalidade}
            onChange={(e) => mudar('modalidade', e.target.value as Modalidade)}
          >
            <option value="venda">Venda</option>
            <option value="doacao">Doação</option>
          </select>
        </Campo>

        {dados.modalidade === 'venda' && (
          <Campo rotulo="Preço (R$)" erro={erroCampo('preco')}>
            <input
              inputMode="decimal"
              placeholder="80,50"
              value={dados.preco}
              onChange={(e) => mudar('preco', e.target.value)}
            />
          </Campo>
        )}
      </div>

      <div className="linha">
        <Campo rotulo="Estado de conservação" erro={erroCampo('estadoConservacao')}>
          <select
            value={dados.estadoConservacao}
            onChange={(e) =>
              mudar('estadoConservacao', e.target.value as DadosAnuncioForm['estadoConservacao'])
            }
          >
            {catalogo.estadosConservacao.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.rotulo}
              </option>
            ))}
          </select>
        </Campo>

        <Campo rotulo="Categoria" erro={erroCampo('categoriaId')}>
          <select
            value={dados.categoriaId ?? ''}
            onChange={(e) => mudar('categoriaId', e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Selecione…</option>
            {catalogo.categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </Campo>
      </div>
      {catalogo.erro && <p className="erro-geral" role="alert">{catalogo.erro.mensagem}</p>}

      <Campo rotulo="Local de entrega" erro={erroCampo('localEntrega')}>
        <input
          value={dados.localEntrega}
          maxLength={200}
          placeholder="Ex.: Bloco A, em frente à biblioteca"
          onChange={(e) => mudar('localEntrega', e.target.value)}
        />
      </Campo>

      <GaleriaFotosForm fotos={fotos} erro={erroFotos} />

      {erroApi && (
        <p className="erro-geral" role="alert">
          {erroApi.mensagem}
          {erroApi.status === 401 && <> <Link to="/login">Entrar novamente</Link></>}
        </p>
      )}

      <div className="acoes">
        <button className="btn btn-primario" disabled={enviando || catalogo.carregando}>
          {enviando ? 'Salvando…' : editando ? 'Salvar alterações' : 'Publicar anúncio'}
        </button>
        <Link className="btn" to={editando ? `/anuncios/${anuncio.id}` : '/'}>
          Cancelar
        </Link>
      </div>
    </form>
  );
}
