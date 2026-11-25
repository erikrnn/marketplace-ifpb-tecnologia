import { useState } from 'react';
import { juntarClasses } from '../juntarClasses';
import estilos from './Avatar.module.css';

export interface AvatarProps {
    nome: string;
    fotoUrl?: string | null;
    tamanho?: 'medio' | 'grande';
    className?: string;
}

// "Ana Maria Souza" -> "AS"; "Ana" -> "A"
function iniciais(nome: string): string {
    const partes = nome.trim().split(/\s+/).filter(Boolean);
    if (partes.length === 0) return '?';
    const primeira = partes[0][0];
    const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
    return (primeira + ultima).toUpperCase();
}

export function Avatar({ nome, fotoUrl, tamanho = 'medio', className }: AvatarProps) {
    // Guarda a URL que falhou (e não só "falhou"): a URL assinada muda a cada busca.
    const [urlComFalha, setUrlComFalha] = useState<string | null>(null);
    const mostrarFoto = Boolean(fotoUrl) && urlComFalha !== fotoUrl;

    return (
        <span
            role="img"
            aria-label={`Foto de ${nome}`}
            className={juntarClasses(estilos.avatar, estilos[tamanho], className)}
        >
            {mostrarFoto ? (
                <img
                    src={fotoUrl ?? undefined}
                    alt=""
                    className={estilos.imagem}
                    onError={() => setUrlComFalha(fotoUrl ?? null)}
                />
            ) : (
                <span className={estilos.iniciais} aria-hidden="true">
                    {iniciais(nome)}
                </span>
            )}
        </span>
    );
}