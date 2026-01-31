import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
    // cria conta
    const cred = await createUserWithEmailAndPassword(auth, email, senha);

    // salva dados no Firestore
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nome,
      cpf,
      nascimento,
      email,
      saldo: 10,
      criadoEm: serverTimestamp()
    });

    // 🔴 DESLOGA AUTOMATICAMENTE
    await signOut(auth);

    alert("✅ Cadastro realizado com sucesso! Faça login.");

    window.location.href = "login.html";

  } catch (err) {
    alert("❌ Erro ao cadastrar: " + err.message);
  }
};
