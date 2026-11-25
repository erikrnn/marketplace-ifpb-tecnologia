// Decide quais botões de página mostrar. Em vez de listar as 50 páginas,
// mostra a primeira, a última e a vizinhança da atual, com "reticências" nos buracos.
// Ex.: atual 5, total 10  ->  [1, 'reticencias', 4, 5, 6, 'reticencias', 10]
export type ItemPaginacao = number | 'reticencias';

export function gerarPaginas(atual: number, total: number): ItemPaginacao[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, indice) => indice + 1);
    }

    const desejadas = new Set([1, total, atual - 1, atual, atual + 1]);
    const validas = [...desejadas].filter((pagina) => pagina >= 1 && pagina <= total).sort((a, b) => a - b);

    const resultado: ItemPaginacao[] = [];
    validas.forEach((pagina, indice) => {
        if (indice > 0) {
            const anterior = validas[indice - 1];
            if (pagina - anterior === 2) {
                resultado.push(anterior + 1); // buraco de uma página só: mostra a página
            } else if (pagina - anterior > 2) {
                resultado.push('reticencias');
            }
        }
        resultado.push(pagina);
    });
    return resultado;
}