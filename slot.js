import { auth, db } from "./firebase.js";
import { doc, getDoc, updateDoc } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🎰 IMAGENS
const imagens = ["Joker.png", "Joker1.png", "Joker2.png"];

// ESTADO
let saldo = 0;
let aposta = 1;
let userRef = null;
let configSlot = null;

// ELEMENTOS
const saldoEl = document.getElementById("saldo");
const msg = document.getElementById("msg");
const apostaEl = document.getElementById("apostaValor");
const btnSpin = document.getElementById("btnSpin");

// trava tudo inicialmente
btnSpin.disabled = true;

// 🔐 AUTH + CONFIG
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {
    // 🔧 CONFIG SLOT
    const configRef = doc(db, "configuracoes", "slot");
    const configSnap = await getDoc(configRef);

    if (!configSnap.exists()) {
      msg.innerText = "⚠️ Configuração do slot não encontrada";
      return;
    }

    configSlot = configSnap.data();

    if (!configSlot.ativo) {
      msg.innerText = "⛔ Slot desativado pelo administrador";
      btnSpin.disabled = true;
    }

    // 👤 USUÁRIO
    userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      msg.innerText = "⚠️ Usuário não encontrado";
      return;
    }

    saldo = userSnap.data().saldo;
    saldoEl.innerText = saldo;

    // ✅ libera jogo
    btnSpin.disabled = false;

  } catch (err) {
    console.error(err);
    msg.innerText = "❌ Erro ao carregar slot";
  }
});

// 🎲 JOGAR
window.jogar = async () => {
  if (!userRef || !configSlot) {
    msg.innerText = "⏳ Carregando dados...";
    return;
  }

  if (saldo < aposta) {
    msg.innerText = "❌ Saldo insuficiente";
    return;
  }

  saldo -= aposta;

  const r1 = sorteia();
  const r2 = sorteia();
  const r3 = sorteia();

  document.querySelector("#r1 img").src = r1;
  document.querySelector("#r2 img").src = r2;
  document.querySelector("#r3 img").src = r3;

  let ganho = 0;

  if (r1 === r2 && r2 === r3) {
    ganho = aposta * configSlot.mult_3;
  } else if (r1 === r2 || r1 === r3 || r2 === r3) {
    ganho = aposta * configSlot.mult_2;
  }

  saldo += ganho;
  saldoEl.innerText = saldo;

  msg.innerText = ganho > 0
    ? `🎉 GANHOU ${ganho}!`
    : "😕 Não foi dessa vez";

  await updateDoc(userRef, { saldo });
};

// 🎲 SORTEIO
function sorteia() {
  return imagens[Math.floor(Math.random() * imagens.length)];
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
