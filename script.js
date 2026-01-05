// Elementos
const palavraBox = document.getElementById("palavra-box");
const progressoBox = document.getElementById("progresso-box");
const input = document.getElementById("resposta");
const mensagemDiv = document.getElementById("mensagem");
const traducaoBox = document.getElementById("traducao-box");
const acertosBox = document.getElementById("acertos-box");
const errosBox = document.getElementById("erros-box");
const menuBox = document.getElementById("menu-box");
const botaoIngles = document.getElementById("modo-ingles");
const botaoPortugues = document.getElementById("modo-portugues");

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
let modo = null; // "ingles" ou "portugues"

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
  const pronuncia = Array.isArray(dados) ? dados[0].pronuncia : dados.pronuncia;

  let palavraExibir;
  if (modo === "ingles") {
    // Palavra em inglês com pronúncia
    palavraExibir = `${palavra.charAt(0).toUpperCase() + palavra.slice(1)} (${pronuncia})`;
  } else {
    // Palavra em português, sem pronúncia
    if (Array.isArray(dados)) {
      palavraExibir = dados.map(d => d.significado).join(" / ");
    } else {
      palavraExibir = dados.significado;
    }
  }

  palavraBox.textContent = palavraExibir;
  palavraBox.style.color = "white";

  input.value = "";
  input.focus();
  mensagemDiv.textContent = "";

  // Resetar retângulo de tradução
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
  let significadosArray = [];

  // Determinar significado esperado dependendo do modo
  if (modo === "ingles") {
    // Você digita a tradução em português
    if (Array.isArray(dados)) {
      significadosArray = dados.map(d => d.significado);
      const significadosLower = significadosArray.map(d => d.toLowerCase());
      if (significadosLower.includes(resposta)) correto = true;
    } else {
      significadosArray = [dados.significado];
      if (resposta === dados.significado.toLowerCase()) correto = true;
    }
  } else {
    // Você digita a tradução em inglês
    if (Array.isArray(dados)) {
      significadosArray = dados.map(d => d.significado);
      const palavrasLower = dados.map(d => Object.keys(vocabulario).find(k => vocabulario[k] === d).toLowerCase());
      if (palavrasLower.includes(resposta)) correto = true;
    } else {
      significadosArray = [dados.significado];
      if (resposta === palavra.toLowerCase()) correto = true;
    }
  }

  // Mostrar tradução correta com cor
  if (modo === "ingles") {
    traducaoBox.textContent = significadosArray.join(" / ");
  } else {
    traducaoBox.textContent = palavra.charAt(0).toUpperCase() + palavra.slice(1);
  }
  traducaoBox.style.color = correto ? "green" : "red";

  // Atualizar acertos e erros
  if (correto) {
    acertos++;
  } else {
    erros++;
  }

  i++;
  atualizarProgresso();

  // Pequeno delay para permitir ver a tradução antes de ir para a próxima palavra
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

// Enter no input envia
input.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    responder();
  }
});

// Selecionar modo
botaoIngles.addEventListener("click", () => iniciarJogo("ingles"));
botaoPortugues.addEventListener("click", () => iniciarJogo("portugues"));

function iniciarJogo(selecionado) {
  modo = selecionado;
  menuBox.style.display = "none";
  mostrarPalavra();
}
