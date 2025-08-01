// js/advisor.js
async function askBot() {
  const question = document.getElementById('question').value;

  // Replace with Gemini API call
  const response = await fetch('https://dummy-gemini-api.com/advice?q=' + question);
  const data = await response.json();

  document.getElementById('response').innerText = data.answer || "Gemini says: 'Have fun!'";
}