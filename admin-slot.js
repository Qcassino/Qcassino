import { auth, db } from "./firebase.js";
import { doc, setDoc } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

let userLogado = false;

// garante que só logado salva
onAuthStateChanged(auth, (user) => {
  if (user) userLogado = true;
});

// 🔥 FUNÇÃO GLOBAL
window.salvarConfigSlot = async () => {
  if (!userLogado) {
    alert("Não autenticado");
    return;
  }

  const mult2 = Number(document.getElementById("mult2").value);
  const mult3 = Number(document.getElementById("mult3").value);
  const chance = Number(document.getElementById("chance").value);
  const ativo = document.getElementById("slotAtivo").checked;

  const ref = doc(db, "configuracoes", "slot");

  await setDoc(ref, {
    mult_2: mult2,
    mult_3: mult3,
    chance: chance,
    ativo: ativo
  }, { merge: true });

  alert("✅ Configuração do slot salva!");
};
