import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🎰 IMAGENS
const imagens = [
  "Joker.png",
  "Joker1.png",
  "Joker2.png"
];

// ESTADO
let saldo = 0;
let aposta = 1;
let userRef = null;

// ELEMENTOS
const saldoEl = document.getElementById("saldo");
const msg = document.getElementById("msg");
const apostaEl = document.getElementById("apostaValor");
const btnSpin = document.getElementById("btnSpin");

// trava o botão até carregar
btnSpin.disabled = true;

// 🔐 AUTH + SALDO
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  userRef = doc(db, "usuarios", user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    saldo = snap.data().saldo;
    saldoEl.innerText = saldo;

    btnSpin.disabled = false; // libera jogo
  }
});

// 🎲 JOGAR
window.jogar = async () => {
  if (!userRef) {
    msg.innerText = "⏳ Carregando usuário...";
    return;
  }

  if (saldo < aposta) {
    msg.innerText = "❌ Saldo insuficiente";
    return;
  }

  // desconta aposta
  saldo -= aposta;

  const r1 = sorteia();
  const r2 = sorteia();
  const r3 = sorteia();

  document.querySelector("#r1 img").src = r1;
  document.querySelector("#r2 img").src = r2;
  document.querySelector("#r3 img").src = r3;

  let ganho = 0;

  if (r1 === r2 && r2 === r3) {
    ganho = aposta * 5;
    msg.innerText = `🎉 GANHOU ${ganho} créditos!`;
  } else {
    msg.innerText = "😕 Não foi dessa vez";
  }

  saldo += ganho;
  saldoEl.innerText = saldo;

  // 🔥 SALVA NO FIREBASE
  await updateDoc(userRef, { saldo });
};

// 🎲 SORTEIO
function sorteia() {
  const i = Math.floor(Math.random() * imagens.length);
  return imagens[i];
}

// ➕➖ APOSTA
window.aumentarAposta = () => {
  if (aposta < saldo) aposta++;
  apostaEl.innerText = aposta;
};

window.diminuirAposta = () => {
  if (aposta > 1) aposta--;
  apostaEl.innerText = aposta;
};

// ⬅ VOLTAR
window.voltar = () => {
  window.location.href = "lobby.html";
};
