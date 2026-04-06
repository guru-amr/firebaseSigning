import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBy9unBtcIzjDhXreeRP1HAuC22Punf5Y",
  authDomain: "fir-sign-5cfec.firebaseapp.com",
  projectId: "fir-sign-5cfec",
  storageBucket: "fir-sign-5cfec.firebasestorage.app",
  messagingSenderId: "724928683935",
  appId: "1:724928683935:web:84835c79320c96cccea7aa",
  measurementId: "G-X0BC66GN28"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email    = () => document.getElementById("email").value;
const password = () => document.getElementById("password").value;
const msg      = (text) => document.getElementById("message").textContent = text;

document.getElementById("btn-signup").onclick = () =>
  createUserWithEmailAndPassword(auth, email(), password())
    .then(() => msg("Account created!"))
    .catch(e => msg(e.message));

document.getElementById("btn-signin").onclick = () =>
  signInWithEmailAndPassword(auth, email(), password())
    .then(() => msg(""))
    .catch(e => msg(e.message));

document.getElementById("btn-signout").onclick = () =>
  signOut(auth);

onAuthStateChanged(auth, user => {
  const signoutBtn = document.getElementById("btn-signout");
  const userInfo   = document.getElementById("user-info");
  const signinBtn  = document.getElementById("btn-signin");
  const signupBtn  = document.getElementById("btn-signup");

  if (user) {
    userInfo.textContent  = `Logged in as: ${user.email}`;
    signoutBtn.style.display = "block";
    signinBtn.style.display  = "none";
    signupBtn.style.display  = "none";
  } else {
    userInfo.textContent  = "";
    signoutBtn.style.display = "none";
    signinBtn.style.display  = "block";
    signupBtn.style.display  = "block";
  }
});
