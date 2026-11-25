import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Usuario } from '../tipos/api';

// PROVISÓRIO: no merge, vale o slice `auth` da Área A. A única coisa que a minha
// parte exige dele é uma ação que receba o usuário atualizado (aqui, `usuarioAtualizado`).

// Usuário guardado na store: sem `fotoUrl`, porque a URL da foto expira em 1 hora
// e a regra do projeto é não persistir essas URLs na store.
export type UsuarioSessao = Omit<Usuario, 'fotoUrl'>;

interface EstadoAuth {
    usuario: UsuarioSessao | null;
}

const estadoInicial: EstadoAuth = { usuario: null };

function semFoto(usuario: Usuario): UsuarioSessao {
    return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        curso: usuario.curso,
        telefone: usuario.telefone,
        papel: usuario.papel,
    };
}

const authSlice = createSlice({
    name: 'auth',
    initialState: estadoInicial,
    reducers: {
        usuarioAtualizado(estado, acao: PayloadAction<Usuario>) {
            estado.usuario = semFoto(acao.payload);
        },
    },
});

export const { usuarioAtualizado } = authSlice.actions;
export default authSlice.reducer;