import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDImI1Y2f9fCicqXr4MZi4VrtSM2lJNHUM",
  authDomain: "qcassino-b40ff.firebaseapp.com",
  projectId: "qcassino-b40ff",
  storageBucket: "qcassino-b40ff.firebasestorage.app",
  messagingSenderId: "824724689710",
  appId: "1:824724689710:web:2cf828f1b3bb53701460bf"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
