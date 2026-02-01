const imagens = [
  "Joker.png",
  "Joker1.png",
  "Joker2.png"
  
];

let saldo = 10;
let aposta = 1;

const saldoEl = document.getElementById("saldo");
const msg = document.getElementById("msg");

await setPersistence(auth, browserLocalPersistence);

saldoEl.innerText = saldo;

// 🔄 FUNÇÃO GIRAR
window.jogar = () => {
  if (saldo < aposta) {
    msg.innerText = "❌ Saldo insuficiente";
    return;
  }

  saldo -= aposta;
  saldoEl.innerText = saldo;

  const r1 = sorteia();
  const r2 = sorteia();
  const r3 = sorteia();

  document.querySelector("#r1 img").src = r1;
  document.querySelector("#r2 img").src = r2;
  document.querySelector("#r3 img").src = r3;

  // 🏆 CONDIÇÃO DE GANHO
  if (r1 === r2 && r2 === r3) {
    const premio = aposta * 5;
    saldo += premio;
    saldoEl.innerText = saldo;
    msg.innerText = `🎉 GANHOU ${premio} créditos!`;
  } else {
    msg.innerText = "😕 Não foi dessa vez";
  }
};

// 🎲 SORTEIO
function sorteia() {
  const i = Math.floor(Math.random() * imagens.length);
  return imagens[i];
}

// ➕➖ APOSTA
window.aumentarAposta = () => {
  if (aposta < saldo) aposta++;
  document.getElementById("apostaValor").innerText = aposta;
};

window.diminuirAposta = () => {
  if (aposta > 1) aposta--;
  document.getElementById("apostaValor").innerText = aposta;
};

// ⬅ VOLTAR
window.voltar = () => {
  window.location.href = "lobby.html";
};
