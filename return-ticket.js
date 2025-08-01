
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { firebaseConfig } from './firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

const ticketContainer = document.getElementById("return-ticket");
const yesBtn = document.getElementById("yes-btn");

function generateFlightName() {
  const airlines = ["DreamAir", "FlyMojo", "SkyWhale", "AirNomad", "CloudNine"];
  return airlines[Math.floor(Math.random() * airlines.length)];
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.email));
    if (userDoc.exists()) {
      const data = userDoc.data();
      const name = user.displayName || "Mystery Traveler";
      const home = data.homeCountry || "Unknown";
      const wishlist = data.wishlist || [];

      if (wishlist.length === 0) {
        ticketContainer.innerHTML = "<p>No wishlist destinations found. 🙁</p>";
        return;
      }

      const randomCity = wishlist[Math.floor(Math.random() * wishlist.length)];
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 7);

      ticketContainer.innerHTML = `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Flight:</strong> ${generateFlightName()} #${Math.floor(Math.random() * 9000 + 1000)}</p>
        <p><strong>From:</strong> ${randomCity}</p>
        <p><strong>To:</strong> ${home}</p>
        <p><strong>Date:</strong> ${formatDate(returnDate)}</p>
      `;

      localStorage.setItem("returnTicket", JSON.stringify({
        name,
        flight: generateFlightName(),
        from: randomCity,
        to: home,
        date: formatDate(returnDate)
      }));

    } else {
      ticketContainer.innerHTML = "<p>User profile not found. 🕵️</p>";
    }
  } else {
    ticketContainer.innerHTML = "<p>You must be signed in to view your return ticket. 🚪</p>";
  }
});

yesBtn.addEventListener("click", () => {
  window.location.href = "to-ticket.html";
});

// Bot logic
const botIcon = document.getElementById("sanai-icon");
const botWindow = document.getElementById("sanai-window");
const closeBot = document.getElementById("close-bot");

botIcon.addEventListener("click", () => {
  botWindow.classList.toggle("hidden");
});

closeBot.addEventListener("click", () => {
  botWindow.classList.add("hidden");
});