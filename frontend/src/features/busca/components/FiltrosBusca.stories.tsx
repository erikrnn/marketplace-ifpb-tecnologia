import type { Meta, StoryObj } from '@storybook/react-vite';

import { FiltrosBusca } from './FiltrosBusca';
import { categoriasMock } from '../mocks/anunciosMock';

const meta = {
  title: 'Busca/FiltrosBusca',
  component: FiltrosBusca,
  tags: ['autodocs'],
  args: {
    categorias: categoriasMock,
    onAplicar: (parametros) => {
      console.log(parametros.toString());
    },
    onLimpar: () => {
      console.log('Filtros limpos');
    },
  },
} satisfies Meta<typeof FiltrosBusca>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Venda: Story = {
  args: {
    filtros: {
      modalidade: 'venda',
      ordem: 'data',
      direcao: 'desc',
      pagina: 1,
      tamanho: 10,
    },
  },
};

export const Doacao: Story = {
  args: {
    filtros: {
      modalidade: 'doacao',
      ordem: 'data',
      direcao: 'desc',
      pagina: 1,
      tamanho: 10,
    },
  },
};

export const ComFiltrosSelecionados: Story = {
  args: {
    filtros: {
      modalidade: 'venda',
      categoria: 'audio-e-video',
      precoMin: 50,
      precoMax: 200,
      ordem: 'preco',
      direcao: 'asc',
      pagina: 1,
      tamanho: 10,
    },
  },
};