let startTime, timerInterval, isStarted = false;
let isPaused = false;
let totalPausedTime = 0;
let pauseStartTime = 0;

const typingBox = document.getElementById('typing-box');
const pauseBtn = document.getElementById("pause-btn");
const resumeBtn = document.getElementById("resume-btn");

typingBox.addEventListener('input', () => {
    if (isPaused) return;

    if (!isStarted) {
        isStarted = true;
        startTime = Date.now();
        timerInterval = setInterval(updateStats, 1000);
    }
    
    let text = typingBox.value.trim();
    let words = text ? text.split(/\s+/).length : 0;
    document.getElementById('word-count').innerText = words;

    // AUTO SCROLL
    typingBox.scrollTop = typingBox.scrollHeight;
});

function updateStats() {
    if (isPaused) return;

    let now = Date.now();
    let diffSecs = Math.floor((now - startTime - totalPausedTime) / 1000);
    
    let m = Math.floor(diffSecs / 60).toString().padStart(2, '0');
    let s = (diffSecs % 60).toString().padStart(2, '0');
    document.getElementById('timer').innerText = `${m}:${s}`;
    
    let wordCount = parseInt(document.getElementById('word-count').innerText);
    if (diffSecs > 1) {
        let wpm = Math.round(wordCount / (diffSecs / 60));
        document.getElementById('wpm').innerText = wpm || 0;
    }
}

// Pause Logic
function pauseTimer() {
    if (!isStarted || isPaused) return;
    
    isPaused = true;
    pauseStartTime = Date.now();
    typingBox.disabled = true;
    
    if(pauseBtn) pauseBtn.style.display = "none";
    if(resumeBtn) resumeBtn.style.display = "inline-block";
}

// Resume Logic
function resumeTimer() {
    if (!isPaused) return;
    
    isPaused = false;
    totalPausedTime += (Date.now() - pauseStartTime);
    typingBox.disabled = false;
    typingBox.focus();
    
    if(pauseBtn) pauseBtn.style.display = "inline-block";
    if(resumeBtn) resumeBtn.style.display = "none";
}

// Save PDF Logic
document.getElementById('save-pdf-btn').onclick = () => {
    const el = document.createElement('div');
    el.innerHTML = `<h1 style="color:#2563eb; font-family:sans-serif;">Steno Transcription</h1><p style="white-space:pre-wrap; font-family:monospace; font-size:18px; line-height:1.6; margin-top:20px;">${typingBox.value}</p>`;
    html2pdf().set({ margin: 20, filename: 'Keylytics_Steno.pdf' }).from(el).save();
};

// Save TXT Logic
document.getElementById('save-txt-btn').onclick = () => {
    const blob = new Blob([typingBox.value], { type: "text/plain" });
    const a = document.createElement("a");
    a.download = "note.txt"; 
    a.href = URL.createObjectURL(blob); 
    a.click();
};
