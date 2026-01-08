// Para teste de atualização
document.getElementById("menu-principal").insertAdjacentHTML('beforeend', '<p style="color:#999; font-size:0.9rem;">Git 012</p>');

const palavraBox = document.getElementById("palavra-box");
const opcoesContainer = document.getElementById("opcoes-container");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");
const contadorContainer = document.getElementById("contador-container");
const resultadosLista = document.getElementById("resultados-lista");
const btnReiniciar = document.getElementById("btn-reiniciar");

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

      const [esquerda, direita] = linha.split("=");
      
      // Remove parênteses para a chave da palavra
      const palavraChave = esquerda.replace(/\(.*?\)/, "").trim().toLowerCase();
      // Mantém a escrita original para exibição (com pronúncia se houver)
      const palavraExibicao = esquerda.trim(); 
      
      const traducoes = direita.split("/").map(t => t.trim());

      vocabulario[palavraChave] = {
        exibir: palavraExibicao,
        traducoes: traducoes
      };
      ordemArquivo.push(palavraChave);
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

function iniciarJogo() {
  menuNiveis.style.display = "none";
  menuIntervalos.style.display = "none";
  menuPrincipal.style.display = "none";

  palavraBox.style.display = "flex";
  opcoesContainer.style.display = "flex";
  contadorContainer.style.display = "flex";

  palavras = palavras.sort(() => Math.random() - 0.5);

  i = 0;
  acertos = 0;
  erros = 0;
  palavrasAcertadas = [];
  palavrasErradas = [];
  
  resultadosLista.innerHTML = "";
  btnReiniciar.style.display = "none";

  mostrarPalavra();
}

function atualizarContadores() {
  acertosBox.textContent = acertos;
  errosBox.textContent = erros;
}

/* ===============================
   LÓGICA DO JOGO
================================ */
function mostrarPalavra() {
  if (i >= palavras.length) {
    finalizarTeste();
    return;
  }

  const chave = palavras[i];
  const dados = vocabulario[chave];
  
  palavraBox.textContent = dados.exibir;
  opcoesContainer.innerHTML = "";
  
  criarOpcoes(chave);
  atualizarContadores();
}

function criarOpcoes(palavraAtual) {
  const corretaLista = vocabulario[palavraAtual].traducoes;
  const correta = corretaLista[Math.floor(Math.random() * corretaLista.length)];

  let opcoes = [correta];

  while (opcoes.length < 4) {
    const pAleatoria = ordemArquivo[Math.floor(Math.random() * ordemArquivo.length)];
    if (pAleatoria === palavraAtual) continue;

    const listaErradas = vocabulario[pAleatoria].traducoes;
    const errada = listaErradas[Math.floor(Math.random() * listaErradas.length)];

    if (!opcoes.includes(errada)) opcoes.push(errada);
  }

  opcoes.sort(() => Math.random() - 0.5);

  opcoes.forEach(opcao => {
    const btn = document.createElement("button");
    btn.className = "opcao-btn";
    btn.textContent = opcao;

    btn.onclick = function () {
      document.querySelectorAll(".opcao-btn").forEach(b => b.disabled = true);

      if (opcao === correta) {
        btn.classList.add("correta");
        acertos++;
        palavrasAcertadas.push(`${vocabulario[palavraAtual].exibir} = ${correta}`);
      } else {
        btn.classList.add("errada");
        erros++;
        palavrasErradas.push(`${vocabulario[palavraAtual].exibir} = ${correta}`);
        
        // Mostrar a correta para aprender com o erro
        document.querySelectorAll(".opcao-btn").forEach(b => {
          if (b.textContent === correta) b.classList.add("correta");
        });
      }

      atualizarContadores();
      i++;
      setTimeout(mostrarPalavra, 1200);
    };

    opcoesContainer.appendChild(btn);
  });
}

/* ===============================
   FINALIZAÇÃO
================================ */
function finalizarTeste() {
  palavraBox.textContent = "Teste finalizado!";
  opcoesContainer.innerHTML = "";
  opcoesContainer.style.display = "none"; // Remove o espaço das opções
  
  atualizarContadores();
  
  // Mostrar a lista detalhada
  palavrasAcertadas.forEach(p => criarCardResultado(p, "#4CAF50"));
  palavrasErradas.forEach(p => criarCardResultado(p, "#f44336"));
  
  btnReiniciar.style.display = "block";
}

function criarCardResultado(texto, cor) {
  const box = document.createElement("div");
  box.textContent = texto;
  box.style.background = cor;
  box.style.color = "white";
  box.style.padding = "12px";
  box.style.margin = "5px 0";
  box.style.borderRadius = "10px";
  box.style.fontWeight = "bold";
  box.style.fontSize = "16px";
  resultadosLista.appendChild(box);
}
