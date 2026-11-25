import type { Meta, StoryObj } from '@storybook/react-vite';
import { Selo } from '../Selo/Selo';
import { Cartao } from './Cartao';

// Imagem de exemplo embutida, para a story funcionar sem internet nem API.
const imagemExemplo =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">' +
        '<rect width="400" height="300" fill="#9fb3c8"/>' +
        '<text x="200" y="160" font-size="28" text-anchor="middle" fill="#fff">Foto</text>' +
        '</svg>',
    );

const meta = {
    title: 'UI/Cartao',
    component: Cartao,
    tags: ['autodocs'],
    args: {
        titulo: 'Fone de ouvido Bluetooth',
        imagemUrl: imagemExemplo,
        imagemAlt: 'Fone de ouvido Bluetooth',
        children: <strong>R$ 80,00</strong>,
    },
    decorators: [
        (Story) => (
            <div style={{ width: 260 }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Cartao>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const ComSelo: Story = {
    args: { selo: <Selo tom="sucesso">Ativo</Selo> },
};

export const SemImagem: Story = {
    args: { imagemUrl: null, selo: <Selo tom="neutro">Pausado</Selo> },
};

export const ImagemQuebrada: Story = {
    args: { imagemUrl: 'http://localhost:1/nao-existe.jpg' },
};