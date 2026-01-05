// Elementos
const palavraDiv = document.getElementById("palavra");
const input = document.getElementById("resposta");
const mensagemDiv = document.getElementById("mensagem");

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

// Mostrar a primeira palavra
function mostrarPalavra() {
  if (i >= palavras.length) {
    finalizar();
    return;
  }

  const palavra = palavras[i];
  const dados = vocabulario[palavra];
  const pronuncia = Array.isArray(dados) ? dados[0].pronuncia : dados.pronuncia;

  palavraDiv.textContent = `${palavra} (${pronuncia})`;
  input.value = "";
  input.focus();
  mensagemDiv.textContent = "";
}

// Responder
function responder() {
  const palavra = palavras[i];
  const dados = vocabulario[palavra];
  const resposta = input.value.trim().toLowerCase();

  if (!resposta) return;

  let correto = false;

  if (Array.isArray(dados)) {
    const significados = dados.map(d => d.significado.toLowerCase());
    if (significados.includes(resposta)) correto = true;
  } else {
    if (resposta === dados.significado.toLowerCase()) correto = true;
  }

  if (correto) {
    acertos++;
    i++;
    mostrarPalavra();
  } else {
    let corretosText = Array.isArray(dados)
      ? dados.map(d => d.significado).join(" / ")
      : dados.significado;

    mensagemDiv.innerHTML = `❌ Resposta incorreta! <br>Significado correto: ${corretosText}`;
    finalizar();
  }
}

// Finalizar
function finalizar() {
  palavraDiv.textContent = "✅ Teste finalizado!";
  input.disabled = true;

  // Atualiza recorde local
  if (acertos > recorde) {
    recorde = acertos;
    fetch("recorde.txt", {
      method: "POST",
      body: String(acertos)
    });
    mensagemDiv.innerHTML += `<br>🏆 Novo recorde! Acertos: ${acertos}`;
  } else {
    mensagemDiv.innerHTML += `<br>Você acertou ${acertos} palavras. Seu recorde: ${recorde}`;
  }
}

// Enter no input envia
input.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    responder();
  }
});

// Começa o jogo
mostrarPalavra();
