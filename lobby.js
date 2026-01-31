import { auth, db } from "./firebase.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  const saldoEl = document.getElementById("saldo");
  const nomeEl = document.getElementById("nomeUsuario");
  const sairBtn = document.getElementById("sair");
  const soundToggle = document.getElementById("soundToggle");

  // 🔐 Proteção de rota
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      location.replace("login.html");
      return;
    }

    const ref = doc(db, "usuarios", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      nomeEl.innerText = snap.data().nome;
      saldoEl.innerText = snap.data().saldo;
    }
  });

  // 🚪 Logout
  if (sairBtn) {
    sairBtn.onclick = async () => {
      await signOut(auth);
      location.replace("index.html");
    };
  }

  // 🔊 Som
  if (soundToggle) {
    soundToggle.onclick = () => {
      console.log("Som clicado");
    };
  }

  // 🔒 Bloqueia botão voltar
  history.pushState(null, "", location.href);
  window.onpopstate = () => {
    history.pushState(null, "", location.href);
  };

});
