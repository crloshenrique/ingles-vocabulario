const palavraBox = document.getElementById("palavra-box");
const opcoesContainer = document.getElementById("opcoes-container");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");
const container = document.getElementById("container");

// ===============================
// VOCABULÁRIO
// ===============================
let vocabulario = {};
let palavras = [];

fetch("vocabulario.txt")
  .then(res => res.text())
  .then(texto => {
    const linhas = texto.split("\n");

    linhas.forEach(linha => {
      linha = linha.trim();
      if (!linha || linha.startsWith("#") || !linha.includes("=")) return;

      const [esquerda, direita] = linha.split("=");

      const match = esquerda.match(/^(.+?)(?:\s*\((.+?)\))?$/);
      if (!match) return;

      const palavra = match[1].trim().toLowerCase();
      const pronuncia = match[2] ? match[2].trim() : "";

      const significados = direita.split("/").map(s => s.trim());

      vocabulario[palavra] = significados.map(sig => ({
        significado: sig,
        pronuncia
      }));
    });

    iniciarJogo();
  });

// ===============================
// VARIÁVEIS
// ===============================
let i = 0;
let acertos = 0;
let erros = 0;

let palavrasAcertadas = [];
let palavrasErradas = [];

// ===============================
// FUNÇÕES
// ===============================
function iniciarJogo() {
  palavras = Object.keys(vocabulario).sort(() => Math.random() - 0.5);
  mostrarPalavra();
}

function atualizarContadores() {
  acertosBox.textContent = acertos;
  errosBox.textContent = erros;
}

function mostrarPalavra() {
  if (i >= palavras.length) {
    palavraBox.textContent = "Teste finalizado!";
    opcoesContainer.innerHTML = "";
    mostrarResultados();
    return;
  }

  const palavra = palavras[i];
  const dados = vocabulario[palavra];
  const pronuncia = dados[0].pronuncia;

  const palavraExibir =
    palavra.charAt(0).toUpperCase() + palavra.slice(1);

  palavraBox.textContent = pronuncia
    ? `${palavraExibir} (${pronuncia})`
    : palavraExibir;

  opcoesContainer.innerHTML = "";
  criarOpcoes(palavra);
  atualizarContadores();
}

function criarOpcoes(palavraAtual) {
  const dados = vocabulario[palavraAtual];
  const correta = dados[Math.floor(Math.random() * dados.length)].significado;

  let opcoes = [correta];
  let tentativas = 0;

  while (opcoes.length < 4 && tentativas < 20) {
    tentativas++;
    const palavraAleatoria =
      palavras[Math.floor(Math.random() * palavras.length)];
    if (palavraAleatoria === palavraAtual) continue;

    const traducoes = vocabulario[palavraAleatoria];
    const errada =
      traducoes[Math.floor(Math.random() * traducoes.length)].significado;

    if (!opcoes.includes(errada)) opcoes.push(errada);
  }

  while (opcoes.length < 4) opcoes.push(opcoes[0]);

  opcoes.sort(() => Math.random() - 0.5);

  opcoes.forEach(opcao => {
    const btn = document.createElement("button");
    btn.textContent = opcao;
    btn.className = "opcao-btn";

    btn.onclick = () => {
      document
        .querySelectorAll(".opcao-btn")
        .forEach(b => (b.disabled = true));

      const palavraFormatada =
        palavraAtual.charAt(0).toUpperCase() + palavraAtual.slice(1);

      const traducoes = vocabulario[palavraAtual];
      const traducaoAleatoria =
        traducoes[Math.floor(Math.random() * traducoes.length)].significado;

      const textoFinal = `${palavraFormatada} = ${traducaoAleatoria}`;

      if (opcao === correta) {
        btn.classList.add("correta");
        acertos++;
        palavrasAcertadas.push(textoFinal);
      } else {
        btn.classList.add("errada");
        erros++;
        palavrasErradas.push(textoFinal);

        document
          .querySelectorAll(".opcao-btn")
          .forEach(b => {
            if (b.textContent === correta) {
              b.classList.add("correta");
            }
          });
      }

      atualizarContadores();
      i++;
      setTimeout(mostrarPalavra, 1400);
    };

    opcoesContainer.appendChild(btn);
  });
}

// ===============================
// RESULTADOS FINAIS
// ===============================
function mostrarResultados() {
  const lista = document.createElement("div");
  lista.style.display = "flex";
  lista.style.flexWrap = "wrap";
  lista.style.gap = "10px";
  lista.style.marginTop = "15px";

  palavrasAcertadas.forEach(p => criarBox(p, "#4CAF50"));
  palavrasErradas.forEach(p => criarBox(p, "#f44336"));

  function criarBox(texto, cor) {
    const box = document.createElement("div");
    box.textContent = texto;
    box.style.flex = "1 1 45%";
    box.style.padding = "12px";
    box.style.fontSize = "20px";
    box.style.fontWeight = "bold";
    box.style.color = "white";
    box.style.borderRadius = "12px";
    box.style.backgroundColor = cor;
    box.style.textAlign = "center";
    lista.appendChild(box);
  }

  container.appendChild(lista);
}
