import type { ReactNode } from 'react';
import { Avatar } from '../../../components/ui';
import type { Perfil } from '../../../tipos/api';
import estilos from './CabecalhoPerfil.module.css';

interface CabecalhoPerfilProps {
    perfil: Perfil;
    acoes?: ReactNode; // ex.: botão "Editar perfil", só no próprio perfil
}

export function CabecalhoPerfil({ perfil, acoes }: CabecalhoPerfilProps) {
    return (
        <header className={estilos.cabecalho}>
            <Avatar nome={perfil.nome} fotoUrl={perfil.fotoUrl} tamanho="grande" />
            <div className={estilos.dados}>
                <h1 className={estilos.nome}>{perfil.nome}</h1>
                <p className={estilos.linha}>{perfil.curso.nome}</p>
                <p className={estilos.linha}>
                    {perfil.telefone ? `Contato: ${perfil.telefone}` : 'Contato não informado'}
                </p>
            </div>
            {acoes && <div className={estilos.acoes}>{acoes}</div>}
        </header>
    );
}