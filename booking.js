import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const form = document.getElementById('booking-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const date = document.getElementById('date').value;

  localStorage.setItem('userBooking', JSON.stringify({ from, to, date }));
  window.location.href = 'return-ticket.html';
});

// Bot toggle logic
const botIcon = document.getElementById('sanai-icon');
const botWindow = document.getElementById('sanai-window');
const closeBot = document.getElementById('close-bot');

botIcon.addEventListener('click', () => {
  botWindow.classList.remove('hidden');
  botIcon.classList.add('hidden');
});

closeBot.addEventListener('click', () => {
  botWindow.classList.add('hidden');
  botIcon.classList.remove('hidden');
});

// Chat handling
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatArea = document.getElementById('chat-area');

sendBtn.addEventListener('click', () => {
  const input = userInput.value.trim();
  if (!input) return;

  const userMsg = document.createElement('p');
  userMsg.innerHTML = `<strong>You:</strong> ${input}`;
  chatArea.appendChild(userMsg);

  const botMsg = document.createElement('p');
  botMsg.innerHTML = `<strong>SAN-AI:</strong> ${getBotReply(input)}`;
  chatArea.appendChild(botMsg);

  userInput.value = "";
  chatArea.scrollTop = chatArea.scrollHeight;
});

function getBotReply(input) {
  input = input.toLowerCase();
  if (input.includes("recommend") || input.includes("where")) {
    return "You should pick one from your wishlist! 😉";
  }
  if (input.includes("movie")) {
    return "Don't worry, I've got movie plans for you too! 🎬";
  }
  return "Just wait... I'm planning something devious. 😈";
}

// Wishlist fetch
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, "users", user.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const wishlist = docSnap.data().wishlist || [];
      const listEl = document.getElementById('wishlist-items');
      wishlist.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        listEl.appendChild(li);
      });
    }
  }
});
