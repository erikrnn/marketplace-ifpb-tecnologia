import type { ReactNode } from 'react';
import { juntarClasses } from '../juntarClasses';
import estilos from './Selo.module.css';

export interface SeloProps {
    tom?: 'neutro' | 'sucesso' | 'aviso' | 'info';
    children: ReactNode;
    className?: string;
}

export function Selo({ tom = 'neutro', children, className }: SeloProps) {
    return <span className={juntarClasses(estilos.selo, estilos[tom], className)}>{children}</span>;
}