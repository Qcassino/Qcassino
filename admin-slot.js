import { db } from "./firebase.js";
import { doc, getDoc, updateDoc } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const ref = doc(db, "configuracoes", "slot");

let isAdmin = false

// 🔐 Verifica admin
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const ref = doc(db, "usuarios", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists() || snap.data().role !== "admin") {
    alert("Acesso negado");
    window.location.href = "lobby.html";
    return;
  }

  isAdmin = true;
});

// 💾 SALVAR CONFIG SLOT
window.salvarConfigSlot = async () => {
  if (!isAdmin) return;

  const mult2 = Number(document.getElementById("mult2").value);
  const mult3 = Number(document.getElementById("mult3").value);
  const chance = Number(document.getElementById("chance").value);
  const ativo = document.getElementById("slotAtivo").checked;

  if (mult2 <= 0 || mult3 <= 0) {
    alert("Multiplicadores inválidos");
    return;
  }

  const configRef = doc(db, "configuracoes", "slot");

  await updateDoc(configRef, {
    mult_2: mult2,
    mult_3: mult3,
    chance: chance,
    ativo: ativo
  });

  alert("✅ Configuração do slot salva!");
};


// 🔄 CARREGA CONFIG
async function carregarConfigSlot() {
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  mult2.value = data.mult_2;
  mult3.value = data.mult_3;
  chance.value = data.chance;
  ativo.checked = data.ativo;
}
carregarConfigSlot();

// 💾 SALVAR
window.salvarConfigSlot = async () => {
  await updateDoc(ref, {
    mult_2: Number(mult2.value),
    mult_3: Number(mult3.value),
    chance: Number(chance.value),
    ativo: ativo.checked
  });

  alert("Configuração do Slot salva!");
};




