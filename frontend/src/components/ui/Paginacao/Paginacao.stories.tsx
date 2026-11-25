import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Paginacao } from './Paginacao';
import type { PaginacaoProps } from './Paginacao';

// A Paginacao não guarda estado: quem decide a página é quem a usa.
// Este wrapper faz esse papel nas stories, para os botões realmente funcionarem.
function Exemplo(props: PaginacaoProps) {
    const [pagina, setPagina] = useState(props.paginaAtual);
    const [tamanho, setTamanho] = useState(props.tamanho ?? 10);

    return (
        <Paginacao
            {...props}
            paginaAtual={pagina}
            aoMudarPagina={setPagina}
            tamanho={tamanho}
            aoMudarTamanho={props.aoMudarTamanho ? setTamanho : undefined}
        />
    );
}

const meta = {
    title: 'UI/Paginacao',
    component: Paginacao,
    tags: ['autodocs'],
    args: {
        paginaAtual: 1,
        totalPaginas: 5,
        aoMudarPagina: () => { },
    },
    render: (args) => <Exemplo {...args} />,
} satisfies Meta<typeof Paginacao>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Poucas: Story = {};

export const Muitas: Story = { args: { paginaAtual: 5, totalPaginas: 20 } };

export const ComTamanho: Story = {
    args: { paginaAtual: 2, totalPaginas: 8, tamanho: 10, aoMudarTamanho: () => { } },
};

export const UmaPaginaSo: Story = {
    args: { totalPaginas: 1 },
};