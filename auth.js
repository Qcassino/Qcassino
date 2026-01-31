import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

/* ======================
   CADASTRO
====================== */
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
    // 1️⃣ cria usuário no AUTH
    const cred = await createUserWithEmailAndPassword(auth, email, senha);

    // 2️⃣ salva dados no FIRESTORE
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nome,
      cpf,
      nascimento,
      email,
      saldo: 10, // saldo inicial
      criadoEm: serverTimestamp()
    });

    alert("✅ Cadastro realizado com sucesso!");
    window.location.href = "login.html";

  } catch (error) {
    alert("❌ Erro no cadastro: " + error.message);
  }
};

/* ======================
   LOGIN
====================== */
window.login = async () => {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const msg = document.getElementById("msg");

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    window.location.href = "lobby.html";
  } catch (error) {
    msg.innerText = "❌ Email ou senha inválidos";
  }
};

/* ======================
   LOGOUT
====================== */
window.sair = async () => {
  await signOut(auth);
  window.location.href = "login.html";
};
