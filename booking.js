import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const bookingForm = document.getElementById('booking-form');
const itineraryOutput = document.getElementById('itinerary-output');

const sanaiIcon = document.getElementById('sanai-icon');
const sanaiWindow = document.getElementById('sanai-window');
const closeSanai = document.getElementById('close-sanai');
const wishlistList = document.getElementById('wishlist-list');
const chatArea = document.getElementById('chat-area');

// Chatbot pop-up logic
const chatbotBox = document.getElementById('chatbotBox');
const closeChatbot = document.getElementById('closeChatbot');

if (sanaiIcon && chatbotBox) {
  sanaiIcon.addEventListener('click', () => {
    chatbotBox.style.display = 'block';
    sanaiIcon.style.display = 'none';
  });
}

if (closeChatbot && chatbotBox) {
  closeChatbot.addEventListener('click', () => {
    chatbotBox.style.display = 'none';
    sanaiIcon.style.display = 'block';
  });
}

// Toggle SAN-AI visibility
sanaiIcon.addEventListener('click', () => {
  sanaiWindow.classList.remove('hidden');
  sanaiIcon.classList.add('hidden');
});

closeSanai.addEventListener('click', () => {
  sanaiWindow.classList.add('hidden');
  sanaiIcon.classList.remove('hidden');
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    loadWishlist(data.wishlist || []);
  }

  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const from = document.getElementById('from').value.trim();
    const to = document.getElementById('to').value.trim();
    const date = document.getElementById('date').value;

    if (!from || !to || !date) return;

    const bookingDate = new Date(date);
    const returnDate = new Date(bookingDate);
    returnDate.setDate(returnDate.getDate() + 7);

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const data = userDoc.data();
    const wishlist = data.wishlist || [];

    const returnFrom = wishlist.length > 0
      ? wishlist[Math.floor(Math.random() * wishlist.length)]
      : "Paris";

    await updateDoc(doc(db, 'users', user.uid), {
      bookings: arrayUnion({
        from,
        to,
        date,
        returnFrom,
        returnTo: from,
        returnDate: returnDate.toISOString().split('T')[0],
        movieNight: {
          city: returnFrom,
          day: new Date(returnDate.setDate(returnDate.getDate() - 2)).toISOString().split('T')[0],
          movie: '🎬 Surprise Movie Night!'
        }
      })
    });

    showItinerary(from, to, date, returnFrom);
  });
});

function loadWishlist(wishlist) {
  wishlistList.innerHTML = '';
  if (wishlist.length === 0) {
    wishlistList.innerHTML = '<li>No destinations yet.</li>';
  } else {
    wishlist.forEach(city => {
      const li = document.createElement('li');
      li.textContent = `📍 ${city}`;
      wishlistList.appendChild(li);
    });
  }
}

function showItinerary(from, to, date, returnCity) {
  const returnDate = new Date(date);
  returnDate.setDate(returnDate.getDate() + 7);

  const movieDate = new Date(returnDate);
  movieDate.setDate(movieDate.getDate() - 2);

  itineraryOutput.innerHTML = `
    <div class="itinerary">
      <h3>😈 Your *real* itinerary:</h3>
      <p>🛫 Flight: ${from} → ${to} on ${date}</p>
      <p>🧭 Return Flight: ${returnCity} → ${from} on ${returnDate.toISOString().split('T')[0]}</p>
      <p>🎬 Surprise Movie Night in ${returnCity} on ${movieDate.toISOString().split('T')[0]}</p>
    </div>
  `;
}
