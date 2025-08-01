import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const form = document.getElementById("booking-form");

let userData = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    userData = userSnap.data();
  } else {
    alert("User profile not found.");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const date = document.getElementById("date").value;

    const originalTrip = { from, to, date };
    const returnTrip = generateReturnTrip(originalTrip.date);
    showReturnTicket(returnTrip, originalTrip);
  });
});

function generateReturnTrip(departureDate) {
  const wishlist = userData.wishlist;
  const randomIndex = Math.floor(Math.random() * wishlist.length);
  const surpriseCity = wishlist[randomIndex];

  const returnDate = new Date(departureDate);
  returnDate.setDate(returnDate.getDate() + 7 + Math.floor(Math.random() * 4)); // 7–10 days later

  return {
    from: surpriseCity,
    to: userData.homeCountry,
    date: returnDate.toISOString().split("T")[0],
    genre: userData.movieGenre,
  };
}

function showReturnTicket(returnTrip, originalTrip) {
  const container = document.querySelector(".login-container");
  container.innerHTML = `
    <h2>🎁 Surprise Return Ticket</h2>
    <p>You thought you were just going from <strong>${originalTrip.from}</strong> to <strong>${originalTrip.to}</strong>?</p>
    <p>Well, guess what: You’re now returning from <strong>${returnTrip.from}</strong> to <strong>${returnTrip.to}</strong> on <strong>${returnTrip.date}</strong> ✈️</p>
    <p>Do you want to book a ticket <strong>TO ${returnTrip.from}</strong> so your return makes sense?</p>
    <button id="accept-btn">Yes, Book TO Ticket</button>
    <button id="decline-btn">No thanks</button>
  `;

  document.getElementById("accept-btn").addEventListener("click", () => {
    const movieDate = new Date(returnTrip.date);
    movieDate.setDate(movieDate.getDate() - 2);
    const movieTicket = {
      city: returnTrip.from,
      genre: returnTrip.genre,
      date: movieDate.toISOString().split("T")[0],
    };

    showItinerary(originalTrip, returnTrip, movieTicket);
  });

  document.getElementById("decline-btn").addEventListener("click", () => {
    showItinerary(originalTrip, returnTrip, null);
  });
}

function showItinerary(trip1, returnTrip, movie) {
  const container = document.querySelector(".login-container");
  container.innerHTML = `
    <h2>🧳 Your Chaotic Itinerary</h2>
    <ul style="text-align:left;">
      <li>🛫 <strong>Original Trip:</strong> ${trip1.from} → ${trip1.to} on ${trip1.date}</li>
      <li>✈️ <strong>Return Trip:</strong> ${returnTrip.from} → ${returnTrip.to} on ${returnTrip.date}</li>
      ${movie ? `<li>🎬 <strong>Movie:</strong> A ${movie.genre} movie in ${movie.city} on ${movie.date}</li>` : ''}
    </ul>
    <p style="margin-top:1rem;">🚨 Please go book these tickets yourself. Our system is too chaotic to do it for real.</p>
  `;
}
