# Área C — Busca e detalhes de anúncios

## Funcionalidades implementadas

### RF04 — Busca e listagem

- Páginas separadas de vendas e doações.
- Listagem de anúncios ativos.
- Filtro por categoria.
- Filtros por preço mínimo e máximo para vendas.
- Ordenação por data e preço, conforme a modalidade.
- Paginação com 5, 10, 25 ou 50 itens.
- Persistência dos filtros, ordenação e paginação na URL.
- Tratamento de carregamento, erros e resultados vazios.

### RF03 — Detalhes do anúncio

- Exibição das informações completas do anúncio.
- Galeria interativa de fotografias.
- Identificação da fotografia de capa.
- Informações do anunciante e link para seu perfil.
- Botões de interesse e negociação reservados para as próximas etapas.
- Componente preparado para receber dados do Redux.

## Componentes documentados no Storybook

- AnuncioCard
- FiltrosBusca
- Paginacao
- GaleriaFotos

## Organização

- `components/`: componentes reutilizáveis e stories.
- `pages/`: páginas de vendas, doações e detalhes.
- `services/`: comunicação com a API.
- `types/`: interfaces e tipos TypeScript.
- `utils/`: interpretação dos parâmetros da URL.
- `mocks/`: dados simulados para o Storybook.

## Rotas para integração

| Rota | Componente |
|---|---|
| /vendas | Vendas |
| /doacoes | Doacoes |
| /anuncios/:id | DetalheAnuncio |
| /usuarios/:id | Perfil do anunciante (RF02) |

## Endpoints utilizados

- GET /categorias
- GET /anuncios
- GET /anuncios/:id

## Testes funcionais

As funcionalidades foram verificadas em ambiente local de desenvolvimento, utilizando o backend do projeto.

- Listagem de vendas e doações.
- Filtragem por categoria e preço.
- Ordenação dos anúncios.
- Paginação e atualização da URL.
- Exibição dos detalhes.
- Navegação entre as fotografias.

## Pendências de integração

- Conectar as páginas à autenticação oficial.
- Registrar as rotas no React Router compartilhado.
- Integrar a página de detalhes ao slice de anúncios e ao thunk oficial.
- Adequar os serviços ao cliente HTTP compartilhado, incluindo tratamento de sessão expirada.
- Validar as stories na configuração definitiva do Storybook.
- Alinhar os componentes compartilhados com os demais integrantes.

A estrutura temporária utilizada para os testes locais não faz parte dos arquivos versionados.