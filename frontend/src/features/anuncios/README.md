# Anúncios (RF03) — lógica e integração (Área B)

Sem telas. Tudo em `frontend/src/features/anuncios/`; importe de `features/anuncios` (index.ts).

## Dependências
`@reduxjs/toolkit`, `react-redux`, `react`; para o teste: `vitest`.
O token é lido de `state.auth.token` (slice da Área A). Variável opcional `VITE_API_URL` (padrão `http://localhost:8080`).

## Integração com a store (Área A)
```ts
import { anunciosReducer } from './features/anuncios';
configureStore({ reducer: { auth: authReducer, anuncios: anunciosReducer } });
```
Em 401, `erro.status === 401`: a tela/Área A deve fazer logout e ir para `/login`.

## O que a tela usa
| Necessidade | API |
|---|---|
| Criar | `dispatch(criarAnuncioThunk({ dados, fotosNovas, capaIndice })).unwrap()` → `AnuncioDetalhe` (navegar para `/anuncios/:id`) |
| Detalhe | `dispatch(buscarAnuncioThunk(id))`; ler com `selecionarAnuncioAtual`, `selecionarStatusBusca`, `selecionarErroBusca` |
| Editar | `dispatch(editarAnuncioThunk({ id, dados, fotosMantidas, fotosNovas, capa })).unwrap()` |
| Estado | `dispatch(alterarEstadoThunk({ id, estado }))`; opções por modalidade: `estadosPermitidos(modalidade)`, rótulos: `rotuloEstado` |
| Fotos do formulário (local) | `useFotosAnuncio(anuncio?.fotos)` → `itens` (preview, capa), `adicionar`, `remover`, `definirCapa`, `erros`, `total` e já devolve `fotosNovas`/`capaIndice` (criar) ou `fotosMantidas`/`fotosNovas`/`capa` (editar) |
| Listas do select | `useCatalogoAnuncio()` → `categorias`, `estadosConservacao` |
| Valores iniciais | `formularioVazio`, `formularioDe(anuncio)` |
| Validação no cliente | `validarAnuncio(dados, totalFotos)` → `{ campo: mensagem }` |
| Erros da API | `selecionarErroSalvar` / `selecionarErroEstado` → `{ status, mensagem, campos }`; mostrar `campos[nome]` junto de cada campo (`titulo`, `preco`, `fotos`, `fotosMantidas`, `capaIndice`, `modalidade`, `estado`...) |
| Limpeza | `limparAnuncio()` ao sair/abrir "novo"; `limparErrosAnuncio()` ao abrir um formulário |

Dono: comparar `anuncio.anunciante.id` com `state.auth.usuario.id` para mostrar editar/estado (a API também devolve 403).

## Regras da API já tratadas
- multipart com `FormData` e sem `Content-Type` manual; PATCH de estado é JSON.
- Preço: ponto decimal, 2 casas ("80.50"); omitido em doações.
- Edição reenvia todos os campos; `fotosMantidas` repete o campo por id; capa por `capaId` OU `capaIndice` (nunca os dois).
- Foto: JPEG/PNG/WebP, ≤ 5 MB, 1 a 10 (validado no cliente; 413 vira mensagem).
- Trocar modalidade só funciona se o estado atual existir na nova (senão 400 em `modalidade`): alterar o estado antes.
- URLs das fotos não são persistidas.
- ⚠️ A rota real é `/estados-conservacao` (com hífen), não `/estadosconservacao` como está no resumo do grupo.

## Validar
Sem `npm` configurado neste repositório ainda, rodar na pasta do frontend (após o esqueleto da Área A):
`npx vitest run src/features/anuncios` e, com a API no ar, criar/editar pelo Swagger e comparar com os campos enviados (aba Rede do navegador).

---
# Interface (telas do RF03)
Rotas: `/anuncios/novo`, `/anuncios/:id`, `/anuncios/:id/editar` (ver `src/App.tsx`).

| Arquivo | Função |
|---|---|
| `paginas/CriarAnuncioPage.tsx` | tela de criação |
| `paginas/EditarAnuncioPage.tsx` | busca o anúncio, confere o dono e abre o formulário preenchido + seletor de estado |
| `paginas/DetalheAnuncioPage.tsx` | galeria, dados, e (para o dono) "Editar" e estado |
| `componentes/FormularioAnuncio.tsx` | formulário único de criar/editar (estado local + thunks) |
| `componentes/GaleriaFotosForm.tsx` | adicionar, pré-visualizar, remover e escolher capa (usa `useFotosAnuncio`) |
| `componentes/SeletorEstado.tsx` | troca de estado via `alterarEstadoThunk` |
| `anuncios.css` | estilos |

Provisório (substituir pela Área A): `src/features/auth/*`, `src/app/RotaProtegida.tsx` e a rota `*` do `App.tsx`.
