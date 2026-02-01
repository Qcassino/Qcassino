import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc, getDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let saldo = 0;
let aposta = 1;
let userRef = null;

let mult = 1;
let crashPoint = 0;
let interval = null;
let jogando = false;

// ELEMENTOS
const saldoEl = document.getElementById("saldo");
const apostaEl = document.getElementById("aposta");
const multEl = document.getElementById("mult");
const msg = document.getElementById("msg");
const btnStart = document.getElementById("btnStart");
const btnCashout = document.getElementById("btnCashout");

// 🔐 AUTH
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  userRef = doc(db, "usuarios", user.uid);
  const snap = await getDoc(userRef);

  saldo = snap.data().saldo;
  saldoEl.innerText = saldo;
});

// gera crash
function gerarCrash() {
  return (Math.random() * 4 + 1).toFixed(2);
}

// ▶️ INICIAR
btnStart.onclick = async () => {
  aposta = Number(apostaEl.value);

  if (aposta <= 0 || aposta > saldo) {
    msg.innerText = "❌ Aposta inválida";
    return;
  }

  // desconta aposta
  saldo -= aposta;
  await updateDoc(userRef, { saldo });
  saldoEl.innerText = saldo;

  mult = 1;
  crashPoint = gerarCrash();
  jogando = true;

  btnStart.disabled = true;
  btnCashout.disabled = false;
  msg.innerText = "🚀 Subindo...";

  interval = setInterval(() => {
    mult += 0.01;
    multEl.innerText = mult.toFixed(2) + "x";

    if (mult >= crashPoint) crash();
  }, 50);
};

// 💰 SACAR
btnCashout.onclick = async () => {
  if (!jogando) return;

  clearInterval(interval);
  jogando = false;

  const ganho = Number((aposta * mult).toFixed(2));
  saldo += ganho;
  saldo = Number(saldo.toFixed(2));

  await updateDoc(userRef, { saldo });
  saldoEl.innerText = saldo.toFixed(2);

  msg.innerText = `💰 Sacou ${ganho}!`;
  reset();
};

// 💥 CRASH
function crash() {
  clearInterval(interval);
  jogando = false;

  multEl.innerText = "💥 CRASH";
  msg.innerText = `❌ Crashou em ${crashPoint}x`;
  reset();
}

// 🔁 RESET
function reset() {
  btnStart.disabled = false;
  btnCashout.disabled = true;
}
