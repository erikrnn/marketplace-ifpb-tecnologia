import { BuscaAnuncios } from './BuscaAnuncios';

interface VendasProps {
  token: string;
}

export function Vendas({ token }: VendasProps) {
  return (
    <BuscaAnuncios
      modalidade="venda"
      token={token}
    />
  );
}