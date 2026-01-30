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
// CADASTRAR
// ===================
window.cadastrar = async () => {
  const nome = document.getElementById("nome").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const nascimento = document.getElementById("nascimento").value;
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const maior18 = document.getElementById("maior18").checked;
  const msg = document.getElementById("msg");

  if (!nome || !cpf || !nascimento || !email || !senha) {
    msg.innerText = "❌ Preencha todos os campos";
    return;
  }

  if (!maior18) {
    msg.innerText = "❌ Você precisa confirmar +18";
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, senha);

    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nome,
      cpf,
      nascimento,
      email,
      credito: 10,
      criadoEm: serverTimestamp()
    });

    window.location.href = "lobby.html";

  } catch (e) {
    msg.innerText = "❌ " + e.message;
  }
};
