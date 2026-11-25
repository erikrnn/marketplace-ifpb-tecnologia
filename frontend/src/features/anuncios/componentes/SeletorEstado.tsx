import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { alterarEstadoThunk, selecionarErroEstado, selecionarStatusEstado } from '../anunciosSlice';
import { estadosPermitidos, rotuloEstado } from '../validacao';
import type { AnuncioDetalhe, EstadoAnuncio } from '../tipos';

/**
 * Troca o estado do anúncio (só o dono). As opções dependem da modalidade:
 * venda → "vendido"; doação → "concluído". A chamada é feita pelo thunk alterarEstadoThunk.
 */
export default function SeletorEstado({ anuncio }: { anuncio: AnuncioDetalhe }) {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selecionarStatusEstado);
  const erro = useAppSelector(selecionarErroEstado);
  const carregando = status === 'carregando';

  const trocar = (estado: EstadoAnuncio) => {
    if (estado !== anuncio.estado) void dispatch(alterarEstadoThunk({ id: anuncio.id, estado }));
  };

  return (
    <div className="seletor-estado">
      <span className="rotulo-estado">Estado do anúncio:</span>
      <div className="estado-botoes" role="group" aria-label="Estado do anúncio">
        {estadosPermitidos(anuncio.modalidade).map((e) => (
          <button
            key={e}
            type="button"
            className={`btn btn-mini${e === anuncio.estado ? ' btn-ativo' : ''}`}
            aria-pressed={e === anuncio.estado}
            disabled={carregando}
            onClick={() => trocar(e)}
          >
            {rotuloEstado(e, anuncio.modalidade)}
          </button>
        ))}
      </div>
      {carregando && <small className="anuncio-dica">Salvando…</small>}
      {erro && (
        <small className="msg-erro" role="alert">
          {erro.campos.estado ?? erro.mensagem}
        </small>
      )}
    </div>
  );
}
