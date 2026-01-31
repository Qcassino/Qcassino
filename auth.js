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

window.login = async () => {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const msg = document.getElementById("msg");

  if (!email || !senha) {
    msg.innerText = "⚠️ Preencha email e senha";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    window.location.href = "lobby.html";
  } catch (error) {
    console.error(error);
    msg.innerText = "❌ Email ou senha inválidos";
  }
};
