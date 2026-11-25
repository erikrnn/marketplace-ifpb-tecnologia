import type { Meta, StoryObj } from '@storybook/react-vite';
import { Botao } from './Botao';

const meta = {
    title: 'UI/Botao',
    component: Botao,
    tags: ['autodocs'],
    args: { children: 'Salvar' },
} satisfies Meta<typeof Botao>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primario: Story = { args: { variante: 'primario' } };
export const Secundario: Story = { args: { variante: 'secundario', children: 'Cancelar' } };
export const Perigo: Story = { args: { variante: 'perigo', children: 'Excluir' } };
export const Carregando: Story = { args: { carregando: true, children: 'Salvando' } };
export const Desabilitado: Story = { args: { disabled: true } };