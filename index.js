import { auth, db } from "./firebase.js";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";


import {
  doc, getDoc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const msg = document.getElementById("msg");
const btnAdmin = document.getElementById("btnAdmin");

let confirmationResult = null;
let recaptchaVerifier = null;


onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const ref = doc(db, "usuarios", user.uid);
  const snap = await getDoc(ref);

  if (snap.exists() && snap.data().role === "admin") {
    btnAdmin.style.display = "block";
  }
});
// 📩 Enviar código SMS
window.enviarCodigo = async () => {
  const telefone = document.getElementById("telefone").value;

  if (!telefone.startsWith("+")) {
    msg.innerText = "❌ Use o formato +55...";
    return;
  }

  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      { size: "invisible" }
    );
  }

  try {
    confirmationResult = await signInWithPhoneNumber(
      auth,
      telefone,
      recaptchaVerifier
    );
    msg.innerText = "📩 Código enviado por SMS";
  } catch (err) {
    msg.innerText = err.message;
  }
};

// ✅ Confirmar código
window.confirmarCodigo = async () => {
  try {
    const codigo = document.getElementById("codigo").value;

    if (!confirmationResult) {
      msg.innerText = "❌ Envie o código primeiro";
      return;
    }

    const cred = await confirmationResult.confirm(codigo);
    const uid = cred.user.uid;

    const ref = doc(db, "usuarios", uid);
    const snap = await getDoc(ref);

    // 💰 créditos iniciais (somente 1x)
    if (!snap.exists()) {
      await setDoc(ref, {
        telefone: cred.user.phoneNumber,
        credito: 10,
        criadoEm: serverTimestamp()
      });
    }

    location.href = "lobby.html";

  } catch {
    msg.innerText = "❌ Código inválido";
  }
};
