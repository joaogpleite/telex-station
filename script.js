// script.js
// Simples telex terminal: cada tecla imprime um caractere no "papel" e toca sound_telex.m4a.
// Assuma que sound_telex.m4a está na mesma pasta.

(function(){
  const paper = document.getElementById('paper-area');
  const sound = document.getElementById('telex-sound');
  const loadBtn = document.getElementById('load-sample');
  const clearBtn = document.getElementById('clear-paper');
  const toggleSoundBtn = document.getElementById('toggle-sound');

  let soundEnabled = true;

  // Mensagem de exemplo (baseada na imagem fornecida)
  const sampleMessage =
`TO:  VULCAN IRON WORKS INC.
FM:  STRAITS ENGINEERS
21/12/81  ST0553

ATTN: MR. JESSE H. PERRY

AM PLEASED TO INFORM YOU OUR VULCAN 020 IS WORKING WELL ON THE ROCK BREAKER.

COULD YOU GIVE ME THE NAME, ADDRESS, TELEX NUMBER ETC.
OF THE MANUFACTURER OF 1'' THICK MICARTA SHEETS PLEASE.

HOPE YOU HAVE A MERRY CHRISTMAS AND ALL GOOD WISHES FOR 1982.

REGARDS
ALAN KEET
+
VULCAN WPB

STREL RS23644
VVVV
REPLY VIA WUI-DIAL 101
T`;

  // Ensure paper has at least one line
  function ensureLine(){
    if (paper.lastElementChild == null || !paper.lastElementChild.classList.contains('line')) {
      const l = document.createElement('div');
      l.className = 'line';
      paper.appendChild(l);
      // keep scroll at bottom
      paper.scrollTop = paper.scrollHeight;
      return l;
    }
    return paper.lastElementChild;
  }

  function playSound(){
    if (!soundEnabled) return;
    // For quick retriggering: clone node to play overlapping sounds if needed
    try {
      // Some browsers allow quick restart; try current audio first
      sound.currentTime = 0;
      sound.play().catch(()=>{ /* interaction required */ });
    } catch(e){
      // fallback: create new Audio instance
      const a = new Audio(sound.src);
      a.volume = 0.9;
      a.play().catch(()=>{});
    }
  }

  // Append a character at the end (with animation)
  function appendChar(ch){
    const line = ensureLine();
    const span = document.createElement('span');
    span.className = 'char';
    // slightly vary class for nicer delay effect
    const n = (Math.floor(Math.random()*4)+1);
    span.classList.add('stamp-' + n);
    span.textContent = ch;
    line.appendChild(span);
    // keep scroll at bottom
    paper.scrollTop = paper.scrollHeight;
  }

  // Handle regular printable characters
  function handlePrintable(str){
    for (let i = 0; i < str.length; i++){
      const ch = str[i];
      // mimic telex: uppercase letters
      const printed = (ch === '\n') ? null : ch;
      if (printed !== null) {
        appendChar(printed.toUpperCase());
        playSound();
      } else {
        // newline
        ensureLine(); // finish current line
        // add new line container
        const newLine = document.createElement('div');
        newLine.className = 'line';
        paper.appendChild(newLine);
      }
    }
  }

  // Key handling
  document.addEventListener('keydown', function(ev){
    // focus behaviour: allow paper to be focused for mobile keyboards etc
    if (document.activeElement !== paper) {
      // keep focus on paper so audio policy satisfied on click
    }
    // Backspace
    if (ev.key === 'Backspace') {
      ev.preventDefault();
      // remove last char
      const lastLine = paper.querySelector('.line:last-child');
      if (!lastLine) return;
      if (lastLine.lastElementChild) {
        lastLine.removeChild(lastLine.lastElementChild);
      } else {
        // if line empty, remove it and leave previous
        if (paper.children.length > 0) paper.removeChild(lastLine);
      }
      playSound();
      return;
    }

    // Enter -> new line
    if (ev.key === 'Enter') {
      ev.preventDefault();
      const newLine = document.createElement('div');
      newLine.className = 'line';
      paper.appendChild(newLine);
      playSound();
      paper.scrollTop = paper.scrollHeight;
      return;
    }

    // Escape -> clear paper
    if (ev.key === 'Escape') {
      ev.preventDefault();
      clearPaper();
      return;
    }

    // Ignore modifier keys and control keys
    if (ev.ctrlKey || ev.altKey || ev.metaKey) return;

    // For normal printable keys, we wait for keypress/input because keydown gives code
    // but for cross-browser, process here for single-character keys:
    if (ev.key.length === 1) {
      ev.preventDefault();
      appendChar(ev.key.toUpperCase());
      playSound();
      return;
    }
  });

  // Paste support (prints pasted text)
  document.addEventListener('paste', function(ev){
    ev.preventDefault();
    const text = (ev.clipboardData || window.clipboardData).getData('text');
    if (!text) return;
    for (let i=0;i<text.length;i++){
      const ch = text[i];
      if (ch === '\r') continue;
      if (ch === '\n') {
        // push newline element
        const newLine = document.createElement('div');
        newLine.className = 'line';
        paper.appendChild(newLine);
      } else {
        appendChar(ch.toUpperCase());
        playSound();
      }
    }
  });

  // Click on paper gives it focus (important for some mobile/desktop audio policies)
  paper.addEventListener('click', function(){ paper.focus(); });

  // Buttons
  loadBtn.addEventListener('click', function(){
    clearPaper(false);
    // print sample line-by-line with small delay to feel like receiving
    const lines = sampleMessage.split('\n');
    let idx = 0;
    function printNextLine(){
      if (idx >= lines.length) return;
      const text = lines[idx];
      // print each character with tiny delay for realism
      let i = 0;
      const lineEl = document.createElement('div');
      lineEl.className = 'line';
      paper.appendChild(lineEl);
      function printChar(){
        if (i >= text.length) {
          // newline done
          idx++;
          setTimeout(printNextLine, 120); // small gap between lines
          return;
        }
        const ch = text[i];
        const span = document.createElement('span');
        span.className = 'char stamp-' + (Math.floor(Math.random()*4)+1);
        span.textContent = ch.toUpperCase();
        lineEl.appendChild(span);
        playSound();
        i++;
        paper.scrollTop = paper.scrollHeight;
        setTimeout(printChar, 45 + Math.random()*50);
      }
      printChar();
    }
    printNextLine();
  });

  clearBtn.addEventListener('click', function(){ clearPaper(true); });

  toggleSoundBtn.addEventListener('click', function(){
    soundEnabled = !soundEnabled;
    toggleSoundBtn.textContent = soundEnabled ? 'Mute' : 'Unmute';
  });

  function clearPaper(announce = true){
    paper.innerHTML = '';
    ensureLine();
    if (announce) {
      // brief clear soundburst
      if (soundEnabled) {
        try { sound.currentTime = 0; sound.play(); } catch(e) {}
      }
    }
  }

  // init
  ensureLine();
  // helper for first user interaction on some browsers to allow audio
  document.addEventListener('click', function initAudioOnce(){
    try { sound.volume = 0.9; } catch(e){}
    document.removeEventListener('click', initAudioOnce);
  });

  // expose for debug
  window.telex = {
    appendChar, clearPaper, sampleMessage
  };
})();
