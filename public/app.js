import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBy9unBtcIzjDhXreeRP1HAuC22Punf5Y",
  authDomain: "fir-sign-5cfec.firebaseapp.com",
  projectId: "fir-sign-5cfec",
  storageBucket: "fir-sign-5cfec.firebasestorage.app",
  messagingSenderId: "724928683935",
  appId: "1:724928683935:web:84835c79320c96cccea7aa"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, user => {
  if (user) location.href = "todo.html";
});

const msg = (text) => document.getElementById("message").textContent = text;

document.getElementById("btn-signin").onclick = () =>
  signInWithEmailAndPassword(auth, document.getElementById("email").value, document.getElementById("password").value)
    .catch(e => msg(e.message));

document.getElementById("btn-signup").onclick = () =>
  createUserWithEmailAndPassword(auth, document.getElementById("email").value, document.getElementById("password").value)
    .catch(e => msg(e.message));
