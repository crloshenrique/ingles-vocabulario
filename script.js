const palavraBox = document.getElementById("palavra-box");
const opcoesContainer = document.getElementById("opcoes-container");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");
const contador = document.getElementById("contador-container");
const container = document.getElementById("container");

console.log("1")

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
  });

// ===============================
// ABRIR MENUS
// ===============================
function abrirMenuNiveis() {
  document.getElementById("menu-principal").style.display = "none";
  document.getElementById("menu-niveis").style.display = "flex";
}

function abrirMenuIntervalos() {
  document.getElementById("menu-principal").style.display = "none";
  document.getElementById("menu-intervalos").style.display = "flex";
}

function voltarMenuPrincipal() {
  document.getElementById("menu-principal").style.display = "flex";
  document.getElementById("menu-niveis").style.display = "none";
  document.getElementById("menu-intervalos").style.display = "none";
}

// ===============================
// INICIAR NÍVEL / INTERVALO
// ===============================
function iniciarNivel(porcentagem) {
  const total = Object.keys(vocabulario).length;
  const fim = Math.floor((porcentagem / 100) * total);
  iniciarTeste(0, fim);
}

function iniciarIntervalo(inicio, fim) {
  iniciarTeste(inicio, fim);
}

// ===============================
// INICIAR TESTE
// ===============================
function iniciarTeste(inicio, fim) {
  limiteInicio = inicio;
  limiteFim = fim;

  palavras = Object.keys(vocabulario)
    .slice(limiteInicio, limiteFim)
    .sort(() => Math.random() - 0.5);

  // esconder menus
  document.getElementById("menu-principal").style.display = "none";
  document.getElementById("menu-niveis").style.display = "none";
  document.getElementById("menu-intervalos").style.display = "none";

  // mostrar elementos do jogo
  palavraBox.style.display = "flex";
  opcoesContainer.style.display = "flex";
  contador.style.display = "flex";
  opcoesContainer.innerHTML = "";

  // reset de contadores
  i = 0;
  acertos = 0;
  erros = 0;
  palavrasAcertadas = [];
  palavrasErradas = [];
  acertosBox.textContent = "0";
  errosBox.textContent = "0";

  // remover resultados antigos
  document.querySelectorAll(".resultado-final").forEach(e => e.remove());

  mostrarPalavra();
}

// ===============================
// MOSTRAR PALAVRA
// ===============================
function mostrarPalavra() {
  if (i >= palavras.length) {
    palavraBox.textContent = "Teste finalizado!";
    palavraBox.style.display = "flex";
    opcoesContainer.innerHTML = "";
    opcoesContainer.style.display = "none";
    contador.style.display = "flex";
    mostrarResultados();
    return;
  }

  const palavra = palavras[i];
  palavraBox.textContent = palavra.charAt(0).toUpperCase() + palavra.slice(1);
  palavraBox.style.display = "flex";

  const correta = vocabulario[palavra][Math.floor(Math.random() * vocabulario[palavra].length)];

  let opcoes = [correta];
  while (opcoes.length < 4) {
    const p = palavras[Math.floor(Math.random() * palavras.length)];
    const s = vocabulario[p][Math.floor(Math.random() * vocabulario[p].length)];
    if (!opcoes.includes(s)) opcoes.push(s);
  }

  opcoes.sort(() => Math.random() - 0.5);
  opcoesContainer.innerHTML = "";
  opcoesContainer.style.display = "flex";

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
