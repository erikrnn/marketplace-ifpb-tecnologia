import type { ReactNode } from 'react';

interface Props {
  rotulo: string;
  erro?: string;
  dica?: string;
  children: ReactNode;
}

/** Rótulo + controle + mensagem de erro do campo. */
export default function Campo({ rotulo, erro, dica, children }: Props) {
  return (
    <label className={`campo${erro ? ' campo-erro' : ''}`}>
      <span>{rotulo}</span>
      {children}
      {dica && !erro && <small className="anuncio-dica">{dica}</small>}
      {erro && <small className="msg-erro" role="alert">{erro}</small>}
    </label>
  );
}
