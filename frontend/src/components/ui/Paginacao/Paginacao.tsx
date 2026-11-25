import { Botao } from '../Botao/Botao';
import { juntarClasses } from '../juntarClasses';
import { Seletor } from '../Seletor/Seletor';
import { gerarPaginas } from './gerarPaginas';
import estilos from './Paginacao.module.css';

export interface PaginacaoProps {
    paginaAtual: number; // começa em 1, como na API
    totalPaginas: number;
    aoMudarPagina: (pagina: number) => void;
    // Opcionais: só aparecem se aoMudarTamanho for informado.
    tamanho?: number;
    opcoesTamanho?: number[];
    aoMudarTamanho?: (tamanho: number) => void;
    className?: string;
}

export function Paginacao({
    paginaAtual,
    totalPaginas,
    aoMudarPagina,
    tamanho,
    opcoesTamanho = [5, 10, 25, 50],
    aoMudarTamanho,
    className,
}: PaginacaoProps) {
    const mostrarPaginas = totalPaginas > 1;
    const mostrarTamanho = aoMudarTamanho !== undefined;

    if (!mostrarPaginas && !mostrarTamanho) {
        return null;
    }

    return (
        <nav className={juntarClasses(estilos.paginacao, className)} aria-label="Paginação">
            {mostrarPaginas && (
                <ul className={estilos.lista}>
                    <li>
                        <Botao
                            variante="secundario"
                            className={estilos.botao}
                            disabled={paginaAtual <= 1}
                            onClick={() => aoMudarPagina(paginaAtual - 1)}
                        >
                            Anterior
                        </Botao>
                    </li>
                    {gerarPaginas(paginaAtual, totalPaginas).map((item, indice) =>
                        item === 'reticencias' ? (
                            <li key={`reticencias-${indice}`} className={estilos.reticencias} aria-hidden="true">
                                …
                            </li>
                        ) : (
                            <li key={item}>
                                <Botao
                                    variante={item === paginaAtual ? 'primario' : 'secundario'}
                                    className={estilos.botao}
                                    aria-current={item === paginaAtual ? 'page' : undefined}
                                    aria-label={`Página ${item}`}
                                    onClick={() => aoMudarPagina(item)}
                                >
                                    {item}
                                </Botao>
                            </li>
                        ),
                    )}
                    <li>
                        <Botao
                            variante="secundario"
                            className={estilos.botao}
                            disabled={paginaAtual >= totalPaginas}
                            onClick={() => aoMudarPagina(paginaAtual + 1)}
                        >
                            Próxima
                        </Botao>
                    </li>
                </ul>
            )}

            {mostrarTamanho && (
                <Seletor
                    rotulo="Itens por página"
                    className={estilos.tamanho}
                    value={tamanho}
                    opcoes={opcoesTamanho.map((opcao) => ({ valor: opcao, rotulo: String(opcao) }))}
                    onChange={(evento) => aoMudarTamanho(Number(evento.target.value))}
                />
            )}
        </nav>
    );
}