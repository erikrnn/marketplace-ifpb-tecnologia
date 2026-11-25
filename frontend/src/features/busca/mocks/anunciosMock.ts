import type {
  AnuncioResumo,
  Categoria,
  FotoAnuncio,
} from '../types/anuncio';

function criarImagem(rotulo: string, cor: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="640" height="400">
      <rect width="100%" height="100%" fill="${cor}" />
      <text x="50%" y="50%"
            dominant-baseline="middle"
            text-anchor="middle"
            font-size="28"
            fill="#334155">
        ${rotulo}
      </text>
    </svg>
  `;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const categoriasMock: Categoria[] = [
  {
    id: 1,
    nome: 'Periféricos e acessórios',
    slug: 'perifericos-e-acessorios',
  },
  {
    id: 2,
    nome: 'Computadores e armazenamento',
    slug: 'computadores-e-armazenamento',
  },
  {
    id: 3,
    nome: 'Eletrônica e automação',
    slug: 'eletronica-e-automacao',
  },
  {
    id: 4,
    nome: 'Áudio e vídeo',
    slug: 'audio-e-video',
  },
];

export const anuncioVendaMock: AnuncioResumo = {
  id: 1,
  titulo: 'Fone de ouvido Bluetooth',
  modalidade: 'venda',
  preco: 80,
  estado: 'ativo',
  estadoConservacao: 'seminovo',
  categoria: categoriasMock[3],
  capaUrl: criarImagem('Fone Bluetooth', '#e2e8f0'),
  anunciante: {
    id: 1,
    nome: 'Estudante de Exemplo',
  },
  publicadoEm: '2026-09-05T13:10:00Z',
};

export const anuncioDoacaoMock: AnuncioResumo = {
  ...anuncioVendaMock,
  id: 4,
  titulo: 'Carregador de notebook',
  modalidade: 'doacao',
  preco: null,
  estadoConservacao: 'usado',
  categoria: categoriasMock[1],
  capaUrl: criarImagem('Carregador', '#dbeafe'),
};

export const fotosMock: FotoAnuncio[] = [
  {
    id: 1,
    url: criarImagem('Vista frontal', '#e2e8f0'),
    capa: true,
  },
  {
    id: 2,
    url: criarImagem('Vista lateral', '#dbeafe'),
    capa: false,
  },
  {
    id: 3,
    url: criarImagem('Detalhes', '#dcfce7'),
    capa: false,
  },
];