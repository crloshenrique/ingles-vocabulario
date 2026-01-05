window.addEventListener("DOMContentLoaded", () => {

  // Elementos
  const menuInicial = document.getElementById("menu-inicial");
  const treinoContainer = document.getElementById("treino-container");
  const palavraBox = document.getElementById("palavra-box");
  const traducaoBox = document.getElementById("traducao-box");
  const progressoBox = document.getElementById("progresso-box");
  const acertosBox = document.getElementById("acertos-box");
  const errosBox = document.getElementById("erros-box");
  const input = document.getElementById("resposta");
  const mensagemDiv = document.getElementById("mensagem");

  const btnIngles = document.getElementById("modo-ingles");
  const btnPortugues = document.getElementById("modo-portugues");

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

  // Variáveis do jogo
  let palavras = Object.keys(vocabulario).sort(() => Math.random() - 0.5);
  let i = 0;
  let acertos = 0;
  let erros = 0;
  const totalPalavras = palavras.length;
  let modo = "ingles"; // padrão, muda ao selecionar

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
      palavraExibir = palavra.charAt(0).toUpperCase() + palavra.slice(1);
    } else {
      if (Array.isArray(dados)) {
        palavraExibir = dados.map(d => d.significado).join(" / ");
      } else {
        palavraExibir = dados.significado;
      }
    }

    palavraBox.textContent = `${palavraExibir} (${pronuncia})`;
    palavraBox.style.color = "white";

    input.value = "";
    input.focus();
    mensagemDiv.textContent = "";

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
      // Palavra em inglês, resposta em português
      if (Array.isArray(dados)) {
        respostasCorretas = dados.map(d => d.significado);
        const lower = respostasCorretas.map(d => d.toLowerCase());
        if (lower.includes(resposta)) correto = true;
      } else {
        respostasCorretas = [dados.significado];
        if (resposta === dados.significado.toLowerCase()) correto = true;
      }
    } else {
      // Palavra em português, resposta em inglês
      if (Array.isArray(dados)) {
        respostasCorretas = dados.map(d => palavra.toLowerCase());
        if (resposta === palavra.toLowerCase()) correto = true;
      } else {
        respostasCorretas = [palavra.charAt(0).toUpperCase() + palavra.slice(1)];
        if (resposta === palavra.toLowerCase()) correto = true;
      }
    }

    // Mostrar tradução correta com cor
    traducaoBox.textContent = respostasCorretas.join(" / ");
    traducaoBox.style.color = correto ? "green" : "red";

    if (correto) acertos++;
    else erros++;

    i++;
    atualizarProgresso();

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

  // Eventos Enter e clique
  input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") responder();
  });

  btnIngles.addEventListener("click", () => iniciarTreino("ingles"));
  btnPortugues.addEventListener("click", () => iniciarTreino("portugues"));

  function iniciarTreino(selecionado) {
    modo = selecionado;
    menuInicial.style.display = "none";
    treinoContainer.style.display = "block";
    mostrarPalavra();
  }

});
