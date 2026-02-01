import { auth, db } from "./firebase.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  const saldoEl = document.getElementById("saldo");
  const nomeEl = document.getElementById("nomeUsuario");
  const sairBtn = document.getElementById("sair");
  const soundToggle = document.getElementById("soundToggle");

  await setPersistence(auth, browserLocalPersistence);
  
  // 🔐 Proteção de rota
  auth.onAuthStateChanged(async (user) => {
  console.log("AUTH USER:", user);

  if (!user) {
    console.log("Usuário não logado");
    return;
  }

  const ref = doc(db, "usuarios", user.uid);
  const snap = await getDoc(ref);

  console.log("DOC EXISTS?", snap.exists());
  console.log("DATA:", snap.data());

  if (snap.exists()) {
    document.getElementById("nomeUsuario").innerText = snap.data().nome;
    document.getElementById("saldo").innerText = snap.data().saldo;
  } else {
    alert("Documento do usuário NÃO existe no Firestore");
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


