import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const botToggle = document.getElementById("bot-toggle");
const botExpanded = document.getElementById("bot-expanded");
const botClose = document.getElementById("bot-close");

const wishlistList = document.getElementById("wishlist-list");
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

// Expand/collapse behavior
botToggle.addEventListener("click", () => {
  botExpanded.classList.remove("hidden");
  botExpanded.classList.add("slide-up");
  botToggle.classList.add("hidden");
});

botClose.addEventListener("click", () => {
  botExpanded.classList.add("hidden");
  botToggle.classList.remove("hidden");
});

// Load wishlist
onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const wishlist = userSnap.data().wishlist || [];
    wishlistList.innerHTML = wishlist.length
      ? wishlist.map(city => `<li>📍 ${city}</li>`).join('')
      : "<li>No destinations yet.</li>";
  } else {
    wishlistList.innerHTML = "<li>Couldn't load wishlist.</li>";
  }
});

// Placeholder Gemini bot response
chatSend.addEventListener("click", () => {
  const msg = chatInput.value.trim();
  if (!msg) return;

  chatBox.innerHTML += `<p class="user-msg">${msg}</p>`;
  chatInput.value = "";

  // Placeholder reply (replace with Gemini API call)
  setTimeout(() => {
    chatBox.innerHTML += `<p class="bot-msg">Sorry, I’m still learning how to book chaos. 🤖</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 800);
});
