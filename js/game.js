// Bank Soal CT, Timer 20s, Scoring, & Integrasi Firebase Realtime
const questions = [
  { q: "Urutan langkah logis untuk menyelesaikan masalah disebut?", options: ["Algoritma", "Variabel", "Looping", "Bug"], ans: 0 },
  { q: "Manakah yang merupakan tipe data angka tanpa desimal?", options: ["String", "Integer", "Boolean", "Float"], ans: 1 },
  { q: "Proses memecah masalah besar menjadi bagian kecil disebut?", options: ["Abstraksi", "Dekomposisi", "Pattern Recognition", "Coding"], ans: 1 }
];

let currentQ = 0, gameScore = 0, timer, timeLeft = 20;

function startGame() {
  const name = document.getElementById('player-name').value.trim();
  if (!name) { alert('Masukkan nama terlebih dahulu!'); return; }
  
  currentQ = 0; gameScore = 0;
  document.getElementById('game-box').classList.add('hidden');
  document.getElementById('quiz-area').classList.remove('hidden');
  loadQuestion();
}

function loadQuestion() {
  if (currentQ >= questions.length) { finishGame(); return; }
  
  const q = questions[currentQ];
  document.getElementById('question-text').innerText = `${currentQ + 1}. ${q.q}`;
  const container = document.getElementById('options-container');
  container.innerHTML = '';
  
  q.options.forEach((opt, idx) => {
    container.innerHTML += `<button onclick="answerQuestion(${idx})" class="w-full bg-slate-900 hover:bg-indigo-600 text-left px-3 py-2 rounded-lg text-xs text-slate-200 transition">${opt}</button>`;
  });

  resetTimer();
}

function answerQuestion(idx) {
  if (idx === questions[currentQ].ans) gameScore += 10;
  document.getElementById('current-score').innerText = gameScore;
  currentQ++;
  loadQuestion();
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 20;
  document.getElementById('timer-text').innerText = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer-text').innerText = timeLeft;
    if (timeLeft <= 0) { currentQ++; loadQuestion(); }
  }, 1000);
}

function finishGame() {
  clearInterval(timer);
  const name = document.getElementById('player-name').value.trim();
  const leaderRef = window.firebaseRef(window.firebaseDb, 'leaderboard/' + Date.now());
  
  window.firebaseSet(leaderRef, { name: name, score: gameScore }).then(() => {
    alert(`Tes Selesai! Skor Akhir Anda: ${gameScore}`);
    document.getElementById('quiz-area').classList.add('hidden');
    document.getElementById('game-box').classList.remove('hidden');
  });
}
