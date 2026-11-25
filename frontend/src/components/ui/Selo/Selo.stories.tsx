import type { Meta, StoryObj } from '@storybook/react-vite';
import { Selo } from './Selo';

const meta = {
    title: 'UI/Selo',
    component: Selo,
    tags: ['autodocs'],
    args: { children: 'Ativo' },
} satisfies Meta<typeof Selo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutro: Story = { args: { tom: 'neutro', children: 'Pausado' } };
export const Sucesso: Story = { args: { tom: 'sucesso', children: 'Ativo' } };
export const Aviso: Story = { args: { tom: 'aviso', children: 'Reservado' } };
export const Info: Story = { args: { tom: 'info', children: 'Vendido' } };