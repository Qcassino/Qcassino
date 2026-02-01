import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🔐 Proteção ADMIN
let isAdmin = false;

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
  if (!isAdmin) {
    alert("Sem permissão");
    return;
  }

  const mult2 = Number(document.getElementById("mult2").value);
  const mult3 = Number(document.getElementById("mult3").value);
  const chance = Number(document.getElementById("chance").value);
  const ativo = document.getElementById("slotAtivo").checked;

  if (mult2 <= 0 || mult3 <= 0) {
    alert("Multiplicadores inválidos");
    return;
  }

  const configRef = doc(db, "configuracoes", "slot");
  
  console.log("USER LOGADO:", auth.currentUser.uid);
  console.log("Tentando salvar config slot...");
  
  await updateDoc(configRef, {
    mult_2: mult2,
    mult_3: mult3,
    chance: chance,
    ativo: ativo
  });

  alert("✅ Configuração do slot salva!");
};

