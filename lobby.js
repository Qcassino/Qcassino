import { auth, db } from "./firebase.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const saldoEl = document.getElementById("saldo");
const sairBtn = document.getElementById("sair");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return; // ✅ AGORA PODE
  }

  const ref = doc(db, "usuarios", user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    document.getElementById("nomeUsuario").innerText = snap.data().nome;
    document.getElementById("saldo").innerText = snap.data().saldo;
  }
});

sairBtn.onclick = async () => {
  await signOut(auth);
  location.replace("index.html");
};;
history.pushState(null, "", location.href);
window.onpopstate = () => {
  history.pushState(null, "", location.href);
};






