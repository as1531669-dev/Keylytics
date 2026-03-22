let timerDisplay = document.getElementById('timer');
let wpmDisplay = document.getElementById('wpm');
let charCountDisplay = document.getElementById('char-count');
let typingArea = document.getElementById('typing-area');
let resetBtn = document.getElementById('reset-btn');

let startTime, elapsedTime = 0, timerInterval, isTyping = false, timeout;

function updateStats() {
    const text = typingArea.value.trim();
    const chars = typingArea.value.length;
    const words = text === "" ? 0 : text.split(/\s+/).length;
    charCountDisplay.innerText = chars;
    if (elapsedTime > 0) {
        wpmDisplay.innerText = Math.round(words / (elapsedTime / 60000));
    }
}

function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        let totalSecs = Math.floor(elapsedTime / 1000);
        let m = Math.floor(totalSecs / 60).toString().padStart(2, '0');
        let s = (totalSecs % 60).toString().padStart(2, '0');
        timerDisplay.innerText = `${m}:${s}`;
        updateStats();
    }, 1000);
}

typingArea.addEventListener('input', () => {
    if (!isTyping) { isTyping = true; startTimer(); }
    clearTimeout(timeout);
    timeout = setTimeout(() => { isTyping = false; clearInterval(timerInterval); }, 1000);
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isTyping = false; elapsedTime = 0;
    typingArea.value = "";
    timerDisplay.innerText = "00:00";
    wpmDisplay.innerText = "0";
    charCountDisplay.innerText = "0";
});