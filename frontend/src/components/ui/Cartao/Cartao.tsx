import { useState } from 'react';
import type { ReactNode } from 'react';
import { juntarClasses } from '../juntarClasses';
import estilos from './Cartao.module.css';

export interface CartaoProps {
    titulo: string;
    imagemUrl?: string | null;
    imagemAlt?: string;
    selo?: ReactNode; // ex.: <Selo>Ativo</Selo>, aparece sobre a imagem
    children?: ReactNode; // conteúdo abaixo do título (preço, categoria...)
    className?: string;
}

export function Cartao({
    titulo,
    imagemUrl,
    imagemAlt = '',
    selo,
    children,
    className,
}: CartaoProps) {
    // As URLs de foto da API expiram em 1 hora. Se a imagem falhar ao carregar,
    // mostramos o espaço reservado em vez do ícone de imagem quebrada.
    const [urlComFalha, setUrlComFalha] = useState<string | null>(null);
    const mostrarImagem = Boolean(imagemUrl) && urlComFalha !== imagemUrl;

    return (
        <article className={juntarClasses(estilos.cartao, className)}>
            <div className={estilos.midia}>
                {mostrarImagem ? (
                    <img
                        src={imagemUrl ?? undefined}
                        alt={imagemAlt}
                        className={estilos.imagem}
                        loading="lazy"
                        onError={() => setUrlComFalha(imagemUrl ?? null)}
                    />
                ) : (
                    <div className={estilos.semImagem}>Sem foto</div>
                )}
                {selo && <div className={estilos.selo}>{selo}</div>}
            </div>
            <div className={estilos.corpo}>
                <h3 className={estilos.titulo}>{titulo}</h3>
                {children}
            </div>
        </article>
    );
}