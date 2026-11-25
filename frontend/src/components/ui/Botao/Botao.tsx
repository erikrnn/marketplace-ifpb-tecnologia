import type { ButtonHTMLAttributes } from 'react';
import { juntarClasses } from '../juntarClasses';
import estilos from './Botao.module.css';

export interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variante?: 'primario' | 'secundario' | 'perigo';
    carregando?: boolean;
}

export function Botao({
    variante = 'primario',
    carregando = false,
    disabled,
    className,
    children,
    type = 'button',
    ...resto
}: BotaoProps) {
    return (
        <button
            type={type}
            className={juntarClasses(estilos.botao, estilos[variante], className)}
            disabled={disabled || carregando}
            aria-busy={carregando}
            {...resto}
        >
            {carregando && <span className={estilos.spinner} aria-hidden="true" />}
            {children}
        </button>
    );
}