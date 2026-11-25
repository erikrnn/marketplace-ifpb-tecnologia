import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MeuPerfilPagina } from './features/perfil/paginas/MeuPerfilPagina';
import { PerfilPublicoPagina } from './features/perfil/paginas/PerfilPublicoPagina';

// PROVISÓRIO: no merge prevalece o App.tsx do Ragalzzi (com rotas protegidas,
// login, navegação e página 404). Aqui só encaixamos as rotas do perfil.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/perfil" replace />} />
        <Route path="/perfil" element={<MeuPerfilPagina />} />
        <Route path="/usuarios/:id" element={<PerfilPublicoPagina />} />
        <Route path="*" element={<p>Página não encontrada.</p>} />
      </Routes>
    </BrowserRouter>
  );
}