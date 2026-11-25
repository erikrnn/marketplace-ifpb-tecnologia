import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { juntarClasses } from '../juntarClasses';
import estilos from './CampoTexto.module.css';

export interface CampoTextoProps extends InputHTMLAttributes<HTMLInputElement> {
    rotulo: string;
    erro?: string; // mensagem de erro (ex.: vinda de "campos" da API)
    ajuda?: string; // texto de apoio abaixo do campo
}

export function CampoTexto({ rotulo, erro, ajuda, id, className, ...resto }: CampoTextoProps) {
    const idGerado = useId();
    const idCampo = id ?? idGerado;
    const idMensagem = `${idCampo}-mensagem`;
    const mensagem = erro ?? ajuda;

    return (
        <div className={juntarClasses(estilos.campo, className)}>
            <label htmlFor={idCampo} className={estilos.rotulo}>
                {rotulo}
            </label>
            <input
                id={idCampo}
                className={juntarClasses(estilos.entrada, erro && estilos.comErro)}
                aria-invalid={erro ? true : undefined}
                aria-describedby={mensagem ? idMensagem : undefined}
                {...resto}
            />
            {mensagem && (
                <p
                    id={idMensagem}
                    className={erro ? estilos.erro : estilos.ajuda}
                    role={erro ? 'alert' : undefined}
                >
                    {mensagem}
                </p>
            )}
        </div>
    );
}