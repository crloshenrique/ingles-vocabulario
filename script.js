const palavraBox = document.getElementById("palavra-box");
const opcoesContainer = document.getElementById("opcoes-container");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");
const contadorContainer = document.getElementById("contador-container");
const resultadosLista = document.getElementById("resultados-lista");
const btnReiniciar = document.getElementById("btn-reiniciar");

// Atualizado conforme solicitado: Git 25
document.getElementById("menu-principal").insertAdjacentHTML('beforeend', '<p style="color:#999; font-size:0.9rem;">Git 43</p>');

const menuPrincipal = document.getElementById("menu-principal");
const menuNiveis = document.getElementById("menu-niveis");
const menuIntervalos = document.getElementById("menu-intervalos");

let vocabulario = []; // Mudamos para Array para evitar erro de chaves
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
    const linhas = texto.split("\n")
                        .map(l => l.trim())
                        .filter(l => l.includes("="));
    
    linhas.forEach(linha => {
      const [esquerda, direita] = linha.split("=");
      const exibir = esquerda.trim();
      const traducoes = direita.split("/").map(t => t.trim());

      // Guardamos tudo em um único array de objetos
      vocabulario.push({
        exibir: exibir,
        correta: traducoes[0],
        todas: traducoes
      });
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
   LÓGICA DE SELEÇÃO
================================ */

function iniciarNivel(quantidade) {
    palavrasParaOJogo = vocabulario.slice(0, quantidade);
    iniciarJogo();
}

function iniciarIntervalo(inicio, fim) {
    // Aqui o slice(0, 25) pega exatamente do 0 ao 24.
    palavrasParaOJogo = vocabulario.slice(inicio, fim);
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
  if (palavrasParaOJogo.length === 0) {
    finalizarTeste();
    return;
  }

  // Pega o objeto inteiro da lista
  palavraAtualObjeto = palavrasParaOJogo.shift();

  palavraBox.textContent = palavraAtualObjeto.exibir;
  opcoesContainer.innerHTML = "";
  
  criarOpcoes(palavraAtualObjeto);
  acertosBox.textContent = acertos;
  errosBox.textContent = erros;
}

function criarOpcoes(objetoAtual) {
  const correta = objetoAtual.correta;
  let opcoes = [correta];

  // Pega distrações do vocabulário total
  while (opcoes.length < 4) {
    const sorteio = vocabulario[Math.floor(Math.random() * vocabulario.length)];
    const distracao = sorteio.correta;
    if (!opcoes.includes(distracao)) opcoes.push(distracao);
  }

  opcoes.sort(() => Math.random() - 0.5);

  opcoes.forEach(opcao => {
    const btn = document.createElement("button");
    btn.className = "opcao-btn";
    btn.textContent = opcao;
    btn.onclick = () => {
      const todos = document.querySelectorAll(".opcao-btn");
      todos.forEach(b => b.disabled = true);

      let itemHistorico = {
        texto: `${objetoAtual.exibir} = ${correta}`,
        cor: ""
      };

      if (opcao === correta) {
        btn.classList.add("correta");
        acertos++;
        itemHistorico.cor = "#4CAF50";
      } else {
        btn.classList.add("errada");
        erros++;
        itemHistorico.cor = "#f44336";
        todos.forEach(b => { if (b.textContent === correta) b.classList.add("correta"); });
      }

      historicoResultados.push(itemHistorico);
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
