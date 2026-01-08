const palavraBox = document.getElementById("palavra-box");
const opcoesContainer = document.getElementById("opcoes-container");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");
const contadorContainer = document.getElementById("contador-container");

// Para teste de atualização
document.getElementById("menu-principal").insertAdjacentHTML('beforeend', '<p style="color:#999; font-size:0.9rem;">Git 010</p>');

const menuPrincipal = document.getElementById("menu-principal");
const menuNiveis = document.getElementById("menu-niveis");
const menuIntervalos = document.getElementById("menu-intervalos");

let vocabulario = {};
let ordemArquivo = [];
let palavras = [];

let i = 0;
let acertos = 0;
let erros = 0;

let palavrasAcertadas = [];
let palavrasErradas = [];

/* ===============================
   CARREGAR VOCABULÁRIO
================================ */
fetch("vocabulario.txt")
  .then(res => res.text())
  .then(texto => {
    texto.split("\n").forEach(linha => {
      linha = linha.trim();
      if (!linha || !linha.includes("=")) return;

      const partes = linha.split("=");
      const palavra = partes[0].replace(/\(.*?\)/, "").trim().toLowerCase();
      const traducoes = partes[1].split("/").map(t => t.trim());

      vocabulario[palavra] = traducoes;
      ordemArquivo.push(palavra);
    });
  });

/* ===============================
   MENUS
================================ */
function abrirMenuNiveis() {
  menuPrincipal.style.display = "none";
  menuNiveis.style.display = "flex";
}

function abrirMenuIntervalos() {
  menuPrincipal.style.display = "none";
  menuIntervalos.style.display = "flex";
}

/* ===============================
   INICIAR MODOS
================================ */
function iniciarNivel(qtd) {
  palavras = ordemArquivo.slice(0, qtd);
  iniciarJogo();
}

function iniciarIntervalo(inicio, fim) {
  palavras = ordemArquivo.slice(inicio, fim);
  iniciarJogo();
}

/* ===============================
   JOGO
================================ */
function iniciarJogo() {
  menuNiveis.style.display = "none";
  menuIntervalos.style.display = "none";

  palavraBox.style.display = "flex";
  opcoesContainer.style.display = "flex";
  contadorContainer.style.display = "flex";

  palavras = palavras.sort(() => Math.random() - 0.5);

  i = 0;
  acertos = 0;
  erros = 0;
  palavrasAcertadas = [];
  palavrasErradas = [];

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
    atualizarContadores();
    return;
  }

  const palavra = palavras[i];
  palavraBox.textContent = palavra.charAt(0).toUpperCase() + palavra.slice(1);

  opcoesContainer.innerHTML = "";
  criarOpcoes(palavra);
  atualizarContadores();
}

function criarOpcoes(palavraAtual) {
  const traducoes = vocabulario[palavraAtual];
  const correta = traducoes[Math.floor(Math.random() * traducoes.length)];

  let opcoes = [correta];

  while (opcoes.length < 4) {
    const p = palavras[Math.floor(Math.random() * palavras.length)];
    if (p === palavraAtual) continue;

    const errada = vocabulario[p][Math.floor(Math.random() * vocabulario[p].length)];
    if (!opcoes.includes(errada)) opcoes.push(errada);
  }

  opcoes.sort(() => Math.random() - 0.5);

  opcoes.forEach(opca
