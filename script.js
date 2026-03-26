const officialPassage = "The Indian economy is one of the fastest growing economies in the world today. The government has taken several steps to improve the ease of doing business and attract foreign investment. Digital India and Make in India are key initiatives that have transformed the landscape of the country. Infrastructure development is being prioritized to enhance connectivity across states. Education and healthcare remain the primary focus for sustainable growth. Skill development among the youth is essential for the future of the nation.";

let startTime, timerInterval, isStarted = false;

window.onload = () => { document.getElementById('master-text').value = officialPassage; };

// Timer starts on first keypress and goes UP
document.getElementById('typing-box').addEventListener('input', () => {
    if (!isStarted) {
        isStarted = true;
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }
    // Live WPM calculation
    let words = document.getElementById('typing-box').value.trim().split(/\s+/).length;
    document.getElementById('wpm').innerText = words;
});

function updateTimer() {
    let now = Date.now();
    let diff = Math.floor((now - startTime) / 1000);
    let m = Math.floor(diff / 60).toString().padStart(2, '0');
    let s = (diff % 60).toString().padStart(2, '0');
    document.getElementById('timer').innerText = `${m}:${s}`;
}

document.getElementById('final-submit').onclick = () => {
    clearInterval(timerInterval);
    const original = officialPassage.trim().split(/\s+/);
    const typed = document.getElementById('typing-box').value.trim().split(/\s+/);
    
    let mistakes = 0;
    let html = "";

    original.forEach((word, i) => {
        if (typed[i] === word) {
            html += `<span>${word} </span>`;
        } else {
            mistakes++;
            html += `<span class="wrong">${word}</span><span class="correct">${typed[i] || "___"}</span> `;
        }
    });

    document.getElementById('res-total').innerText = original.length;
    document.getElementById('res-errors').innerText = mistakes;
    let acc = ((original.length - mistakes) / original.length * 100).toFixed(2);
    document.getElementById('res-acc').innerText = (acc < 0 ? 0 : acc) + "%";
    
    document.getElementById('analysis-view').innerHTML = html;
    document.getElementById('result-modal').style.display = "block";
};

// PDF Download Function
document.getElementById('download-pdf').onclick = () => {
    const element = document.querySelector(".modal-content");
    const opt = {
        margin: 10,
        filename: 'Keylytics_Result.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
};
