// Generator 200 Soal MTK Dasar & Logika
function generate200Questions() {
  const list = [];
  const ops = ['+', '-', '×', '÷'];
  
  for (let i = 0; i < 160; i++) {
    const op = ops[i % 4];
    let a, b, answer, questionStr;

    if (op === '+') {
      a = Math.floor(Math.random() * 80) + 10;
      b = Math.floor(Math.random() * 80) + 10;
      answer = a + b;
      questionStr = `Berapakah hasil dari ${a} + ${b}?`;
    } else if (op === '-') {
      a = Math.floor(Math.random() * 90) + 20;
      b = Math.floor(Math.random() * a) + 5;
      answer = a - b;
      questionStr = `Berapakah hasil dari ${a} - ${b}?`;
    } else if (op === '×') {
      a = Math.floor(Math.random() * 12) + 2;
      b = Math.floor(Math.random() * 15) + 2;
      answer = a * b;
      questionStr = `Berapakah hasil dari ${a} × ${b}?`;
    } else {
      b = Math.floor(Math.random() * 12) + 2;
      answer = Math.floor(Math.random() * 12) + 2;
      a = b * answer;
      questionStr = `Berapakah hasil dari ${a} ÷ ${b}?`;
    }

    const optionsSet = new Set([answer]);
    while (optionsSet.size < 4) {
      let delta = (Math.floor(Math.random() * 10) + 1) * (Math.random() < 0.5 ? 1 : -1);
      let wrong = answer + delta;
      if (wrong >= 0) optionsSet.add(wrong);
    }

    const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);
    list.push({
      category: `MTK - ${op === '+' ? 'Penjumlahan' : op === '-' ? 'Pengurangan' : op === '×' ? 'Perkalian' : 'Pembagian'}`,
      q: questionStr,
      options: options.map(String),
      ans: options.indexOf(answer)
    });
  }

  const ctBank = [
    { q: "Urutan langkah logis untuk menyelesaikan masalah disebut?", options: ["Algoritma", "Variabel", "Looping", "Bug"], ans: 0 },
    { q: "Proses memecah masalah besar menjadi bagian-bagian kecil dinamakan?", options: ["Abstraksi", "Dekomposisi", "Pola", "Pengurutan"], ans: 1 },
    { q: "Mencari kesamaan atau pola dalam beberapa masalah disebut?", options: ["Pattern Recognition", "Algoritma", "Debugging", "Kompilasi"], ans: 0 },
    { q: "Mengabaikan informasi yang tidak relevan untuk fokus pada inti masalah disebut?", options: ["Dekomposisi", "Abstraksi", "Pengulangan", "Array"], ans: 1 },
    { q: "Simbol flowchart berbentuk jajar genjang menggambarkan fungsi?", options: ["Start/End", "Process", "Input/Output", "Decision"], ans: 2 }
  ];

  for (let i = 0; i < 40; i++) {
    const item = ctBank[i % ctBank.length];
    list.push({
      category: "Computational Thinking",
      q: item.q,
      options: item.options,
      ans: item.ans
    });
  }

  return list;
}

const masterQuestionsPool = generate200Questions();
let activeSessionQuestions = [];
let currentQIndex = 0;
let gameScore = 0;
let timerInterval = null;
let timeLeft = 20;

function startGame() {
  const nameInput = document.getElementById('player-name');
  const name = nameInput ? nameInput.value.trim() : '';
  
  if (!name) { 
    alert('Mohon masukkan nama Anda terlebih dahulu!'); 
    return; 
  }
  
  activeSessionQuestions = [...masterQuestionsPool].sort(() => Math.random() - 0.5).slice(0, 15);
  currentQIndex = 0; 
  gameScore = 0;
  
  document.getElementById('game-start-box').classList.add('hidden');
  document.getElementById('quiz-area').classList.remove('hidden');
  
  loadQuestion();
}

function loadQuestion() {
  if (currentQIndex >= activeSessionQuestions.length) { 
    finishGame(); 
    return; 
  }
  
  const currentQ = activeSessionQuestions[currentQIndex];
  
  document.getElementById('current-q-num').innerText = currentQIndex + 1;
  document.getElementById('current-score').innerText = gameScore;
  document.getElementById('question-category').innerText = currentQ.category;
  document.getElementById('question-text').innerText = currentQ.q;
  
  const container = document.getElementById('options-container');
  container.innerHTML = '';
  
  currentQ.options.forEach((optText, idx) => {
    const btn = document.createElement('button');
    btn.className = "w-full bg-slate-900 border border-slate-700 hover:border-indigo-500 hover:bg-slate-800 text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-200 transition shadow-sm flex items-center justify-between";
    btn.innerHTML = `<span>${optText}</span><i class="fa-regular fa-circle text-slate-500 text-xs"></i>`;
    btn.onclick = () => handleAnswer(idx, btn);
    container.appendChild(btn);
  });

  resetTimer();
}

function handleAnswer(selectedIdx, buttonEl) {
  clearInterval(timerInterval);
  const currentQ = activeSessionQuestions[currentQIndex];
  const allButtons = document.querySelectorAll('#options-container button');
  
  allButtons.forEach(btn => btn.disabled = true);

  if (selectedIdx === currentQ.ans) {
    gameScore += 10;
    buttonEl.classList.add('correct-anim');
  } else {
    buttonEl.classList.add('wrong-anim');
    if (allButtons[currentQ.ans]) {
      allButtons[currentQ.ans].classList.add('correct-anim');
    }
  }

  document.getElementById('current-score').innerText = gameScore;

  setTimeout(() => {
    currentQIndex++;
    loadQuestion();
  }, 800);
}

function resetTimer() {
  clearInterval(timerInterval);
  timeLeft = 20;
  document.getElementById('timer-text').innerText = timeLeft;
  
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer-text').innerText = timeLeft;
    
    if (timeLeft <= 0) { 
      clearInterval(timerInterval);
      currentQIndex++; 
      loadQuestion(); 
    }
  }, 1000);
}

function finishGame() {
  clearInterval(timerInterval);
  const nameInput = document.getElementById('player-name');
  const name = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'Siswa';
  
  if (!window.firebaseDb || !window.firebaseRef || !window.firebaseSet) {
    alert(`🎉 SELAMAT ${name.toUpperCase()}!\n\nTotal Skor Anda: ${gameScore} Point.\n(Catatan: Server database belum terhubung)`);
    resetQuizUI();
    return;
  }

  // Kirim data langsung ke Server Cloud Firebase
  const leaderRef = window.firebaseRef(window.firebaseDb, 'leaderboard/' + Date.now());
  window.firebaseSet(leaderRef, { name: name, score: gameScore })
    .then(() => {
      alert(`🎉 SELAMAT ${name.toUpperCase()}!\n\nTes Logika & MTK telah selesai.\nTotal Skor Anda: ${gameScore} Point`);
      resetQuizUI();
      if (typeof window.switchTab === 'function') {
        window.switchTab('leaderboard');
      }
    })
    .catch(err => {
      alert(`Skor Anda: ${gameScore}\n\nTerjadi kesalahan koneksi server: ${err.message}`);
      resetQuizUI();
    });
}

function resetQuizUI() {
  document.getElementById('quiz-area').classList.add('hidden');
  document.getElementById('game-start-box').classList.remove('hidden');
}

// Global Exports
window.startGame = startGame;
