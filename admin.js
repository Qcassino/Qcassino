import { auth, db } from "./firebase.js";
import { doc, getDoc } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const ref = doc(db, "usuarios", user.uid);
  const snap = await getDoc(ref);

   if (!snap.exists() || snap.data().role !== "admin") {
    alert("⛔ Acesso restrito");
    window.location.href = "index.html";
  }
});

async function salvar() {
  await updateDoc(doc(db, "configuracoes", "slot"), {
    dois_iguais: Number(dois.value),
    tres_iguais: Number(tres.value),
    chance: Number(chance.value)
  });

  alert("Configurações salvas!");
}
