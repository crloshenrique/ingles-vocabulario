
const palavras = Object.keys(vocabulario).sort(() => Math.random() - 0.5);

let indice = 0;
let palavraAtual;
let dadosAtuais;

function mostrarPalavra() {
  palavraAtual = palavras[indice];
  dadosAtuais = vocabulario[palavraAtual];

  const pronuncia = Array.isArray(dadosAtuais)
    ? dadosAtuais[0].pronuncia
    : dadosAtuais.pronuncia;

  document.getElementById("palavra").innerText =
    `${palavraAtual} (${pronuncia})`;

  document.getElementById("mensagem").innerText = "";
  document.getElementById("resposta").value = "";
  document.getElementById("resposta").focus();
}

function responder() {
  const resposta = document.getElementById("resposta").value
    .trim()
    .toLowerCase();

  let correta = false;

  if (Array.isArray(dadosAtuais)) {
    correta = dadosAtuais
      .map(d => d.significado.toLowerCase())
      .includes(resposta);
  } else {
    correta = resposta === dadosAtuais.significado.toLowerCase();
  }

  if (correta) {
    indice++;
    if (indice >= palavras.length) {
      document.getElementById("palavra").innerText = "🎉 Fim do treino!";
      document.getElementById("mensagem").innerText = "";
    } else {
      mostrarPalavra();
    }
  } else {
    document.getElementById("mensagem").innerText =
      "❌ Resposta incorreta";
  }
}

mostrarPalavra();
