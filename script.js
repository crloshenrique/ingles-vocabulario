const palavraBox = document.getElementById("palavra-box");
const opcoesContainer = document.getElementById("opcoes-container");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");
const contador = document.getElementById("contador-container");
const menu = document.getElementById("menu");
const container = document.getElementById("container");

let vocabulario = {};
let palavras = [];
let limiteInicio = 0;
let limiteFim = 100;

let i = 0;
let acertos = 0;
let erros = 0;
let palavrasAcertadas = [];
let palavrasErradas = [];

// ===============================
// ESTADO INICIAL (CRÍTICO)
// ===============================
menu.style.display = "flex";
palavraBox.style.display = "none";
contador.style.display = "none";
opcoesContainer.innerHTML = "";

// ===============================
// CARREGAR VOCABULÁRIO
// ===============================
fetch("vocabulario.txt")
  .then(res => res.text())
  .then(texto => {
    texto.split("\n").forEach(linha => {
      linha = linha.trim();
      if (!linha || !linha.includes("=")) return;

      const [esq, dir] = linha.split("=");
      const match = esq.match(/^(.+?)(?:\s*\((.+?)\))?$/);
      if (!match) return;

      const palavra = match[1].trim().toLowerCase();
      const significados = dir.split("/").map(s => s.trim());

      vocabulario[palavra] = significados;
    });

    mostrarMenuInicial();
  });

// ===============================
// MENUS
// ===============================
function mostrarMenuInicial() {
  menu.style.display = "flex";
  menu.innerHTML = `
    <button class="opcao-btn" onclick="menuEscolherPalavras()">Escolher palavras</button>
    <button class="opcao-btn" onclick="menuNiveis()">Jogar por níveis</button>
  `;
}

function menuNiveis() {
  menu.innerHTML = `
    <button class="opcao-btn" onclick="iniciarTeste(0,25)">Iniciante (25%)</button>
    <button class="opcao-btn" onclick="iniciarTeste(0,50)">Intermediário (50%)</button>
    <button class="opcao-btn" onclick="iniciarTeste(0,75)">Avançado (75%)</button>
    <button class="opcao-btn" onclick="iniciarTeste(0,100)">Pro (100%)</button>
  `;
}

function menuEscolherPalavras() {
  menu.innerHTML = `
    <button class="opcao-btn" onclick="iniciarTeste(0,25)">0 à 25</button>
    <button class="opcao-btn" onclick="iniciarTeste(25,50)">25 à 50</button>
    <button class="opcao-btn" onclick="iniciarTeste(50,75)">50 à 75</button>
    <button class="opcao-btn" onclick="iniciarTeste(75,100)">75 à 100</button>
  `;
}

// ===============================
// JOGO
// ===============================
function iniciarTeste(inicio, fim) {
  limiteInicio = inicio;
  limiteFim = fim;

  palavras = Object.keys(vocabulario)
    .slice(limiteInicio, limiteFim)
    .sort(() => Math.random() - 0.5);

  // RESET VISUAL
  menu.style.display = "none";
  palavraBox.style.display = "flex";
  contador.style.display = "flex";
  opcoesContainer.innerHTML = "";

  // RESET DADOS
  i = 0;
  acertos = 0;
  erros = 0;
  palavrasAcertadas = [];
  palavrasErradas = [];

  acertosBox.textContent = "0";
  errosBox.textContent = "0";

  // LIMPAR RESULTADOS ANTIGOS
  document.querySelectorAll(".resultado-final").forEach(e => e.remove());

  mostrarPalavra();
}

function mostrarPalavra() {
  if (i >= palavras.length) {
    palavraBox.textContent = "Teste finalizado!";
    opcoesContainer.innerHTML = "";
    mostrarResultados();
    return;
  }

  const palavra = palavras[i];
  palavraBox.textContent = palavra.charAt(0).toUpperCase() + palavra.slice(1);

  const correta = vocabulario[palavra][Math.floor(Math.random() * vocabulario[palavra].length)];

  let opcoes = [correta];
  while (opcoes.length < 4) {
    const p = palavras[Math.floor(Math.random() * palavras.length)];
    const s = vocabulario[p][Math.floor(Math.random() * vocabulario[p].length)];
    if (!opcoes.includes(s)) opcoes.push(s);
  }

  opcoes.sort(() => Math.random() - 0.5);
  opcoesContainer.innerHTML = "";

  opcoes.forEach(opcao => {
    const btn = document.createElement("button");
    btn.className = "opcao-btn";
    btn.textContent = opcao;

    btn.onclick = () => {
      document.querySelectorAll(".opcao-btn").forEach(b => b.disabled = true);

      const textoFinal = `${palavra.charAt(0).toUpperCase() + palavra.slice(1)} = ${correta}`;

      if (opcao === correta) {
        btn.classList.add("correta");
        acertos++;
        palavrasAcertadas.push(textoFinal);
      } else {
        btn.classList.add("errada");
        erros++;
        palavrasErradas.push(textoFinal);
      }

      acertosBox.textContent = acertos;
      errosBox.textContent = erros;

      i++;
      setTimeout(mostrarPalavra, 1200);
    };

    opcoesContainer.appendChild(btn);
  });
}

// ===============================
// RESULTADOS
// ===============================
function mostrarResultados() {
  const lista = document.createElement("div");
  lista.className = "resultado-final";
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
    box.style.fontWeight = "bold";
    box.style.color = "white";
    box.style.borderRadius = "12px";
    box.style.backgroundColor = cor;
    box.style.textAlign = "center";
    lista.appendChild(box);
  }

  container.appendChild(lista);
}
