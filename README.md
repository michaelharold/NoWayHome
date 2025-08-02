<img width="3188" height="1202" alt="frame (3)" src="https://github.com/user-attachments/assets/517ad8e9-ad22-457d-9538-a9e62d137cd7" />


# NO WAY HOME 🎯


## Basic Details
### Team Name: Tubelight

### Team Members
- Team Lead: Michael Harold Sony - TKM College Of Engineering
- Member 2: Saniya Jose - TKM College Of Engineering

### Project Description
No Way Home is a chaotic-good travel booking website that mischievously reroutes your trips to your dream destinations — even if you were just trying to go home. It sneakily adds surprise destinations, movie tickets, and snacks to make sure you “accidentally” fulfill your travel wishlist.

### The Problem (that doesn't exist)
Sometimes we make travel plans and stick to them. Boring. Or worse!we keep talking about our bucket list destinations but never go. Who needs self-control?

### The Solution (that nobody asked for)
We hijack your travel plans for your own good.
Book a flight home? Too bad because we’re secretly adding a return trip from your favorite city.
We’ll even throw in a surprise movie ticket before you come back.
No refunds. No guilt. Maximum mischief.

## Technical Details
### Technologies/Components Used
For Software:
Languages: HTML, CSS, JavaScript
Backend: Firebase (Auth, Firestore)
Tools:Canva (design assets)


### Implementation
# Installation
npm install

# Run
Frontend is deployed via Firebase Hosting. Just open index.html or run:
firebase deploy

### Project Documentation
For Software:
  📁 NO WAY HOME
  ├── .firebase/
  ├── node_modules/
  ├── .env
  ├── .firebaserc
  ├── .gitignore
  ├── 404.html → Custom 404 error page
  ├── README.md → Project overview and instructions
  ├── auth.js → Firebase authentication logic
  ├── firebase-config.js → Firebase project configuration
  ├── firebase.json → Firebase hosting and functions settings
  ├── package.json → Node project manifest
  ├── package-lock.json → Exact package versions
  ├── style.css → Global styles for the website

📄 Core HTML Pages:
  ├── index.html → Landing page with login/signup
  ├── profile.html → User fills preferences (home, wishlist, food, genre)
  ├── booking.html → One-way trip booking interface
  ├── return-ticket.html → Surprise return trip from wishlist
  ├── to-ticket.html → Initial booked one-way ticket
  ├── movie-booked.html → Recommended movie ticket before return
  ├── final-itinerary.html → Summary of flights, movie, etc.
  ├── chatbot.html → Chatbot page for travel help/fun

📄 JavaScript Logic Files:
  ├── profile.js → Handles profile form and Firestore writes
  ├── booking.js → Booking form logic + surprise logic
  ├── return-ticket.js → Displays surprise return trip info
  ├── san-ai.js → Gemini/GPT-4o chatbot logic
  ├── auth.js → Login/register with Firebase
  ├── firebase-config.js → Firestore + auth initialization

📁 Assets:
  ├── Bgm1.png → Background image
  ├── NWH_Logo-removebg.png → Website logo
  ├── maccy_... .png → Likely illustration or asset

# Screenshots (Add at least 3)
Login Page
![WhatsApp Image 2025-08-02 at 7 15 33 AM](https://github.com/user-attachments/assets/fd2eaf1e-a6c4-4494-aaf7-0fc8ccbf66e6)

Secure user login portal for accessing the No Way Home platform — where you pick the flight, and we picks your fate

![Screenshot2]
![WhatsApp Image 2025-08-02 at 7 15 33 AM (1)](https://github.com/user-attachments/assets/30200a41-5a0d-4461-beb3-0117a7ccf8bf)


Personalize your journey — set your home, wishlist destinations, favorite food, and movie vibes.

![Screenshot3]
![WhatsApp Image 2025-08-02 at 7 16 23 AM](https://github.com/user-attachments/assets/21d99f37-b80f-478b-a8c2-e188ae24f591)



# Diagrams
User Onboarding & Profile Setup
The user signs up/logs in via Firebase Authentication.
They're prompted to fill a fun profile form — including:

1.Home country
2.Wishlist destinations
3.Favorite food
4.Preferred movie genres

Trip Booking Flow
The user tries to book a simple one-way trip (e.g., to their hometown).
But here’s the twist...

Mischievous Redirection Logic
The app “secretly” adds a return ticket from a wishlist destination instead (7 days later), nudging them toward their travel dreams.

Trip Extras Generation
Based on their movie genre preferences and travel dates:

A movie ticket (2 days before return) is suggested using the TMDb API.

Their favorite food is used to personalize suggestions (or maybe AI commentary).

SAN-AI Chatbot (Gemini or GPT-4o)
An AI-powered assistant helps with:

Explaining their trip setup

Giving packing tips, safety advice

Making the surprise fun, yet practical

Data Storage & Retrieval (Firebase Firestore)
All user preferences, trip data, and chatbot interactions are stored/retrieved from Firebase Firestore.


### Project Demo
# Video
https://drive.google.com/file/d/1PSbDcUJknK5XKtEaTcdxqhzokE_2mTNi/view?usp=drive_link



## Team Contributions

- Michael Harold Sony:Authentication and database integration,built all pages (login, booking, profile etc.) with HTML, CSS, and JavaScript
- Saniya Jose:Frontend design,animations


---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--25-25?link=https%3A%2F%2Fwww.tinkerhub.org%2Fevents%2FQ2Q1TQKX6Q%2FUseless%2520Projects)
