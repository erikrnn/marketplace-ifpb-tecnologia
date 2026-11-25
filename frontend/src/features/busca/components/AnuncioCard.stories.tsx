import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';

import { AnuncioCard } from './AnuncioCard';

import {
  anuncioVendaMock,
  anuncioDoacaoMock,
} from '../mocks/anunciosMock';

const meta = {
  title: 'Busca/AnuncioCard',
  component: AnuncioCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ maxWidth: 320 }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof AnuncioCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Venda: Story = {
  args: {
    anuncio: anuncioVendaMock,
  },
};

export const Doacao: Story = {
  args: {
    anuncio: anuncioDoacaoMock,
  },
};