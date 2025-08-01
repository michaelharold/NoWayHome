import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const form = document.getElementById('auth-form');
const authBtn = document.getElementById('auth-btn');
const toggleLink = document.getElementById('toggle-link');

let isLogin = true;

toggleLink.addEventListener('click', () => {
  isLogin = !isLogin;
  authBtn.textContent = isLogin ? 'LOGIN' : 'SIGN UP';
  toggleLink.textContent = isLogin ? 'Sign Up' : 'Log In';
  document.getElementById('toggle-text').innerHTML = isLogin ? 'New user? <span id="toggle-link">Sign Up</span>' : 'Already have an account? <span id="toggle-link">Log In</span>';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = form.email.value;
  const password = form.password.value;

  try {
    let userCred;
    if (isLogin) {
      userCred = await signInWithEmailAndPassword(auth, email, password);
    } else {
      userCred = await createUserWithEmailAndPassword(auth, email, password);
      // Mark new user as needing profile setup
      await setDoc(doc(db, "users", userCred.user.uid), {
        email: email,
        profileComplete: false,
      });
    }

    // Check if profile is complete
    const userDoc = await getDoc(doc(db, "users", userCred.user.uid));
    if (userDoc.exists() && userDoc.data().profileComplete) {
      window.location.href = "/booking.html"; // replace with actual route
    } else {
      window.location.href = "/profile.html"; // replace with actual route
    }
  } catch (err) {
    alert("Auth Error: " + err.message);
  }
});
