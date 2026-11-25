import { Provider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { EditarPerfilPagina } from './features/perfil/paginas/EditarPerfilPagina';
import { MeuPerfilPagina } from './features/perfil/paginas/MeuPerfilPagina';
import { PerfilPublicoPagina } from './features/perfil/paginas/PerfilPublicoPagina';
import { store } from './provisorio/store';

// PROVISÓRIO: no merge prevalece o App.tsx do Ragalzzi (Provider da store dele, rotas
// protegidas, login, navegação e página 404). Aqui só encaixamos as rotas do perfil.
export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/perfil" replace />} />
          <Route path="/perfil" element={<MeuPerfilPagina />} />
          <Route path="/perfil/editar" element={<EditarPerfilPagina />} />
          <Route path="/usuarios/:id" element={<PerfilPublicoPagina />} />
          <Route path="*" element={<p>Página não encontrada.</p>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}