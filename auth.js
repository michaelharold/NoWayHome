import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM references
const form = document.getElementById('auth-form');
const authBtn = document.getElementById('auth-btn');
const toggleLink = document.getElementById('toggle-link');
const toggleText = document.getElementById('toggle-text');

let isLogin = true;

function updateToggleUI() {
  authBtn.textContent = isLogin ? 'LOGIN' : 'SIGN UP';
  toggleText.innerHTML = isLogin
    ? 'New user? <span id="toggle-link">Sign Up</span>'
    : 'Already have an account? <span id="toggle-link">Log In</span>';
  // Rebind event listener
  document.getElementById('toggle-link').addEventListener('click', () => {
    isLogin = !isLogin;
    updateToggleUI();
  });
}

// Initial toggle bind
toggleLink.addEventListener('click', () => {
  isLogin = !isLogin;
  updateToggleUI();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    let userCred;
    if (isLogin) {
      userCred = await signInWithEmailAndPassword(auth, email, password);
    } else {
      userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCred.user.uid), {
        email: email,
        profileComplete: false
      });
    }

    const uid = userCred.user.uid;
    const userDoc = await getDoc(doc(db, "users", uid));

    if (userDoc.exists() && userDoc.data().profileComplete) {
      window.location.href = "booking.html";
    } else {
      window.location.href = "profile.html";
    }

  } catch (error) {
    alert("⚠️ Error: " + error.message);
  }
});
