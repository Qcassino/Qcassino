import { db } from "./firebase.js";
import { doc, getDoc, updateDoc } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const ref = doc(db, "configuracoes", "slot");

// 🔄 CARREGA CONFIG
async function carregarConfigSlot() {
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  mult2.value = data.mult_2;
  mult3.value = data.mult_3;
  chance.value = data.chance;
  ativo.checked = data.ativo;
}
carregarConfigSlot();

// 💾 SALVAR
window.salvarConfigSlot = async () => {
  await updateDoc(ref, {
    mult_2: Number(mult2.value),
    mult_3: Number(mult3.value),
    chance: Number(chance.value),
    ativo: ativo.checked
  });

  alert("Configuração do Slot salva!");
};
