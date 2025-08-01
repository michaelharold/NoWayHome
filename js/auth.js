// js/auth.js
import {
  auth, db, ref, set, get,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from './firebase.js';

const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = signupForm.email.value;
    const password = signupForm.password.value;
    const hometown = document.getElementById('hometown').value;
    const wishlist = document.getElementById('wishlist').value.split(',');

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await set(ref(db, `users/${cred.user.uid}`), {
        email, hometown, wishlist
      });
      alert('Signup successful');
      window.location.href = 'booking.html';
    } catch (err) {
      alert('Error: ' + err.message);
    }
  });
}