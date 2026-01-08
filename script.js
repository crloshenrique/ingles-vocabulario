const palavraBox = document.getElementById("palavra-box");
const opcoesContainer = document.getElementById("opcoes-container");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");
const contadorContainer = document.getElementById("contador-container");
const resultadosLista = document.getElementById("resultados-lista");
const btnReiniciar = document.getElementById("btn-reiniciar");

// Apenas para testar se o Github atualizou:
document.getElementById("menu-principal").insertAdjacentHTML('beforeend', '<p style="color:#999; font-size:0.9rem;">Git 027</p>');

const menuPrincipal = document.getElementById("menu-principal");
const menuNiveis = document.getElementById("menu-niveis");
const menuIntervalos = document.getElementById("menu-intervalos");

let vocabulario = {};
let ordemArquivo = [];
let palavrasParaOJogo = [];
let palavraAtualObjeto = null; // Armazena a palavra da rodada

let acertos = 0;
let erros = 0;
let historicoResultados = []; 

/* ===============================
   CARREGAR VOCABULÁRIO
================================ */
fetch("vocabulario.txt")
  .then(res => res.text())
  .then(texto => {
    const linhas = texto.split("\n").map(l => l.trim()).filter(l => l.includes("="));
    
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

// Opções de 25, 50, 75 ou 100 palavras
function iniciarNivel(qtd) {
  palavrasParaOJogo = ordemArquivo.slice(0, qtd);
  iniciarJogo();
}

// Opções de intervalos fixos
function iniciarIntervalo(inicio, fim) {
  palavrasParaOJogo = ordemArquivo.slice(inicio, fim);
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

  // Embaralha o bloco selecionado
  palavrasParaOJogo.sort(() => Math.random() - 0.5);
  
  acertos = 0; 
  erros = 0;
  historicoResultados = []; 
  resultadosLista.innerHTML = "";
  btnReiniciar.style.display = "none";
  
  proximaRodada();
}

function proximaRodada() {
  // Se não houver mais palavras na lista, finaliza
  if (palavrasParaOJogo.length === 0) {
    finalizarTeste();
    return;
  }

  // Pega a PRÓXIMA palavra da lista (remove da lista original do jogo)
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

  // Busca distrações nas 100 palavras do arquivo
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
