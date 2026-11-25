import { configureStore } from '@reduxjs/toolkit';
import type { ThunkAction, UnknownAction } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// PROVISÓRIO: no merge, vale a store da Área A.
export const store = configureStore({
    reducer: { auth: authReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<Retorno = void> = ThunkAction<Retorno, RootState, unknown, UnknownAction>;

// Só em desenvolvimento: mostra no console cada mudança do estado `auth`,
// para você conferir que salvar o perfil atualiza o usuário logado.
if (import.meta.env.DEV) {
    store.subscribe(() => {
        console.log('[auth]', store.getState().auth.usuario);
    });
}