import { db } from "./firebase.js";
import { doc, getDoc, updateDoc } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const ref = doc(db, "configuracoes", "slot");


  window.salvarConfigSlot = async function () {
  try {
    const ativo = document.getElementById("slotAtivo").checked;
    const mult2 = Number(document.getElementById("mult2").value);
    const mult3 = Number(document.getElementById("mult3").value);

    const ref = doc(db, "configuracoes", "slot");

    await updateDoc(ref, {
      ativo: ativo,
      mult_2: mult2,
      mult_3: mult3
    });

    alert("✅ Configuração do slot salva com sucesso!");
  } catch (e) {
    console.error(e);
    alert("❌ Erro ao salvar configuração");
  }
};

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

