import { auth, db } from "./firebase.js";
import { signOut, onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  const saldoEl = document.getElementById("saldo");
  const nomeEl = document.getElementById("nomeUsuario");
  const sairBtn = document.getElementById("sair");
  const btnAdmin = document.getElementById("btnAdmin");
  const soundToggle = document.getElementById("soundToggle");

  // 🔐 AUTH
  onAuthStateChanged(auth, async (user) => {
    console.log("AUTH USER:", user);

    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const ref = doc(db, "usuarios", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      alert("Documento do usuário NÃO existe no Firestore");
      return;
    }

    const data = snap.data(); // ✅ AGORA EXISTE

    nomeEl.innerText = data.nome;
    saldoEl.innerText = data.saldo;

    // 🛠 MOSTRAR BOTÃO ADMIN
    if (data.role === "admin" && btnAdmin) {
      btnAdmin.style.display = "inline-block";
    }
  });

  // 🛠 ABRIR PAINEL ADMIN
  if (btnAdmin) {
    btnAdmin.onclick = () => {
      window.location.href = "admin.html";
    };
  }

  // 🚪 LOGOUT
  if (sairBtn) {
    sairBtn.onclick = async () => {
      await signOut(auth);
      location.replace("index.html");
    };
  }

  // 🔊 SOM
  if (soundToggle) {
    soundToggle.onclick = () => {
      console.log("Som clicado");
    };
  }

  // 🔒 BLOQUEIA VOLTAR
  history.pushState(null, "", location.href);
  window.onpopstate = () => {
    history.pushState(null, "", location.href);
  };
});
