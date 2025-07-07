   const defaultText = `Success is not the result of spontaneous combustion. You must set yourself on fire. Focus is the key to unlocking your full potential and achieving meaningful progress every single day.`;
    let text = defaultText;

    const textDisplay = document.getElementById('textDisplay');
    const inputArea = document.getElementById('inputArea');
    const customText = document.getElementById('customText');
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');
    const timeDisplay = document.getElementById('time');
    const scoreHistory = document.getElementById('scoreHistory');

    let startTime, timerInterval, totalTyped = 0;

    function renderText() {
      textDisplay.innerHTML = '';
      for (let char of text) {
        const span = document.createElement('span');
        span.textContent = char;
        textDisplay.appendChild(span);
      }
    }

    function startTimer() {
      startTime = new Date();
      timerInterval = setInterval(() => {
        const elapsed = Math.floor((new Date() - startTime) / 1000);
        timeDisplay.textContent = elapsed;
        updateWPM();
      }, 1000);
    }

    function updateWPM() {
      const elapsedMinutes = (new Date() - startTime) / 1000 / 60;
      const wpm = elapsedMinutes > 0 ? Math.round((totalTyped / 5) / elapsedMinutes) : 0;
      wpmDisplay.textContent = wpm;
    }

    function updateAccuracy(value) {
      let correct = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] === text[i]) correct++;
      }
      const accuracy = value.length ? Math.round((correct / value.length) * 100) : 100;
      accuracyDisplay.textContent = accuracy;
    }

    inputArea.addEventListener('input', e => {
      const value = e.target.value;
      totalTyped = value.length;
      const spans = textDisplay.querySelectorAll('span');

      spans.forEach((span, index) => {
        const char = value[index];
        span.className = '';
        if (char == null) return;
        span.classList.add(char === span.textContent ? 'correct' : 'incorrect');
      });

      updateAccuracy(value);
      updateWPM();

      if (value === text) {
        clearInterval(timerInterval);
        inputArea.disabled = true;
        saveScore();
      }
    });

    function startTest() {
      if (customText.value.trim()) {
        text = customText.value.trim();
      } else {
        text = defaultText;
      }

      clearInterval(timerInterval);
      timeDisplay.textContent = '0';
      inputArea.disabled = false;
      inputArea.value = '';
      totalTyped = 0;
      renderText();
      inputArea.focus();
      startTimer();
    }

    function resetTest() {
      inputArea.value = '';
      inputArea.disabled = true;
      totalTyped = 0;
      wpmDisplay.textContent = '0';
      accuracyDisplay.textContent = '100';
      timeDisplay.textContent = '0';
      clearInterval(timerInterval);
      renderText();
    }

    function saveScore() {
      const wpm = wpmDisplay.textContent;
      const acc = accuracyDisplay.textContent;
      const timestamp = new Date().toLocaleTimeString();
      const newEntry = `WPM: ${wpm}, Accuracy: ${acc}%, at ${timestamp}`;

      let history = JSON.parse(localStorage.getItem('typingScores') || '[]');
      history.unshift(newEntry);
      history = history.slice(0, 5);
      localStorage.setItem('typingScores', JSON.stringify(history));
      loadHistory();
    }

    function loadHistory() {
      const history = JSON.parse(localStorage.getItem('typingScores') || '[]');
      scoreHistory.innerHTML = '';
      history.forEach(score => {
        const li = document.createElement('li');
        li.textContent = score;
        scoreHistory.appendChild(li);
      });
    }

    function clearHistory() {
  localStorage.removeItem('typingScores');
  scoreHistory.innerHTML = '';
}


    function toggleTheme() {
      const body = document.body;
      const current = body.getAttribute('data-theme');
      body.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
    }

    // Initial setup
    renderText();
    loadHistory();