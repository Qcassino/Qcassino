import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyDImI1Y2f9fCicqXr4MZi4VrtSM2lJNHUM",
  authDomain: "qcassino-b40ff.firebaseapp.com",
  projectId: "qcassino-b40ff",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 👁 Mostrar senha
window.toggleSenha = () => {
  const input = document.getElementById("senha");
  input.type = input.type === "password" ? "text" : "password";
};

// 🎰 CADASTRO
window.cadastrar = async () => {
  const nome = nome.value;
  const cpf = cpf.value;
  const nascimento = nascimento.value;
  const email = email.value;
  const senha = senha.value;
  const maior18 = document.getElementById("maior18").checked;
  const msg = document.getElementById("msg");

  if (!maior18) {
    msg.innerText = "⚠️ Você precisa ser maior de 18 anos.";
    return;
  }

  try {
    const user = await createUserWithEmailAndPassword(auth, email, senha);

    await setDoc(doc(db, "usuarios", user.user.uid), {
      nome,
      cpf,
      nascimento,
      email,
      criadoEm: new Date()
    });

    window.location.href = "lobby.html";

  } catch (erro) {
    msg.innerText = erro.message;
  }
};

// ✅ LOGIN
window.login = async () => {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const msg = document.getElementById("msg");

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    window.location.href = "lobby.html";
  } catch (erro) {
    msg.innerText = "❌ Email ou senha inválidos";
  }
};
