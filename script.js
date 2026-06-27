let startTime, timerInterval, isStarted = false;
let isPaused = false;
let totalPausedTime = 0; // Pause ke dauran jo time waste hua use track karne ke liye
let pauseStartTime = 0;

const typingBox = document.getElementById('typing-box');
const pauseBtn = document.getElementById("pause-btn");
const resumeBtn = document.getElementById("resume-btn");

typingBox.addEventListener('input', () => {
    // Agar game paused hai, toh type nahi karne dena hai
    if (isPaused) return;

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
    if (isPaused) return; // Agar pause hai toh stats update mat karo

    let now = Date.now();
    // Pura time me se shuruat ka time aur pause ka time minus kar do
    let diffSecs = Math.floor((now - startTime - totalPausedTime) / 1000);
    
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

// --- PAUSE AUR RESUME FUNCTIONS ---
function pauseTimer() {
    if (!isStarted || isPaused) return; // Agar test shuru hi nahi hua toh pause nahi hoga
    
    isPaused = true;
    pauseStartTime = Date.now(); // Note kar lo kab pause kiya
    typingBox.disabled = true; // Typing rokne ke liye
    
    // Buttons toggle karein
    if(pauseBtn) pauseBtn.style.display = "none";
    if(resumeBtn) resumeBtn.style.display = "inline-block";
}

function resumeTimer() {
    if (!isPaused) return;
    
    isPaused = false;
    totalPausedTime += (Date.now() - pauseStartTime); // Jitni der pause rha use total me jod do
    typingBox.disabled = false;
    typingBox.focus(); // Wapas cursor laane ke liye
    
    // Buttons toggle karein
    if(pauseBtn) pauseBtn.style.display = "inline-block";
    if(resumeBtn) resumeBtn.style.display = "none";
}

// --- SAVE BUTTONS LOGIC ---
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
