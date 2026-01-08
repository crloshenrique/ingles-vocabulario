const palavraBox = document.getElementById("palavra-box");
const opcoesContainer = document.getElementById("opcoes-container");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");
const contadorContainer = document.getElementById("contador-container");
const resultadosLista = document.getElementById("resultados-lista");
const btnReiniciar = document.getElementById("btn-reiniciar");

// Apenas para testar se o Github atualizou:
document.getElementById("menu-principal").insertAdjacentHTML('beforeend', '<p style="color:#999; font-size:0.9rem;">Git 025</p>');

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
    // Filtra apenas linhas válidas
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
   FUNÇÕES DE MENU (RESTAURADAS)
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
   LÓGICA DE SELEÇÃO
================================ */
function iniciarNivel(quantidade) {
    // Pega do início até a quantidade (25, 50, 100)
    palavrasParaOJogo = ordemArquivo.slice(0, quantidade);
    iniciarJogo();
}

function iniciarIntervalo(inicio, fim) {
    // Pega o intervalo exato (Ex: 25 a 50)
    palavrasParaOJogo = ordemArquivo.slice(inicio, fim);
    
    // Se o slice falhar por 1 item devido a quebras de linha, forçamos a correção
    if (palavrasParaOJogo.length === 24 && ordemArquivo[fim]) {
        palavrasParaOJogo.push(ordemArquivo[fim]);
    }
    iniciarJogo();
}

/* ===============================
   CONTROLE DO JOGO
================================ */
function iniciarJogo() {
  menuNiveis.style.display = "none";
  menuIntervalos.style.display = "none";
  
  palavraBox.style.display = "flex";
  opcoesContainer.style.display = "flex";
  contadorContainer.style.display = "flex";

  // Embaralha as 25 palavras selecionadas
  palavrasParaOJogo.sort(() => Math.random() - 0.5);
  
  acertos = 0; 
  erros = 0;
  historicoResultados = []; 
  resultadosLista.innerHTML = "";
  btnReiniciar.style.display = "none";
  
  proximaRodada();
}

function proximaRodada() {
  // Se a lista de palavras acabar, finaliza o teste
  if (palavrasParaOJogo.length === 0) {
    finalizarTeste();
    return;
  }

  // Pega a próxima palavra da lista
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
