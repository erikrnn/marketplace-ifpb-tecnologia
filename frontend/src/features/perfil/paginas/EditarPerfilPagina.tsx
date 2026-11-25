import { useEffect, useState } from 'react';
import { Botao } from '../../../components/ui';
import type { Curso, Usuario } from '../../../tipos/api';
import { FormularioPerfil } from '../componentes/FormularioPerfil';
import { listarCursos } from '../servicos/catalogoApi';
import { comoErroApi } from '../servicos/http';
import type { ErroApi } from '../servicos/http';
import { buscarUsuarioLogado } from '../servicos/usuariosApi';
import estilos from './EditarPerfilPagina.module.css';

interface DadosEdicao {
    usuario: Usuario;
    cursos: Curso[];
}

export function EditarPerfilPagina() {
    const [dados, setDados] = useState<DadosEdicao | null>(null);
    const [erro, setErro] = useState<ErroApi | null>(null);
    const [tentativa, setTentativa] = useState(0);

    useEffect(() => {
        let cancelado = false;

        // As duas buscas saem juntas. Os dados do formulário vêm da API (e não do Redux),
        // para sempre editar o que está salvo de verdade, com a foto de agora.
        Promise.all([buscarUsuarioLogado(), listarCursos()])
            .then(([usuario, cursos]) => {
                if (!cancelado) setDados({ usuario, cursos });
            })
            .catch((falha: unknown) => {
                if (!cancelado) setErro(comoErroApi(falha));
            });

        return () => {
            cancelado = true;
        };
    }, [tentativa]);

    function tentarNovamente() {
        setErro(null);
        setDados(null);
        setTentativa((valor) => valor + 1);
    }

    return (
        <main className={estilos.pagina}>
            <h1 className={estilos.titulo}>Editar perfil</h1>

            {erro && (
                <div className={estilos.aviso} role="alert">
                    <p>{erro.message}</p>
                    <Botao variante="secundario" onClick={tentarNovamente}>
                        Tentar novamente
                    </Botao>
                </div>
            )}

            {!erro && !dados && (
                <p className={estilos.aviso} role="status">
                    Carregando…
                </p>
            )}

            {dados && <FormularioPerfil usuarioInicial={dados.usuario} cursos={dados.cursos} />}
        </main>
    );
}