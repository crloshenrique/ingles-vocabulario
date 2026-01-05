// Elementos
const menuInicial = document.getElementById("menu-inicial");
const treinoContainer = document.getElementById("treino-container");
const palavraBox = document.getElementById("palavra-box");
const progressoBox = document.getElementById("progresso-box");
const input = document.getElementById("resposta");
const mensagemDiv = document.getElementById("mensagem");
const traducaoBox = document.getElementById("traducao-box");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");
const botaoResponder = document.getElementById("botao-responder");

// Recorde
let recorde = 0;
fetch("recorde.txt")
  .then(res => res.text())
  .then(texto => {
    recorde = parseInt(texto) || 0;
  })
  .catch(() => {
    recorde = 0;
  });

// Embaralhar palavras
const palavras = Object.keys(vocabulario).sort(() => Math.random() - 0.5);

let i = 0;
let acertos = 0;
let erros = 0;
const totalPalavras = palavras.length;

// Modo de treino: "ingles" ou "portugues"
let modo = "ingles";

// Seleção do modo
document.getElementById("modo-ingles").addEventListener("click", () => iniciarTreino("ingles"));
document.getElementById("modo-portugues").addEventListener("click", () => iniciarTreino("portugues"));

function iniciarTreino(selecionado) {
  modo = selecionado;
  menuInicial.style.display = "none";
  treinoContainer.style.display = "block";
  mostrarPalavra();
}

// Atualizar progresso
function atualizarProgresso() {
  progressoBox.textContent = `Acertos: ${acertos} / ${totalPalavras}`;
  acertosBox.textContent = acertos;
  errosBox.textContent = erros;
}

// Mostrar palavra atual
function mostrarPalavra() {
  if (i >= palavras.length) {
    finalizar();
    return;
  }

  const palavra = palavras[i];
  const dados = vocabulario[palavra];

  let textoExibir;
  let pronuncia = Array.isArray(dados) ? dados[0].pronuncia : dados.pronuncia;

  if (modo === "ingles") {
    textoExibir = palavra.charAt(0).toUpperCase() + palavra.slice(1) + ` (${pronuncia})`;
  } else {
    // Mostrar significado principal
    if (Array.isArray(dados)) {
      textoExibir = dados.map(d => d.significado).join(" / ");
    } else {
      textoExibir = dados.significado;
    }
  }

  palavraBox.textContent = textoExibir;
  palavraBox.style.color = "white";

  input.value = "";
  input.focus();
  traducaoBox.textContent = "";
  traducaoBox.style.color = "#333";

  atualizarProgresso();
}

// Responder
function responder() {
  if (i >= palavras.length) return;

  const palavra = palavras[i];
  const dados = vocabulario[palavra];
  const resposta = input.value.trim().toLowerCase();

  if (!resposta) return;

  let correto = false;
  let respostasCorretas = [];

  if (modo === "ingles") {
    // Mostra tradução em português
    if (Array.isArray(dados)) {
      respostasCorretas = dados.map(d => d.significado);
      const lower = respostasCorretas.map(d => d.toLowerCase());
      if (lower.includes(resposta)) correto = true;
    } else {
      respostasCorretas = [dados.significado];
      if (resposta === dados.significado.toLowerCase()) correto = true;
    }
  } else {
    // Modo português → resposta deve ser palavra em inglês
    const palavraIngles = palavra;
    respostasCorretas = [palavraIngles.charAt(0).toUpperCase() + palavraIngles.slice(1)];
    if (resposta.toLowerCase() === palavraIngles.toLowerCase()) correto = true;
  }

  // Mostrar tradução correta com cor
  traducaoBox.textContent = respostasCorretas.join(" / ");
  traducaoBox.style.color = correto ? "green" : "red";

  if (correto) {
    acertos++;
  } else {
    erros++;
  }

  i++;
  atualizarProgresso();

  // Delay para ver a tradução antes de avançar
  setTimeout(mostrarPalavra, 700);
}

// Finalizar
function finalizar() {
  palavraBox.textContent = "✅ Teste finalizado!";
  input.disabled = true;
  traducaoBox.textContent = "";
  atualizarProgresso();

  if (acertos > recorde) {
    recorde = acertos;
    fetch("recorde.txt", {
      method: "POST",
      body: String(acertos)
    });
    mensagemDiv.innerHTML = `<br>🏆 Novo recorde! Acertos: ${acertos}`;
  } else {
    mensagemDiv.innerHTML = `<br>Você acertou ${acertos} palavras. Seu recorde: ${recorde}`;
  }
}

// Enter ou botão envia
input.addEventListener("keydown", event => {
  if (event.key === "Enter") responder();
});
botaoResponder.addEventListener("click", responder);
