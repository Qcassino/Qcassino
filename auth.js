import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ===================
// CADASTRO
// ===================
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
    // 🔐 Criar usuário no Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, email, senha);

    // 💾 Salvar dados no Firestore
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nome,
      cpf,
      nascimento,
      email,
      criadoEm: serverTimestamp(),
      credito: 10
    });

    alert("✅ Cadastro realizado com sucesso!");
    window.location.href = "login.html";

  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      alert("❌ Este email já está cadastrado");
    } else if (err.code === "auth/weak-password") {
      alert("❌ A senha precisa ter no mínimo 6 caracteres");
    } else {
      alert("❌ Erro ao cadastrar");
      console.error(err);
    }
  }
};

// ===================
// LOGIN
// ===================
window.login = async () => {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const msg = document.getElementById("msg");

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    window.location.href = "lobby.html";
  } catch {
    msg.innerText = "❌ Email ou senha inválidos";
  }
};
