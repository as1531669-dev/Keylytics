let startTime, timerInterval, isStarted = false;
const typingBox = document.getElementById('typing-box');

typingBox.addEventListener('input', () => {
    if (!isStarted) {
        isStarted = true;
        startTime = Date.now();
        timerInterval = setInterval(updateStats, 1000);
    }
    
    // Live Stats
    let text = typingBox.value.trim();
    let wordsArr = text ? text.split(/\s+/) : [];
    document.getElementById('word-count').innerText = wordsArr.length;
});

function updateStats() {
    let now = Date.now();
    let diffInSeconds = Math.floor((now - startTime) / 1000);
    
    // Timer
    let m = Math.floor(diffInSeconds / 60).toString().padStart(2, '0');
    let s = (diffInSeconds % 60).toString().padStart(2, '0');
    document.getElementById('timer').innerText = `${m}:${s}`;
    
    // WPM Logic
    let words = parseInt(document.getElementById('word-count').innerText);
    let mins = diffInSeconds / 60;
    let wpm = Math.round(words / mins) || 0;
    if (diffInSeconds > 0) document.getElementById('wpm').innerText = wpm;
}

// Save PDF
document.getElementById('save-pdf-btn').onclick = () => {
    const text = typingBox.value;
    if (!text) return alert("Kuch type karein!");
    const element = document.createElement('div');
    element.innerHTML = `<h2 style="margin-bottom:20px;">Keylytics Document</h2><p style="white-space:pre-wrap; font-family:'Courier New'; line-height:1.8;">${text}</p>`;
    html2pdf().set({ margin: 15, filename: 'Steno_Practice.pdf' }).from(element).save();
};

// Save Text
document.getElementById('save-txt-btn').onclick = () => {
    const text = typingBox.value;
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.download = "Steno_Note.txt";
    a.href = window.URL.createObjectURL(blob);
    a.click();
};
