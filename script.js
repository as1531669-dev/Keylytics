let startTime, timerInterval, isStarted = false;
const typingBox = document.getElementById('typing-box');

typingBox.addEventListener('input', () => {
    if (!isStarted) {
        isStarted = true;
        startTime = Date.now();
        timerInterval = setInterval(updateStats, 1000);
    }
    
    // Live Word Count
    let text = typingBox.value.trim();
    let words = text ? text.split(/\s+/).length : 0;
    document.getElementById('word-count').innerText = words;
});

function updateStats() {
    let now = Date.now();
    let diffSecs = Math.floor((now - startTime) / 1000);
    
    // Timer
    let m = Math.floor(diffSecs / 60).toString().padStart(2, '0');
    let s = (diffSecs % 60).toString().padStart(2, '0');
    document.getElementById('timer').innerText = `${m}:${s}`;
    
    // Accurate WPM
    let wordCount = parseInt(document.getElementById('word-count').innerText);
    if (diffSecs > 1) {
        let wpm = Math.round(wordCount / (diffSecs / 60));
        document.getElementById('wpm').innerText = wpm || 0;
    }
}

document.getElementById('save-pdf-btn').onclick = () => {
    const text = typingBox.value;
    if (!text) return alert("Kuch likho!");
    const el = document.createElement('div');
    el.innerHTML = `<h2 style="color:#2563eb;">Keylytics Note</h2><p style="white-space:pre-wrap; font-family:monospace;">${text}</p>`;
    html2pdf().set({ margin: 20, filename: 'note.pdf' }).from(el).save();
};

document.getElementById('save-txt-btn').onclick = () => {
    const blob = new Blob([typingBox.value], { type: "text/plain" });
    const a = document.createElement("a");
    a.download = "note.txt"; a.href = URL.createObjectURL(blob); a.click();
};
