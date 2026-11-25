import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

const fotoExemplo =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
        '<rect width="200" height="200" fill="#9fb3c8"/>' +
        '<circle cx="100" cy="80" r="35" fill="#fff"/>' +
        '<rect x="45" y="130" width="110" height="70" rx="35" fill="#fff"/>' +
        '</svg>',
    );

const meta = {
    title: 'UI/Avatar',
    component: Avatar,
    tags: ['autodocs'],
    args: { nome: 'Estudante de Exemplo' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComFoto: Story = { args: { fotoUrl: fotoExemplo } };
export const SemFoto: Story = { args: { fotoUrl: null } };
export const Grande: Story = { args: { fotoUrl: fotoExemplo, tamanho: 'grande' } };
export const GrandeSemFoto: Story = { args: { fotoUrl: null, tamanho: 'grande' } };
export const FotoQuebrada: Story = { args: { fotoUrl: 'http://localhost:1/nao-existe.jpg' } };