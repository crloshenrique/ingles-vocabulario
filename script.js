let palavras = Object.keys(vocabulario).sort(() => Math.random() - 0.5);

let indice = 0;
let acertos = 0;
let jogoEncerrado = false;

const palavraDiv = document.getElementById("palavra");
const mensagemDiv = document.getElementById("mensagem");
const input = document.getElementById("resposta");

function mostrarPalavra() {
  if (indice >= palavras.length) {
    finalizar(true);
    return;
  }

  const palavra = palavras[indice];
  const dados = vocabulario[palavra];
  const pronuncia = Array.isArray(dados) ? dados[0].pronuncia : dados.pronuncia;

  palavraDiv.textContent = `${palavra} (${pronuncia})`;
  mensagemDiv.textContent = "";
  input.value = "";
  input.focus();
}

function responder() {
  if (jogoEncerrado) return;

  const resposta = input.value.trim().toLowerCase();
  if (!resposta) return;

  const palavra = palavras[indice];
  const dados = vocabulario[palavra];

  let correto = false;

  if (Array.isArray(dados)) {
    correto = dados.some(
      d => d.significado.toLowerCase() === resposta
    );
  } else {
    correto = dados.significado.toLowerCase() === resposta;
  }

  if (correto) {
    acertos++;
    indice++;
    mostrarPalavra();
  } else {
    let corretas = Array.isArray(dados)
      ? dados.map(d => d.significado).join(", ")
      : dados.significado;

    mensagemDiv.innerHTML = `❌ Resposta errada.<br>✔️ Correto: <b>${corretas}</b>`;
    finalizar(false);
  }
}

function finalizar(completouTudo) {
  jogoEncerrado = true;
  input.disabled = true;

  let recorde = Number(localStorage.getItem("recorde")) || 0;

  if (acertos > recorde) {
    localStorage.setItem("recorde", acertos);
    recorde = acertos;
  }

  mensagemDiv.innerHTML += `<br><br>📊 Acertos: <b>${acertos}</b><br>🏆 Recorde: <b>${recorde}</b>`;

  if (completouTudo) {
    mensagemDiv.innerHTML =
      `🎉 Parabéns! Você completou todas as palavras.<br>` +
      `📊 Acertos: <b>${acertos}</b><br>` +
      `🏆 Recorde: <b>${recorde}</b>`;
  }
}

// iniciar
mostrarPalavra();
