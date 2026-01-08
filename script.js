const palavraBox = document.getElementById("palavra-box");
const opcoesContainer = document.getElementById("opcoes-container");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");
const contadorContainer = document.getElementById("contador-container");
const resultadosLista = document.getElementById("resultados-lista");
const btnReiniciar = document.getElementById("btn-reiniciar");

// Apenas para testar se o Github atualizou:
document.getElementById("menu-principal").insertAdjacentHTML('beforeend', '<p style="color:#999; font-size:0.9rem;">Git 022</p>');

const menuPrincipal = document.getElementById("menu-principal");
const menuNiveis = document.getElementById("menu-niveis");
const menuIntervalos = document.getElementById("menu-intervalos");

let vocabulario = {};
let ordemArquivo = [];
let palavrasParaOJogo = [];

let i = 0;
let acertos = 0;
let erros = 0;

// Lista para salvar os resultados na ordem exata de resposta
let historicoResultados = []; 

/* ===============================
   CARREGAR VOCABULÁRIO
================================ */
fetch("vocabulario.txt")
  .then(res => res.text())
  .then(texto => {
    // Dividimos por quebra de linha e processamos cada uma
    texto.split("\n").forEach(linha => {
      linha = linha.trim();
      
      // FILTRO: Ignora linhas vazias ou que não sejam definições de palavras
      if (!linha || !linha.includes("=")) return;

      const [esquerda, direita] = linha.split("=");
      
      // Remove parênteses para criar a chave de busca (id da palavra)
      const chave = esquerda.replace(/\(.*?\)/, "").trim().toLowerCase();
      // Guarda as traduções separadas por "/"
      const traducoes = direita.split("/").map(t => t.trim());

      vocabulario[chave] = { 
        exibir: esquerda.trim(), 
        traducoes: traducoes 
      };
      
      // Adiciona na lista oficial de palavras válidas
      ordemArquivo.push(chave);
    });

    // Libera os botões do menu apenas após o carregamento completo
    document.getElementById("status-load").style.display = "none";
    document.getElementById("btn-niveis").style.display = "block";
    document.getElementById("btn-intervalos").style.display = "block";
  })
  .catch(err => {
    document.getElementById("status-load").textContent = "Erro ao carregar vocabulario.txt";
    console.error(err);
  });

/* ===============================
   LÓGICA DOS MENUS
================================ */
function abrirMenuNiveis() {
  menuPrincipal.style.display = "none";
  menuNiveis.style.display = "flex";
}

function abrirMenuIntervalos() {
  menuPrincipal.style.display = "none";
  menuIntervalos.style.display = "flex";
}

function iniciarNivel(qtd) {
  // Pega as X primeiras palavras filtradas
  palavrasParaOJogo = ordemArquivo.slice(0, Math.min(qtd, ordemArquivo.length));
  iniciarJogo();
}

function iniciarIntervalo(inicio, fim) {
  // Pega o intervalo exato (o fim é exclusivo no slice)
  palavrasParaOJogo = ordemArquivo.slice(inicio, fim);
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

  // Embaralha as palavras escolhidas para o teste
  palavrasParaOJogo.sort(() => Math.random() - 0.5);
  
  i = 0; 
  acertos = 0; 
  erros = 0;
  historicoResultados = []; 
  resultadosLista.innerHTML = "";
  
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
  
  // Atualiza os números no topo
  acertosBox.textContent = acertos;
  errosBox.textContent = erros;
}

function criarOpcoes(palavraAtual) {
  const corretaLista = vocabulario[palavraAtual].traducoes;
  const correta = corretaLista[Math.floor(Math.random() * corretaLista.length)];
  let opcoes = [correta];

  // Preenche com 3 opções erradas aleatórias
  while (opcoes.length < 4) {
    const pAleatoria = ordemArquivo[Math.floor(Math.random() * ordemArquivo.length)];
    const errada = vocabulario[pAleatoria].traducoes[0];
    
    if (!opcoes.includes(errada)) {
      opcoes.push(errada);
    }
  }

  // Embaralha os botões
  opcoes.sort(() => Math.random() - 0.5);

  opcoes.forEach(opcao => {
    const btn = document.createElement("button");
    btn.className = "opcao-btn";
    btn.textContent = opcao;
    btn.onclick = () => {
      const todos = document.querySelectorAll(".opcao-btn");
      todos.forEach(b => b.disabled = true);

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
        // Mostra qual era a resposta certa
        todos.forEach(b => { 
          if (b.textContent === correta) b.classList.add("correta"); 
        });
      }

      // Salva no histórico para exibir no final na ordem certa
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
  
  // Exibe os cards na ordem em que foram respondidos
  historicoResultados.forEach(item => {
    const box = document.createElement("div");
    box.textContent = item.texto;
    box.style.cssText = `background:${item.cor}; color:white; padding:12px; border-radius:10px; font-weight:bold; margin-bottom: 8px;`;
    resultadosLista.appendChild(box);
  });

  btnReiniciar.style.display = "block";
}
