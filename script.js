const officialPassage = "The Indian economy is one of the fastest growing economies in the world today. The government has taken several steps to improve the ease of doing business and attract foreign investment. Digital India and Make in India are key initiatives that have transformed the landscape of the country. Infrastructure development is being prioritized to enhance connectivity across states. Education and healthcare remain the primary focus for sustainable growth. Skill development among the youth is essential for the future of the nation.";

let timeLeft = 600; 
let timerInterval;
let isStarted = false;

window.onload = () => { document.getElementById('master-text').value = officialPassage; };

document.getElementById('typing-box').addEventListener('input', () => {
    if (!isStarted) {
        isStarted = true;
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) { clearInterval(timerInterval); processResult(); }
            let m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            let s = (timeLeft % 60).toString().padStart(2, '0');
            document.getElementById('timer').innerText = `${m}:${s}`;
        }, 1000);
    }
});

document.getElementById('final-submit').onclick = processResult;

function processResult() {
    clearInterval(timerInterval);
    const original = officialPassage.trim().split(/\s+/);
    const typed = document.getElementById('typing-box').value.trim().split(/\s+/);
    let mistakes = 0;
    let html = "";
    original.forEach((word, i) => {
        if (typed[i] === word) { html += `<span>${word} </span>`; }
        else { mistakes++; html += `<span class="wrong">${word}</span><span class="correct">${typed[i] || "___"}</span> `; }
    });
    document.getElementById('res-total').innerText = original.length;
    document.getElementById('res-errors').innerText = mistakes;
    let acc = ((original.length - mistakes) / original.length * 100).toFixed(2);
    document.getElementById('res-acc').innerText = (acc < 0 ? 0 : acc) + "%";
    document.getElementById('analysis-view').innerHTML = html;
    document.getElementById('result-modal').style.display = "block";
}
