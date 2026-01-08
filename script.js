const palavraBox = document.getElementById("palavra-box");
const opcoesContainer = document.getElementById("opcoes-container");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");
const contadorContainer = document.getElementById("contador-container");
const resultadosLista = document.getElementById("resultados-lista");
const btnReiniciar = document.getElementById("btn-reiniciar");

//Apenas para testar se o Github atualizou:
document.getElementById("menu-principal").insertAdjacentHTML('beforeend', '<p style="color:#999; font-size:0.9rem;">Git 017</p>');

const menuPrincipal = document.getElementById("menu-principal");
const menuNiveis = document.getElementById("menu-niveis");
const menuIntervalos = document.getElementById("menu-intervalos");

let vocabulario = {};
let ordemArquivo = [];
let palavrasParaOJogo = [];

let i = 0;
let acertos = 0;
let erros = 0;

// Agora usamos apenas UMA lista para salvar na ordem em que acontecem
let historicoResultados = []; 

// CARREGAR DADOS
fetch("vocabulario.txt")
  .then(res => res.text())
  .then(texto => {
    texto.split("\n").forEach(linha => {
      linha = linha.trim();
      if (!linha || !linha.includes("=")) return;

      const [esquerda, direita] = linha.split("=");
      const chave = esquerda.replace(/\(.*?\)/, "").trim().toLowerCase();
      const traducoes = direita.split("/").map(t => t.trim());

      vocabulario[chave] = { exibir: esquerda.trim(), traducoes: traducoes };
      ordemArquivo.push(chave);
    });

    document.getElementById("status-load").style.display = "none";
    document.getElementById("btn-niveis").style.display = "block";
    document.getElementById("btn-intervalos").style.display = "block";
  })
  .catch(err => {
    document.getElementById("status-load").textContent = "Erro ao carregar vocabulario.txt";
  });

function abrirMenuNiveis() {
  menuPrincipal.style.display = "none";
  menuNiveis.style.display = "flex";
}

function abrirMenuIntervalos() {
  menuPrincipal.style.display = "none";
  menuIntervalos.style.display = "flex";
}

function iniciarNivel(qtd) {
  palavrasParaOJogo = ordemArquivo.slice(0, qtd);
  iniciarJogo();
}

function iniciarIntervalo(inicio, fim) {
  palavrasParaOJogo = ordemArquivo.slice(inicio, fim);
  iniciarJogo();
}

function iniciarJogo() {
  menuNiveis.style.display = "none";
  menuIntervalos.style.display = "none";
  
  palavraBox.style.display = "flex";
  opcoesContainer.style.display = "flex";
  contadorContainer.style.display = "flex";

  palavrasParaOJogo.sort(() => Math.random() - 0.5);
  i = 0; acertos = 0; erros = 0;
  historicoResultados = []; // Limpa o histórico ao começar
  
  mostrarPalavra();
}

function mostrarPalavra() {
  if (i >= palavrasParaOJogo.length) {
    finalizarTeste();
    return;
  }

  const chave = palavrasParaOJogo[i];
  palavraBox.textContent = vocabulario[chave].exibir;
  opcoesContainer.innerHTML = "";
  
  criarOpcoes(chave);
  acertosBox.textContent = acertos;
  errosBox.textContent = erros;
}

function criarOpcoes(palavraAtual) {
  const corretaLista = vocabulario[palavraAtual].traducoes;
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

      // Criamos um objeto com a resposta e a cor para salvar no histórico
      let resultadoDaVez = {
        texto: `${vocabulario[palavraAtual].exibir} = ${correta}`,
        cor: ""
      };

      if (opcao === correta) {
        btn.classList.add("correta");
        acertos++;
        resultadoDaVez.cor = "#4CAF50"; // Verde
      } else {
        btn.classList.add("errada");
        erros++;
        resultadoDaVez.cor = "#f44336"; // Vermelho
        todos.forEach(b => { if (b.textContent === correta) b.classList.add("correta"); });
      }

      // Adiciona ao histórico na ordem exata em que foi respondida
      historicoResultados.push(resultadoDaVez);

      i++;
      setTimeout(mostrarPalavra, 1000);
    };
    opcoesContainer.appendChild(btn);
  });
}

function finalizarTeste() {
  palavraBox.textContent = "Teste finalizado!";
  opcoesContainer.style.display = "none";
  
  // Agora percorremos o histórico único, mantendo a ordem
  historicoResultados.forEach(item => {
    criarCard(item.texto, item.cor);
  });

  btnReiniciar.style.display = "block";
}

function criarCard(texto, cor) {
  const box = document.createElement("div");
  box.textContent = texto;
  box.style.cssText = `background:${cor}; color:white; padding:12px; border-radius:10px; font-weight:bold; margin-bottom: 8px;`;
  resultadosLista.appendChild(box);
}
