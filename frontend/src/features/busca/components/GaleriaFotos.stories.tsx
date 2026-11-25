import type { Meta, StoryObj } from '@storybook/react-vite';

import { GaleriaFotos } from './GaleriaFotos';
import { fotosMock } from '../mocks/anunciosMock';

const meta = {
  title: 'Busca/GaleriaFotos',
  component: GaleriaFotos,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 600 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    titulo: 'Notebook Lenovo',
    fotos: fotosMock,
  },
} satisfies Meta<typeof GaleriaFotos>;

export default meta;

type Story = StoryObj<typeof meta>;

export const VariasFotos: Story = {};

export const FotoUnica: Story = {
  args: {
    fotos: [fotosMock[0]],
  },
};

export const SemFotos: Story = {
  args: {
    fotos: [],
  },
};

export const CapaNaoInicial: Story = {
  args: {
    fotos: fotosMock.map((foto, indice) => ({
      ...foto,
      capa: indice === 1,
    })),
  },
};