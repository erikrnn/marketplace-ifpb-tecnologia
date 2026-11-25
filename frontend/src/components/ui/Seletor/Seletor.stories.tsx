import type { Meta, StoryObj } from '@storybook/react-vite';
import { Seletor } from './Seletor';

const cursos = [
    { valor: 1, rotulo: 'Análise e Desenvolvimento de Sistemas' },
    { valor: 2, rotulo: 'Engenharia de Controle e Automação' },
    { valor: 3, rotulo: 'Engenharia Civil' },
];

const meta = {
    title: 'UI/Seletor',
    component: Seletor,
    tags: ['autodocs'],
    args: { rotulo: 'Curso', opcoes: cursos },
} satisfies Meta<typeof Seletor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { args: { defaultValue: 1 } };

export const ComPlaceholder: Story = {
    args: { placeholder: 'Selecione um curso', defaultValue: '' },
};

export const ComErro: Story = {
    args: { placeholder: 'Selecione um curso', defaultValue: '', erro: 'Obrigatório.' },
};

export const Desabilitado: Story = { args: { defaultValue: 2, disabled: true } };