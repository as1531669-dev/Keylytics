// Keylytics - Original Core Script

const samplePassage = "Practice makes a person perfect. Typing regularly with proper accuracy and speed helps in mastering stenography and computer speed examinations. Keylytics provides real-time feedback on your performance.";

let timeLimit = 60;
let timeLeft = timeLimit;
let timer = null;
let isTestStarted = false;
let totalTypedChars = 0;
let correctTypedChars = 0;

const textDisplay = document.getElementById("textDisplay");
const typingInput = document.getElementById("typingInput");
const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");

// Passage Render Function
function initTest() {
  textDisplay.innerHTML = "";
  samplePassage.split("").forEach((char, index) => {
    const span = document.createElement("span");
    span.innerText = char;
    if (index === 0) span.classList.add("current");
    textDisplay.appendChild(span);
  });
}

// Typing Event Listener
typingInput.addEventListener("input", () => {
  if (!isTestStarted) {
    isTestStarted = true;
    startTimer();
  }

  const arrayQuote = textDisplay.querySelectorAll("span");
  const arrayValue = typingInput.value.split("");

  correctTypedChars = 0;
  totalTypedChars = arrayValue.length;

  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index];

    characterSpan.classList.remove("current");

    if (character == null) {
      characterSpan.classList.remove("correct", "incorrect");
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
      correctTypedChars++;
    } else {
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");
    }
  });

  if (arrayValue.length < arrayQuote.length) {
    arrayQuote[arrayValue.length].classList.add("current");
  }

  // Calculate Metrics on Every Keystroke
  calculateMetrics();
});

// Timer Logic
function startTimer() {
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timerDisplay.innerText = `${timeLeft}s`;
      calculateMetrics();
    } else {
      clearInterval(timer);
      typingInput.disabled = true;
    }
  }, 1000);
}

// Live WPM & Accuracy Calculation
function calculateMetrics() {
  let timeSpent = timeLimit - timeLeft;
  if (timeSpent <= 0) timeSpent = 1;

  // Standard Formula: 5 Characters = 1 Word
  let wpm = Math.round((correctTypedChars / 5) / (timeSpent / 60));
  wpmDisplay.innerText = wpm >= 0 && !isNaN(wpm) ? wpm : 0;

  // Accuracy Percentage
  let accuracy = totalTypedChars > 0 ? Math.round((correctTypedChars / totalTypedChars) * 100) : 100;
  accuracyDisplay.innerText = `${accuracy}%`;
}

// Reset Test Function
function resetTest() {
  clearInterval(timer);
  timeLeft = timeLimit;
  isTestStarted = false;
  totalTypedChars = 0;
  correctTypedChars = 0;

  timerDisplay.innerText = `${timeLimit}s`;
  wpmDisplay.innerText = "0";
  accuracyDisplay.innerText = "100%";
  
  typingInput.value = "";
  typingInput.disabled = false;
  
  initTest();
}

// Initialize on Load
initTest();
