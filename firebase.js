
import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getAuth } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { getFirestore } from
"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:"AIzaSyDImI1Y2f9fCicqXr4MZi4VrtSM2lJNHUM",
  authDomain: "qcassino-b40ff.firebaseapp.com",
  projectId: "qcassino-b40ff",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);




