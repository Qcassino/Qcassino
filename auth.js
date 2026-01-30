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

window.cadastrar = () => {
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

  // Simulação de cadastro (por enquanto)
  alert("✅ Cadastro realizado com sucesso!");

  // Limpar formulário
  document.getElementById("nome").value = "";
  document.getElementById("cpf").value = "";
  document.getElementById("nascimento").value = "";
  document.getElementById("email").value = "";
  document.getElementById("senha").value = "";
  document.getElementById("maior18").checked = false;

  // Redirecionar para login
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1000);
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
