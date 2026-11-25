import { useId } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { juntarClasses } from '../juntarClasses';
import estilos from './Seletor.module.css';

export interface OpcaoSeletor {
    valor: string | number;
    rotulo: string;
}

export interface SeletorProps extends SelectHTMLAttributes<HTMLSelectElement> {
    rotulo: string;
    opcoes: OpcaoSeletor[];
    placeholder?: string; // primeira opção, sem valor (ex.: "Selecione um curso")
    erro?: string;
    ajuda?: string;
}

export function Seletor({
    rotulo,
    opcoes,
    placeholder,
    erro,
    ajuda,
    id,
    className,
    ...resto
}: SeletorProps) {
    const idGerado = useId();
    const idCampo = id ?? idGerado;
    const idMensagem = `${idCampo}-mensagem`;
    const mensagem = erro ?? ajuda;

    return (
        <div className={juntarClasses(estilos.campo, className)}>
            <label htmlFor={idCampo} className={estilos.rotulo}>
                {rotulo}
            </label>
            <select
                id={idCampo}
                className={juntarClasses(estilos.selecao, erro && estilos.comErro)}
                aria-invalid={erro ? true : undefined}
                aria-describedby={mensagem ? idMensagem : undefined}
                {...resto}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {opcoes.map((opcao) => (
                    <option key={opcao.valor} value={opcao.valor}>
                        {opcao.rotulo}
                    </option>
                ))}
            </select>
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