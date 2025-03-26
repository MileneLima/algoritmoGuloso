const fs = require('fs');

const mapa = JSON.parse(fs.readFileSync('cidadesSCDistâncias.json', 'utf-8'));

function buscaBFS(origem, destino, mapa) {
    let fila = [[origem]];
    let visitados = new Set();

    while (fila.length > 0) {
        let caminho = fila.shift();
        let atual = caminho[caminho.length - 1];

        if (atual === destino) {
            let distanciaTotal = 0;
            for (let i = 0; i < caminho.length - 1; i++) {
                distanciaTotal += mapa[caminho[i]][caminho[i + 1]];
            }
            return { caminho, distanciaTotal };
        }

        if (!visitados.has(atual)) {
            visitados.add(atual);
            let vizinhos = mapa[atual] || {};
            for (let cidade of Object.keys(vizinhos)) {
                if (!visitados.has(cidade)) {
                    fila.push([...caminho, cidade]);
                }
            }
        }
    }

    throw new Error(`Não há caminho disponível de '${origem}' para '${destino}'.`);
}

// Testando aplicação com readline
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('Cidade de Origem: ', origem => {
    readline.question('Cidade de Destino: ', destino => {
        try {
            const { caminho, distanciaTotal } = buscaBFS(origem, destino, mapa);
            console.log('\nCaminho percorrido:');
            for (let i = 0; i < caminho.length - 1; i++) {
                console.log(`${caminho[i]} -> ${caminho[i + 1]}: ${mapa[caminho[i]][caminho[i + 1]]} km`);
            }
            console.log(`Distância total percorrida: ${distanciaTotal} km`);
        } catch (error) {
            console.error(error.message);
        }

        readline.close();
    });
});
