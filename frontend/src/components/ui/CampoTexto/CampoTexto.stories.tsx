import type { Meta, StoryObj } from '@storybook/react-vite';
import { CampoTexto } from './CampoTexto';

const meta = {
    title: 'UI/CampoTexto',
    component: CampoTexto,
    tags: ['autodocs'],
    args: { rotulo: 'Nome' },
} satisfies Meta<typeof CampoTexto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { args: { placeholder: 'Seu nome completo' } };

export const ComAjuda: Story = {
    args: {
        rotulo: 'Telefone',
        placeholder: '(83) 99999-0001',
        ajuda: 'Opcional. Aparece no seu perfil para quem quiser negociar.',
    },
};

export const ComErro: Story = {
    args: {
        rotulo: 'Telefone',
        defaultValue: '123',
        erro: 'Use de 8 a 20 caracteres: números, espaços, parênteses, + e -.',
    },
};

export const Desabilitado: Story = {
    args: { rotulo: 'E-mail', defaultValue: 'estudante@academico.ifpb.edu.br', disabled: true },
};