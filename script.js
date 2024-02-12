const mario = document.querySelector("#mario");
const inimigo = document.querySelector("#inimigo");
const gameBoard = document.querySelector("#game-board");
const botaoIniciar = document.querySelector("#iniciar");
const botaoReiniciar = document.querySelector("#reiniciar");
const bloco = document.querySelector("#bloco");
const vidas = document.querySelector("#vidas");
const moedas = document.querySelector("#moedas");
const pontos = document.querySelector("#pontos");
const tempo = document.querySelector("#tempo");

const audioEspera = document.querySelector("#audioEspera");
const audioNormal = document.querySelector("#audioNormal");
const audioPulo = document.querySelector("#audioPulo");
const audioMoeda = document.querySelector("#audioMoeda");
const audioVidaExtra = document.querySelector("#audioVidaExtra");
const audioPerdeuVida = document.querySelector("#audioPerdeuVida");
const audioGameOver = document.querySelector("#audioGameOver");

const larguraGameBoard = gameBoard.offsetWidth;
const larguraMario = mario.offsetWidth;

let posicao = 0;
let direcao = 0;
let velocidade = 12;

let tempoAtual = 100;

let gameEnter = false;

let vidasAtual = parseInt(localStorage.getItem("vidasAtual")) || 5;
vidas.textContent = vidasAtual;
let moedasAtual = parseInt(localStorage.getItem("moedasAtual")) || 0;
moedas.textContent = moedasAtual;
let pontosAtual = parseInt(localStorage.getItem("pontosAtual")) || 0;
pontos.textContent = pontosAtual;

let checarColisaoComBloco;
let checarTimer;
let checarColisaoComInimigo;
let checarPulo;
let checarMovimentos;

let colidiu = false;

function teclaPressionada(event) {
  if (event.key === "ArrowRight") {
    direcao = 1;
    mario.style.backgroundImage = "url(/images/marioAndandoLadoDireito.gif)";
  } else if (event.key === "ArrowLeft") {
    direcao = -1;
    mario.style.backgroundImage = "url(/images/marioAndandoLadoEsquerdo.gif)";
  } else if (event.code === "Space") {
    mario.classList.add("puloMario");
    audioPulo.play();
    if (colidiu === true) {
      clearTimeout(checarPulo);
    } else {
      colidiu = false;
      checarPulo = setTimeout(() => {
        mario.classList.remove("puloMario");
      }, 500);
    }
  }
}

function teclaSolta(event) {
  if (event.key === "ArrowRight") {
    direcao = 0;
    mario.style.backgroundImage = "url(/images/marioParadoLadoDireito.png)";
  } else if (event.key === "ArrowLeft") {
    direcao = 0;
    mario.style.backgroundImage = "url(/images/marioParadoLadoEsquerdo.png)";
  }
}

function atualizarMovimentos() {
  posicao += direcao * velocidade;
  if (posicao < 0) {
    posicao = 0;
  } else if (posicao > larguraGameBoard - larguraMario) {
    posicao = larguraGameBoard - larguraMario;
  }
  mario.style.left = posicao + "px";
}

function colisaoComBloco() {
  const checarMario = mario.getBoundingClientRect();
  const checarBloco = bloco.getBoundingClientRect();
  if (
    checarBloco.left < checarMario.right &&
    checarBloco.right > checarMario.left &&
    checarBloco.top < checarMario.bottom &&
    checarBloco.bottom > checarMario.top
  ) {
    checarColisaoComBloco = clearInterval(checarColisaoComBloco);
    moedasAtual++;
    moedas.textContent = moedasAtual;
    localStorage.setItem("moedasAtual", moedasAtual);
    pontosAtual += +10;
    pontos.textContent = pontosAtual;
    localStorage.setItem("pontosAtual", pontosAtual);
    audioMoeda.play();
    checarMoedas();
    bloco.style.top = "475px";
    setTimeout(() => {
      checarColisaoComBloco = setInterval(colisaoComBloco, 10);
      bloco.style.top = "485px";
    }, 500);
  }
}

function colisaoInimigo() {
  const checarMario = mario.getBoundingClientRect();
  const checarInimigo = inimigo.getBoundingClientRect();
  if (
    checarInimigo.left < checarMario.right &&
    checarInimigo.right > checarMario.left &&
    checarInimigo.top < checarMario.bottom &&
    checarInimigo.bottom > checarMario.top
  ) {
    clearInterval(checarMovimentos);
    clearTimeout(checarPulo);
    removerEventosdeTecla();
    clearInterval(checarColisaoComInimigo);
    clearInterval(checarTimer);
    vidasAtual--;
    vidas.textContent = vidasAtual;
    localStorage.setItem("vidasAtual", vidasAtual);
    mario.style.backgroundImage = "url(/images/marioMorto.gif)";
    inimigo.style.diplay = "none";
    colidiu = true;
    audioNormal.volume = 0;
    audioPerdeuVida.play();
    setTimeout(() => {
      checarReload();
    }, 3500);
  }
}

botaoReiniciar.addEventListener("click", () => {
  moedasAtual = 0;
  moedas.textContent = moedasAtual;
  localStorage.setItem("moedasAtual", moedasAtual);
  pontosAtual = 0;
  pontos.textContent = pontosAtual;
  localStorage.setItem("pontosAtual", pontosAtual);
  vidasAtual = 5;
  vidas.textContent = vidasAtual;
  localStorage.setItem("vidasAtual", vidasAtual);

  window.location.reload();
});

function checarMoedas() {
  if (moedasAtual === 10) {
    vidasAtual++;
    vidas.textContent = vidasAtual;
    moedasAtual = 0;
    moedas.textContent = moedasAtual;
    audioVidaExtra.play();
  }
}

function checarTempo() {
  tempoAtual--;
  tempo.textContent = tempoAtual;
  if (tempoAtual === 50) {
    alert("Corra, o tempo está acabando!");
  } else if (tempoAtual === 0) {
    removerEventosdeTecla();
    clearInterval(checarTimer);
    mario.style.backgroundImage = "url(/images/marioMorto.gif)";
    inimigo.style.diplay = "none";
  }
}

function checarReload() {
  if (vidasAtual >= 1) {
    window.location.reload();
  } else {
    botaoReiniciar.style.display = "block";
    audioGameOver.play();
  }
}

function removerEventosdeTecla() {
  document.removeEventListener("keydown", teclaPressionada);
  document.removeEventListener("keyup", teclaSolta);
}

botaoIniciar.addEventListener("click", () => {
  botaoIniciar.style.display = "none";
  inimigo.classList.add("movimentarInimigo");
  document.addEventListener("keydown", teclaPressionada);
  document.addEventListener("keyup", teclaSolta);
  checarMovimentos = setInterval(atualizarMovimentos, 50);
  checarColisaoComBloco = setInterval(colisaoComBloco, 10);
  checarColisaoComInimigo = setInterval(colisaoInimigo, 10);
  checarTimer = setInterval(checarTempo, 1000);
  gameEnter = true;
  audioEspera.volume = 0;
  audioNormal.play();
});

document.addEventListener("keydown", (event) => {
  if (!gameEnter && event.key === "Enter") {
    botaoIniciar.style.display = "none";
    inimigo.classList.add("movimentarInimigo");
    document.addEventListener("keydown", teclaPressionada);
    document.addEventListener("keyup", teclaSolta);
    checarMovimentos = setInterval(atualizarMovimentos, 50);
    checarColisaoComBloco = setInterval(colisaoComBloco, 10);
    checarColisaoComInimigo = setInterval(colisaoInimigo, 10);
    checarTimer = setInterval(checarTempo, 1000);
    gameEnter = true;
    audioEspera.volume = 0;
    audioNormal.play();
  } else if (gameEnter && event.key === "Enter") {
    alert("O jogo ja foi reiniciado!");
  }
});
