import { auth, db } from "./firebase.js";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ELEMENTOS
const msg = document.getElementById("msg");
const btnEnviar = document.querySelector(".primary");
const btnConfirmar = document.querySelector(".success");

let confirmationResult = null;
let recaptchaVerifier = null;
let cooldown = false;

// 🔐 CONFIGURAÇÃO DO reCAPTCHA (1x)
const initRecaptcha = () => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {}
      }
    );
  }
};

// 📩 ENVIAR CÓDIGO SMS
window.enviarCodigo = async () => {
  const telefone = document.getElementById("telefone").value.trim();

  if (cooldown) {
    msg.innerText = "⏳ Aguarde 60s antes de tentar novamente";
    return;
  }

  if (!telefone.startsWith("+")) {
    msg.innerText = "❌ Use o formato +55...";
    return;
  }

  try {
    cooldown = true;
    btnEnviar.disabled = true;
    msg.innerText = "📤 Enviando código...";

    initRecaptcha();

    confirmationResult = await signInWithPhoneNumber(
      auth,
      telefone,
      recaptchaVerifier
    );

    msg.innerText = "📩 Código enviado por SMS";

    // ⏱️ COOLDOWN DE 60s
    setTimeout(() => {
      cooldown = false;
      btnEnviar.disabled = false;
    }, 60000);

  } catch (e) {
    cooldown = false;
    btnEnviar.disabled = false;

    if (e.code === "auth/too-many-requests") {
      msg.innerText = "🚫 Muitas tentativas. Aguarde alguns minutos.";
    } else {
      msg.innerText = e.message;
    }
  }
};

// ✅ CONFIRMAR CÓDIGO SMS
window.confirmarCodigo = async () => {
  const codigo = document.getElementById("codigo").value.trim();

  if (!confirmationResult) {
    msg.innerText = "❌ Envie o código primeiro";
    return;
  }

  if (codigo.length < 6) {
    msg.innerText = "❌ Código inválido";
    return;
  }

  try {
    btnConfirmar.disabled = true;
    msg.innerText = "🔐 Verificando código...";

    const cred = await confirmationResult.confirm(codigo);
    const uid = cred.user.uid;

    const ref = doc(db, "usuarios", uid);
    const snap = await getDoc(ref);

    // 💰 CRÉDITO INICIAL (SOMENTE UMA VEZ)
    if (!snap.exists()) {
      await setDoc(ref, {
        telefone: cred.user.phoneNumber,
        credito: 10,
        criadoEm: serverTimestamp()
      });
    }

    location.replace("lobby.html");

  } catch {
    msg.innerText = "❌ Código incorreto";
    btnConfirmar.disabled = false;
  }
};
