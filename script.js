const palavraBox = document.getElementById("palavra-box");
const opcoesContainer = document.getElementById("opcoes-container");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");
const container = document.getElementById("container");
const menu = document.getElementById("menu");
const contadorContainer = document.getElementById("contador-container");

let vocabulario = {};
let todasPalavras = [];
let palavras = [];
let limitePalavras = 100;

let i = 0;
let acertos = 0;
let erros = 0;

let palavrasAcertadas = [];
let palavrasErradas = [];

fetch("vocabulario.txt")
  .then(res => res.text())
  .then(texto => {
    texto.split("\n").forEach(linha => {
      linha = linha.trim();
      if (!linha || !linha.includes("=")) return;

      const [esq, dir] = linha.split("=");
      const palavra = esq.replace(/\(.*?\)/, "").trim().toLowerCase();
      const traducoes = dir.split("/").map(t => t.trim());

      vocabulario[palavra] = traducoes;
      todasPalavras.push(palavra);
    });
  });

function iniciarComLimite(limite) {
  limitePalavras = limite;

  menu.style.display = "none";
  palavraBox.style.display = "flex";
  opcoesContainer.style.display = "flex";
  contadorContainer.style.display = "flex";

  iniciarJogo();
}

function iniciarJogo() {
  // 👇 CORREÇÃO REAL
  palavras = todasPalavras
    .slice(0, limitePalavras)   // pega as PRIMEIRAS
    .sort(() => Math.random() - 0.5); // depois embaralha

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
    mostrarResultados();
    return;
  }

  const palavra = palavras[i];
  palavraBox.textContent =
    palavra.charAt(0).toUpperCase() + palavra.slice(1);

  opcoesContainer.innerHTML = "";
  criarOpcoes(palavra);
  atualizarContadores();
}

function criarOpcoes(palavraAtual) {
  const traducoes = vocabulario[palavraAtual];
  const correta =
    traducoes[Math.floor(Math.random() * traducoes.length)];

  let opcoes = [correta];

  while (opcoes.length < 4) {
    const p = palavras[Math.floor(Math.random() * palavras.length)];
    if (p === palavraAtual) continue;

    const errada =
      vocabulario[p][Math.floor(Math.random() * vocabulario[p].length)];

    if (!opcoes.includes(errada)) opcoes.push(errada);
  }

  opcoes.sort(() => Math.random() - 0.5);

  opcoes.forEach(opcao => {
    const btn = document.createElement("button");
    btn.className = "opcao-btn";
    btn.textContent = opcao;

    btn.onclick = () => {
      document.querySelectorAll(".opcao-btn")
        .forEach(b => b.disabled = true);

      const palavraFormatada =
        palavraAtual.charAt(0).toUpperCase() + palavraAtual.slice(1);

      if (opcao === correta) {
        btn.classList.add("correta");
        acertos++;
        palavrasAcertadas.push(`${palavraFormatada} = ${correta}`);
      } else {
        btn.classList.add("errada");
        erros++;
        palavrasErradas.push(`${palavraFormatada} = ${correta}`);
      }

      atualizarContadores();
      i++;
      setTimeout(mostrarPalavra, 1200);
    };

    opcoesContainer.appendChild(btn);
  });
}

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
    box.style.fontSize = "18px";
    box.style.fontWeight = "bold";
    box.style.color = "white";
    box.style.borderRadius = "12px";
    box.style.backgroundColor = cor;
    box.style.textAlign = "center";
    lista.appendChild(box);
  }

  container.appendChild(lista);
}
