let masterText = "";
let timerInterval = null;
let secondsElapsed = 0;
let testStarted = false;

function startTest() {
  masterText = document.getElementById("masterPassage").value.trim();
  if (!masterText) {
    alert("Kripya pehle passage paste karein!");
    return;
  }

  document.getElementById("setupSection").style.display = "none";
  document.getElementById("typingSection").style.display = "block";
  document.getElementById("userTypingArea").value = "";
  document.getElementById("userTypingArea").focus();

  secondsElapsed = 0;
  testStarted = false;
  document.getElementById("timer").innerText = "00:00";
  document.getElementById("liveWordCount").innerText = "0";
  document.getElementById("liveWpm").innerText = "0";
}

function onTypingInput() {
  if (!testStarted) {
    testStarted = true;
    startTimer();
  }

  let typed = document.getElementById("userTypingArea").value;
  let wordCount = typed.trim() ? typed.trim().split(/\s+/).length : 0;
  document.getElementById("liveWordCount").innerText = wordCount;

  // Live WPM calculation
  let minutes = secondsElapsed / 60;
  if (minutes > 0) {
    let wpm = Math.round(wordCount / minutes);
    document.getElementById("liveWpm").innerText = wpm;
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    secondsElapsed++;
    let mins = Math.floor(secondsElapsed / 60);
    let secs = secondsElapsed % 60;
    document.getElementById("timer").innerText = 
      `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    
    let typed = document.getElementById("userTypingArea").value;
    let wordCount = typed.trim() ? typed.trim().split(/\s+/).length : 0;
    let minutes = secondsElapsed / 60;
    if (minutes > 0) {
      document.getElementById("liveWpm").innerText = Math.round(wordCount / minutes);
    }
  }, 1000);
}

function finishTest() {
  clearInterval(timerInterval);
  let typedText = document.getElementById("userTypingArea").value.trim();

  document.getElementById("typingSection").style.display = "none";
  document.getElementById("resultSection").style.display = "block";

  evaluateSSC(masterText, typedText);
}

function evaluateSSC(original, typed) {
  const masterWords = original.split(/\s+/);
  const typedWords = typed ? typed.split(/\s+/) : [];

  let fullMistakes = 0;
  let halfMistakes = 0;
  let diffHTML = [];

  const maxLen = Math.max(masterWords.length, typedWords.length);

  for (let i = 0; i < maxLen; i++) {
    let origWord = masterWords[i] || "";
    let typedWord = typedWords[i] || "";

    // Normalize words for comparison (remove punctuation and lower case)
    let origClean = origWord.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase();
    let typedClean = typedWord.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase();

    if (!typedWord) {
      // Omission Error (Full Mistake)
      fullMistakes++;
      diffHTML.push(`<span class="missing-word" title="Missing Word">[Om: ${origWord}]</span>`);
    } else if (!origWord) {
      // Extra Word (Full Mistake)
      fullMistakes++;
      diffHTML.push(`<span class="full-mistake" title="Extra Word">[Ex: ${typedWord}]</span>`);
    } else if (origClean !== typedClean) {
      // Wrong Word / Substitution (Full Mistake)
      fullMistakes++;
      diffHTML.push(`<span class="full-mistake" title="Expected: ${origWord}">${typedWord}</span>`);
    } else if (origWord !== typedWord) {
      // Spelling Case / Capitalization Error (Half Mistake)
      halfMistakes++;
      diffHTML.push(`<span class="half-mistake" title="Expected: ${origWord}">${typedWord}</span>`);
    } else {
      // Correct Match
      diffHTML.push(`<span class="correct">${typedWord}</span>`);
    }
  }

  // Formulas
  let totalMistakes = fullMistakes + (halfMistakes / 2);
  let errorPercentage = masterWords.length > 0 ? ((totalMistakes / masterWords.length) * 100).toFixed(2) : 0;
  let accuracy = Math.max(0, (100 - errorPercentage)).toFixed(2);

  let minutes = secondsElapsed / 60;
  let grossWpm = minutes > 0 ? Math.round(typedWords.length / minutes) : 0;

  // Render Stats
  document.getElementById("resTotalWords").innerText = masterWords.length;
  document.getElementById("resTimeTaken").innerText = `${secondsElapsed}s`;
  document.getElementById("resGrossWpm").innerText = grossWpm;
  document.getElementById("resAccuracy").innerText = `${accuracy}%`;
  document.getElementById("resFullMistakes").innerText = fullMistakes;
  document.getElementById("resHalfMistakes").innerText = halfMistakes;
  document.getElementById("resTotalMistakes").innerText = totalMistakes;
  document.getElementById("resErrorPercent").innerText = `${errorPercentage}%`;

  // Status Badges
  document.getElementById("statusGradeC").innerHTML = errorPercentage <= 5 
    ? `<span class="badge-pass">QUALIFIED (Errors &le; 5%)</span>` 
    : `<span class="badge-fail">NOT QUALIFIED (Errors > 5%)</span>`;

  document.getElementById("statusGradeD").innerHTML = errorPercentage <= 7 
    ? `<span class="badge-pass">QUALIFIED (Errors &le; 7%)</span>` 
    : `<span class="badge-fail">NOT QUALIFIED (Errors > 7%)</span>`;

  // Render Diff Output
  document.getElementById("diffContainer").innerHTML = diffHTML.join(" ");
}

function resetTest() {
  document.getElementById("resultSection").style.display = "none";
  document.getElementById("setupSection").style.display = "block";
  document.getElementById("masterPassage").value = "";
}
