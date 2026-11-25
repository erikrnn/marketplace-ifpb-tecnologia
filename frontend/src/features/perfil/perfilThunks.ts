import { usuarioAtualizado } from '../../provisorio/authSlice';
import type { AppThunk } from '../../provisorio/store';
import type { DadosUsuario, Usuario } from '../../tipos/api';
import { atualizarUsuarioLogado, enviarFotoPerfil } from './servicos/usuariosApi';

// Salva nome, curso e telefone e atualiza o usuário logado em `auth`.
// Devolve o usuário novo para a tela. Se a API recusar, o ErroApi sobe para quem chamou.
export const salvarPerfil =
    (dados: DadosUsuario): AppThunk<Promise<Usuario>> =>
        async (dispatch) => {
            const usuario = await atualizarUsuarioLogado(dados);
            dispatch(usuarioAtualizado(usuario));
            return usuario;
        };

// Envia a foto de perfil e atualiza o usuário logado em `auth`.
export const trocarFotoPerfil =
    (arquivo: File): AppThunk<Promise<Usuario>> =>
        async (dispatch) => {
            const usuario = await enviarFotoPerfil(arquivo);
            dispatch(usuarioAtualizado(usuario));
            return usuario;
        };