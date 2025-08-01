import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const form = document.getElementById('profile-form');

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const uid = user.uid;

    const homeCountry = document.getElementById('home-country').value;
    const wishlist = document.getElementById('wishlist').value.split(',').map(item => item.trim());
    const food = document.getElementById('food').value;
    const genre = document.getElementById('genre').value;

    await setDoc(doc(db, "users", uid), {
      email: user.email,
      homeCountry,
      wishlist,
      favoriteFood: food,
      movieGenre: genre,
      profileComplete: true
    });

    window.location.href = "booking.html";
  });
});
