import { useRef } from 'react';
import { MAX_FOTOS, TIPOS_FOTO_ACEITOS } from '../tipos';
import type { useFotosAnuncio } from '../useFotosAnuncio';

type Fotos = ReturnType<typeof useFotosAnuncio>;

interface Props {
  fotos: Fotos;
  /** Erro de validação (cliente ou API) do conjunto de fotos. */
  erro?: string;
}

/**
 * Seleção, pré-visualização, remoção e escolha da capa.
 * Todo o estado vem do hook useFotosAnuncio (local, fora do Redux).
 */
export default function GaleriaFotosForm({ fotos, erro }: Props) {
  const entrada = useRef<HTMLInputElement>(null);
  const cheio = fotos.total >= MAX_FOTOS;

  return (
    <fieldset className="fotos">
      <legend>
        Fotos <span className="anuncio-dica">({fotos.total}/{MAX_FOTOS})</span>
      </legend>

      <input
        ref={entrada}
        type="file"
        accept={TIPOS_FOTO_ACEITOS.join(',')}
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) fotos.adicionar(e.target.files);
          e.target.value = ''; // permite escolher o mesmo arquivo de novo
        }}
      />
      <button
        type="button"
        className="btn"
        disabled={cheio}
        onClick={() => entrada.current?.click()}
      >
        {cheio ? 'Limite de fotos atingido' : 'Adicionar fotos'}
      </button>
      <small className="anuncio-dica"> JPEG, PNG ou WebP, até 5 MB cada. De 1 a {MAX_FOTOS} fotos.</small>

      {fotos.erros.length > 0 && (
        <ul className="msg-erro" role="alert">
          {fotos.erros.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      )}
      {erro && <p className="msg-erro" role="alert">{erro}</p>}

      {fotos.itens.length === 0 ? (
        <p className="anuncio-dica">Nenhuma foto selecionada.</p>
      ) : (
        <ul className="fotos-grade">
          {fotos.itens.map((f, i) => (
            <li key={f.chave} className={`foto${f.capa ? ' foto-capa' : ''}`}>
              <img src={f.previewUrl} alt={`Foto ${i + 1}`} />
              {f.capa && <span className="selo">Capa</span>}
              {f.origem === 'nova' && <span className="selo selo-nova">Nova</span>}
              <div className="foto-acoes">
                {!f.capa && (
                  <button type="button" className="btn btn-mini" onClick={() => fotos.definirCapa(f.chave)}>
                    Usar como capa
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-mini btn-perigo"
                  onClick={() => fotos.remover(f.chave)}
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  );
}
