const palavraBox = document.getElementById("palavra-box");
const opcoesContainer = document.getElementById("opcoes-container");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");
const contadorContainer = document.getElementById("contador-container");
const resultadosLista = document.getElementById("resultados-lista");
const btnReiniciar = document.getElementById("btn-reiniciar");

// Teste de atualização:
document.getElementById("menu-principal").insertAdjacentHTML('beforeend', '<p style="color:#999; font-size:0.9rem;">Git 040</p>');

const menuPrincipal = document.getElementById("menu-principal");
const menuNiveis = document.getElementById("menu-niveis");
const menuIntervalos = document.getElementById("menu-intervalos");

let vocabulario = {};
let ordemArquivo = [];
let palavrasParaOJogo = [];
let palavraAtualObjeto = null;

let acertos = 0;
let erros = 0;
let historicoResultados = []; 

/* ===============================
   CARREGAR VOCABULÁRIO
================================ */
fetch("vocabulario.txt")
  .then(res => res.text())
  .then(texto => {
    // Carrega e limpa as palavras ignorando linhas vazias
    const linhas = texto.split("\n")
                        .map(l => l.trim())
                        .filter(l => l.includes("="));
    
    linhas.forEach(linha => {
      const [esquerda, direita] = linha.split("=");
      const chave = esquerda.replace(/\(.*?\)/, "").trim().toLowerCase();
      const traducoes = direita.split("/").map(t => t.trim());

      vocabulario[chave] = { exibir: esquerda.trim(), traducoes: traducoes };
      ordemArquivo.push(chave);
    });

    document.getElementById("status-load").style.display = "none";
    document.getElementById("btn-niveis").style.display = "block";
    document.getElementById("btn-intervalos").style.display = "block";
  });

/* ===============================
   FUNÇÕES DE MENU
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
   LÓGICA DE SELEÇÃO (FIXO 25)
================================ */

// Função para Níveis (25, 50, 100)
function iniciarNivel(quantidade) {
    palavrasParaOJogo = ordemArquivo.slice(0, quantidade);
    iniciarJogo();
}

// Função para Intervalos (1-25, 26-50, etc)
// Agora usamos o índice exato: 0 a 25 PEGA 25 ITENS.
function iniciarIntervalo(inicio, fim) {
    palavrasParaOJogo = ordemArquivo.slice(inicio, fim);
    
    // GARANTIA REAL: Se o seu arquivo tem 100 e o slice veio com 24, 
    // ele força a entrada da última palavra do bloco.
    if (palavrasParaOJogo.length < 25 && (fim - inicio) === 25) {
        if (ordemArquivo[fim - 1]) {
            palavrasParaOJogo = ordemArquivo.slice(inicio, fim);
        }
    }
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

  palavrasParaOJogo.sort(() => Math.random() - 0.5);
  
  acertos = 0; 
  erros = 0;
  historicoResultados = []; 
  resultadosLista.innerHTML = "";
  btnReiniciar.style.display = "none";
  
  proximaRodada();
}

function proximaRodada() {
  // O jogo só para quando a lista estiver ZERADA
  if (palavrasParaOJogo.length === 0) {
    finalizarTeste();
    return;
  }

  const chaveDavez = palavrasParaOJogo.shift();
  palavraAtualObjeto = { chave: chaveDavez, dados: vocabulario[chaveDavez] };

  palavraBox.textContent = palavraAtualObjeto.dados.exibir;
  opcoesContainer.innerHTML = "";
  
  criarOpcoes(chaveDavez);
  acertosBox.textContent = acertos;
  errosBox.textContent = erros;
}

function criarOpcoes(chaveAtual) {
  const corretaLista = vocabulario[chaveAtual].traducoes;
  const correta = corretaLista[Math.floor(Math.random() * corretaLista.length)];
  let opcoes = [correta];

  while (opcoes.length < 4) {
    const pAleatoria = ordemArquivo[Math.floor(Math.random() * ordemArquivo.length)];
    const errada = vocabulario[pAleatoria].traducoes[0];
    if (!opcoes.includes(errada)) opcoes.push(errada);
  }

  opcoes.sort(() => Math.random() - 0.5);

  opcoes.forEach(opcao => {
    const btn = document.createElement("button");
    btn.className = "opcao-btn";
    btn.textContent = opcao;
    btn.onclick = () => {
      const todos = document.querySelectorAll(".opcao-btn");
      todos.forEach(b => b.disabled = true);

      let resultadoDaVez = {
        texto: `${palavraAtualObjeto.dados.exibir} = ${correta}`,
        cor: ""
      };

      if (opcao === correta) {
        btn.classList.add("correta");
        acertos++;
        resultadoDaVez.cor = "#4CAF50";
      } else {
        btn.classList.add("errada");
        erros++;
        resultadoDaVez.cor = "#f44336";
        todos.forEach(b => { if (b.textContent === correta) b.classList.add("correta"); });
      }

      historicoResultados.push(resultadoDaVez);
      setTimeout(proximaRodada, 1000);
    };
    opcoesContainer.appendChild(btn);
  });
}

function finalizarTeste() {
  palavraBox.textContent = "Teste finalizado!";
  opcoesContainer.style.display = "none";
  
  historicoResultados.forEach(item => {
    const box = document.createElement("div");
    box.textContent = item.texto;
    box.style.cssText = `background:${item.cor}; color:white; padding:12px; border-radius:10px; font-weight:bold; margin-bottom: 8px;`;
    resultadosLista.appendChild(box);
  });

  btnReiniciar.style.display = "block";
}
