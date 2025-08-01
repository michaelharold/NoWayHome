import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// 🔥 Firebase config (replace with your own if needed)
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_APP.firebaseapp.com",
  projectId: "YOUR_APP",
  storageBucket: "YOUR_APP.appspot.com",
  messagingSenderId: "123456789",
  appId: "YOUR_ID"
};

// 🔌 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🤖 UI Elements
const sanaiIcon = document.getElementById('sanai-icon');
const sanaiWindow = document.getElementById('sanai-window');
const closeBtn = document.getElementById('close-sanai');
const wishlistList = document.getElementById('wishlist-items');

// 💬 Toggle chat window
sanaiIcon.addEventListener('click', () => {
  sanaiIcon.classList.add('hidden');
  sanaiWindow.classList.remove('hidden');
});

closeBtn.addEventListener('click', () => {
  sanaiWindow.classList.add('hidden');
  sanaiIcon.classList.remove('hidden');
});

// 📋 Fetch Wishlist from Firestore
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userEmail = user.email;
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("email", "==", userEmail));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      const wishlist = userData.wishlist || [];

      wishlistList.innerHTML = '';
      wishlist.forEach(place => {
        const li = document.createElement('li');
        li.textContent = place;
        wishlistList.appendChild(li);
      });
    }
  } else {
    wishlistList.innerHTML = '<li>Login to load wishlist</li>';
  }
});
