// js/booking.js
import { auth, db, ref, get } from './firebase.js';

const bookingForm = document.getElementById('bookingForm');

bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) {
    alert("Not logged in");
    return;
  }

  const uid = user.uid;
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const date = new Date(document.getElementById('date').value);

  const userSnap = await get(ref(db, `users/${uid}`));
  const userData = userSnap.val();

  const returnFrom = userData.wishlist[0]; // pick from wishlist
  const returnDate = new Date(date);
  returnDate.setDate(date.getDate() + 7);

  localStorage.setItem('tripDetails', JSON.stringify({
    to, from, date, returnFrom, returnDate: returnDate.toISOString()
  }));

  window.location.href = "trip-details.html";
});