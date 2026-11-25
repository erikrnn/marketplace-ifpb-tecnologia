import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Botao, CampoTexto, Seletor } from '../../../components/ui';
import { useAppDispatch } from '../../../provisorio/hooks';
import type { Curso, Usuario } from '../../../tipos/api';
import { salvarPerfil, trocarFotoPerfil } from '../perfilThunks';
import { comoErroApi } from '../servicos/http';
import estilos from './FormularioPerfil.module.css';

interface FormularioPerfilProps {
    usuarioInicial: Usuario;
    cursos: Curso[];
}

export function FormularioPerfil({ usuarioInicial, cursos }: FormularioPerfilProps) {
    const dispatch = useAppDispatch();
    const navegar = useNavigate();
    const inputFotoRef = useRef<HTMLInputElement>(null);

    // Usuário atual (muda quando salvamos ou trocamos a foto).
    const [usuario, setUsuario] = useState(usuarioInicial);

    // Campos do formulário. O select trabalha com texto, então cursoId é string aqui.
    const [nome, setNome] = useState(usuarioInicial.nome);
    const [cursoId, setCursoId] = useState(String(usuarioInicial.curso.id));
    const [telefone, setTelefone] = useState(usuarioInicial.telefone ?? '');

    const [erroGeral, setErroGeral] = useState<string | null>(null);
    const [erros, setErros] = useState<Record<string, string>>({});
    const [salvando, setSalvando] = useState(false);
    const [salvou, setSalvou] = useState(false);

    const [enviandoFoto, setEnviandoFoto] = useState(false);
    const [erroFoto, setErroFoto] = useState<string | null>(null);
    const [fotoTrocada, setFotoTrocada] = useState(false);

    async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        setSalvou(false);

        // Checagem mínima no navegador; o resto (tamanho, formato do telefone) é a API que valida.
        const errosLocais: Record<string, string> = {};
        if (!nome.trim()) errosLocais.nome = 'Obrigatório.';
        if (!cursoId) errosLocais.cursoId = 'Obrigatório.';
        if (Object.keys(errosLocais).length > 0) {
            setErros(errosLocais);
            setErroGeral(null);
            return;
        }

        setSalvando(true);
        setErros({});
        setErroGeral(null);
        try {
            const atualizado = await dispatch(
                salvarPerfil({ nome: nome.trim(), cursoId: Number(cursoId), telefone: telefone.trim() }),
            );
            setUsuario(atualizado);
            setNome(atualizado.nome);
            setTelefone(atualizado.telefone ?? '');
            setSalvou(true);
        } catch (erro) {
            const erroApi = comoErroApi(erro);
            setErroGeral(erroApi.message);
            setErros(erroApi.campos); // { nome: '...', telefone: '...' } vai direto para os campos
        } finally {
            setSalvando(false);
        }
    }

    async function aoEscolherFoto(evento: ChangeEvent<HTMLInputElement>) {
        const arquivo = evento.target.files?.[0];
        // Limpa o input para que escolher o MESMO arquivo outra vez também dispare o evento.
        evento.target.value = '';
        if (!arquivo) return;

        setEnviandoFoto(true);
        setErroFoto(null);
        setFotoTrocada(false);
        try {
            // Formato e tamanho (5 MB) quem valida é a API; mostramos a mensagem que ela devolve.
            const atualizado = await dispatch(trocarFotoPerfil(arquivo));
            setUsuario(atualizado);
            setFotoTrocada(true);
        } catch (erro) {
            setErroFoto(comoErroApi(erro).message);
        } finally {
            setEnviandoFoto(false);
        }
    }

    return (
        <div className={estilos.conteudo}>
            <section className={estilos.secao} aria-labelledby="titulo-foto">
                <h2 id="titulo-foto" className={estilos.titulo}>
                    Foto de perfil
                </h2>
                <div className={estilos.foto}>
                    <Avatar nome={usuario.nome} fotoUrl={usuario.fotoUrl} tamanho="grande" />
                    <div className={estilos.fotoAcoes}>
                        <input
                            ref={inputFotoRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            hidden
                            onChange={aoEscolherFoto}
                        />
                        <Botao
                            variante="secundario"
                            carregando={enviandoFoto}
                            onClick={() => inputFotoRef.current?.click()}
                        >
                            {usuario.fotoUrl ? 'Trocar foto' : 'Enviar foto'}
                        </Botao>
                        <p className={estilos.ajuda}>JPEG, PNG ou WebP, até 5 MB.</p>
                        {erroFoto && (
                            <p className={estilos.erro} role="alert">
                                {erroFoto}
                            </p>
                        )}
                        {fotoTrocada && (
                            <p className={estilos.sucesso} role="status">
                                Foto atualizada.
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <section className={estilos.secao} aria-labelledby="titulo-dados">
                <h2 id="titulo-dados" className={estilos.titulo}>
                    Dados pessoais
                </h2>
                <form className={estilos.formulario} onSubmit={aoEnviar} noValidate>
                    {erroGeral && (
                        <p className={estilos.erroGeral} role="alert">
                            {erroGeral}
                        </p>
                    )}

                    <CampoTexto
                        rotulo="Nome"
                        value={nome}
                        onChange={(evento) => setNome(evento.target.value)}
                        erro={erros.nome}
                        autoComplete="name"
                    />

                    <CampoTexto
                        rotulo="E-mail"
                        defaultValue={usuario.email}
                        disabled
                        ajuda="O e-mail não pode ser alterado."
                    />

                    <Seletor
                        rotulo="Curso"
                        value={cursoId}
                        onChange={(evento) => setCursoId(evento.target.value)}
                        opcoes={cursos.map((curso) => ({ valor: curso.id, rotulo: curso.nome }))}
                        erro={erros.cursoId}
                    />

                    <CampoTexto
                        rotulo="Telefone / WhatsApp"
                        type="tel"
                        value={telefone}
                        onChange={(evento) => setTelefone(evento.target.value)}
                        placeholder="(83) 99999-0001"
                        ajuda="Opcional. Aparece no seu perfil. Deixe vazio para remover."
                        erro={erros.telefone}
                        autoComplete="tel"
                    />

                    {salvou && (
                        <p className={estilos.sucesso} role="status">
                            Dados salvos.
                        </p>
                    )}

                    <div className={estilos.acoes}>
                        <Botao type="submit" carregando={salvando}>
                            Salvar
                        </Botao>
                        <Botao variante="secundario" onClick={() => navegar('/perfil')}>
                            Voltar ao perfil
                        </Botao>
                    </div>
                </form>
            </section>
        </div>
    );
}