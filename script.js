const RANDOM_QUOTE_API_URL = 'https://api.quotable.io/random';
const quoteDisplayElement = document.getElementById('quoteDisplay');
const quoteInputElement = document.getElementById('quoteInput');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');

let wordCount = 0;
let totalElapsedTime = 0;
let startTime;
let timerInterval;

quoteInputElement.addEventListener('input', () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll('span');
  const arrayValue = quoteInputElement.value.split('');

  let correct = true;
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      characterSpan.classList.remove('correct');
      characterSpan.classList.remove('incorrect');
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct');
      characterSpan.classList.remove('incorrect');
    } else {
      characterSpan.classList.remove('correct');
      characterSpan.classList.add('incorrect');
      correct = false;
    }
  });
  wordCount = countWords(quoteInputElement.value);
  if (correct) {
    renderNewQuote();
  }
});

function countWords(text) {
  const words = text.split(/\s+/);
  return words.filter(word => word !== '').length;
}

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content);
}

async function renderNewQuote() {
  const quote = await getRandomQuote();
  quoteDisplayElement.innerHTML = '';
  quote.split('').forEach(character => {
    const characterSpan = document.createElement('span');
    characterSpan.innerText = character;
    quoteDisplayElement.appendChild(characterSpan);
  });
  quoteInputElement.value = null;
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);

  startTime = new Date();
  timerInterval = setInterval(() => {
    timerElement.innerText = getTimerTime();
    updateWPM();
  }, 1000);
}

function getTimerTime() {
  const elapsedTime = Math.floor((new Date() - startTime + totalElapsedTime) / 1000);
  return elapsedTime;
}

function updateWPM() {
  const timeInSeconds = getTimerTime();
  const minutes = timeInSeconds / 60;
  const wpm = Math.round(wordCount / minutes);
  wpmElement.innerText = "WPM = "+wpm;
}

renderNewQuote();
setInterval(updateWPM(), 1000);
