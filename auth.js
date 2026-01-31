import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* =========================
   CADASTRO
========================= */
window.cadastrar = async () => {
  const nome = document.getElementById("nome").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const nascimento = document.getElementById("nascimento").value;
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const maior18 = document.getElementById("maior18").checked;

  if (!nome || !cpf || !nascimento || !email || !senha) {
    alert("⚠️ Preencha todos os campos");
    return;
  }

  if (!maior18) {
    alert("🚫 Você precisa ser maior de 18 anos");
    return;
  }

  try {
    // 🔥 CRIA USUÁRIO NO FIREBASE AUTH
    const cred = await createUserWithEmailAndPassword(auth, email, senha);

    // 🔥 SALVA DADOS NO FIRESTORE
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nome,
      cpf,
      nascimento,
      email,
      saldo: 10,
      criadoEm: serverTimestamp()
    });

    alert("✅ Cadastro realizado com sucesso!");
    window.location.href = "login.html";

  } catch (error) {
    alert("❌ " + error.code);
  }
};

/* =========================
   LOGIN
========================= */
window.login = async () => {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const msg = document.getElementById("msg");

  msg.innerText = "⏳ Entrando...";

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    window.location.href = "lobby.html";
  } catch (error) {
    console.error("ERRO FIREBASE:", error.code);
    msg.innerText = error.code;
  }
};

/* =========================
   LOGOUT
========================= */
window.sair = async () => {
  await signOut(auth);
  window.location.href = "login.html";
};
