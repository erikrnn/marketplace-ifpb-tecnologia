import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Paginacao } from './Paginacao';
import type { TamanhoPagina } from '../types/anuncio';

const meta = {
  title: 'Busca/Paginacao',
  component: Paginacao,
  tags: ['autodocs'],
  args: {
    pagina: 1,
    tamanho: 10,
    total: 85,
    totalPaginas: 9,
    onMudarPagina: () => {},
    onMudarTamanho: () => {},
  },
} satisfies Meta<typeof Paginacao>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PrimeiraPagina: Story = {};

export const PaginaIntermediaria: Story = {
  args: {
    pagina: 5,
  },
};

export const UltimaPagina: Story = {
  args: {
    pagina: 9,
  },
};

export const SemResultados: Story = {
  args: {
    pagina: 1,
    total: 0,
    totalPaginas: 0,
  },
};

function PaginacaoInterativa() {
  const [pagina, setPagina] = useState(1);
  const [tamanho, setTamanho] =
    useState<TamanhoPagina>(10);

  const total = 85;
  const totalPaginas = Math.ceil(total / tamanho);

  return (
    <Paginacao
      pagina={pagina}
      tamanho={tamanho}
      total={total}
      totalPaginas={totalPaginas}
      onMudarPagina={setPagina}
      onMudarTamanho={(novoTamanho) => {
        setTamanho(novoTamanho);
        setPagina(1);
      }}
    />
  );
}

export const Interativa: Story = {
  render: () => <PaginacaoInterativa />,
};