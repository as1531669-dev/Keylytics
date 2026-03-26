let startTime, timerInterval, isStarted = false;
const typingBox = document.getElementById('typing-box');

// 1. Timer & Word Count Logic
typingBox.addEventListener('input', () => {
    if (!isStarted) {
        isStarted = true;
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }
    
    // Update Word Count
    let text = typingBox.value.trim();
    let words = text ? text.split(/\s+/).length : 0;
    document.getElementById('word-count').innerText = words;
});

function updateTimer() {
    let now = Date.now();
    let diff = Math.floor((now - startTime) / 1000);
    let m = Math.floor(diff / 60).toString().padStart(2, '0');
    let s = (diff % 60).toString().padStart(2, '0');
    document.getElementById('timer').innerText = `${m}:${s}`;
}

// 2. Save as PDF Functionality
document.getElementById('save-pdf-btn').onclick = () => {
    const text = typingBox.value;
    if (!text) return alert("Pehle kuch type toh kijiye!");

    const element = document.createElement('div');
    element.innerHTML = `<h2 style="margin-bottom:20px; border-bottom:1px solid #000;">Keylytics Document</h2>
                         <p style="white-space: pre-wrap; font-family: 'Courier New'; line-height: 1.8;">${text}</p>
                         <hr style="margin-top:30px;">
                         <p style="font-size:12px; color:gray;">Time: ${document.getElementById('timer').innerText} | Words: ${document.getElementById('word-count').innerText}</p>`;

    const opt = {
        margin: 15,
        filename: 'My_Transcription.pdf',
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
};

// 3. Save as Text File Functionality
document.getElementById('save-txt-btn').onclick = () => {
    const text = typingBox.value;
    if (!text) return alert("Kuch toh likhiye!");

    const blob = new Blob([text], { type: "text/plain" });
    const anchor = document.createElement("a");
    anchor.download = "My_Transcription.txt";
    anchor.href = window.URL.createObjectURL(blob);
    anchor.click();
};
