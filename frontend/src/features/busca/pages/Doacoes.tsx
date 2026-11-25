import { BuscaAnuncios } from './BuscaAnuncios';

interface DoacoesProps {
  token: string;
}

export function Doacoes({ token }: DoacoesProps) {
  return (
    <BuscaAnuncios
      modalidade="doacao"
      token={token}
    />
  );
}