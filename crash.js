import { auth, db } from "./firebase.js";
import {
  doc, getDoc, setDoc, updateDoc, onSnapshot,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const partidaRef = doc(db, "partidas", "atual");
let uid = null;
let sacou = false;

auth.onAuthStateChanged(user => {
  if (user) uid = user.uid;
});

function gerarCrash() {
  return Number((Math.random() * 4 + 1).toFixed(2)); // 1.00x a 5.00x
}

window.entrar = async () => {
  const aposta = Number(document.getElementById("aposta").value);

  await setDoc(doc(db, "partidas/atual/jogadores", uid), {
    aposta,
    sacou: false,
    ganho: 0
  });

  const snap = await getDoc(partidaRef);

  if (!snap.exists()) {
    await setDoc(partidaRef, {
      status: "aguardando",
      jogadores: 1
    });
  } else {
    await updateDoc(partidaRef, {
      jogadores: increment(1)
    });
  }
};

onSnapshot(partidaRef, async snap => {
  if (!snap.exists()) return;

  const data = snap.data();

  document.getElementById("status").innerText =
    `Status: ${data.status}`;

  if (data.status === "aguardando" && data.jogadores >= 3) {
    await updateDoc(partidaRef, {
      status: "rodando",
      crashEm: gerarCrash(),
      multiplicador: 1
    });
  }

  if (data.status === "rodando") {
    document.getElementById("multi").innerText =
      data.multiplicador.toFixed(2) + "x";

    if (data.multiplicador >= data.crashEm) {
      await updateDoc(partidaRef, { status: "finalizada" });
    }
  }
});

setInterval(async () => {
  const snap = await getDoc(partidaRef);
  if (!snap.exists()) return;

  const d = snap.data();
  if (d.status === "rodando") {
    await updateDoc(partidaRef, {
      multiplicador: Number((d.multiplicador + 0.01).toFixed(2))
    });
  }
}, 100);

window.sacar = async () => {
  if (sacou) return;
  sacou = true;

  const snap = await getDoc(partidaRef);
  const multi = snap.data().multiplicador;

  const refJog = doc(db, "partidas/atual/jogadores", uid);
  const jSnap = await getDoc(refJog);

  const ganho = jSnap.data().aposta * multi;

  await updateDoc(refJog, {
    sacou: true,
    ganho
  });

  await updateDoc(doc(db, "usuarios", uid), {
    saldo: increment(ganho)
  });

  document.getElementById("msg").innerText =
    `💰 Sacou ${ganho.toFixed(2)}`;
};
