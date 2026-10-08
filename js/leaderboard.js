let leaderboardData = [];

function initLeaderboardFirebase() {
  if (window.firebaseDb && window.firebaseRef && window.firebaseOnValue) {
    const dbRef = window.firebaseRef(window.firebaseDb, 'leaderboard');
    
    // Mendengarkan skor leaderboard langsung dari server cloud secara real-time
    window.firebaseOnValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        leaderboardData = Object.keys(data).map(key => ({ id: key, ...data[key] }));
      } else {
        leaderboardData = [];
      }
      renderLeaderboard();
    }, (error) => {
      console.error("Gagal terhubung ke leaderboard Firebase:", error);
    });
  } else {
    setTimeout(initLeaderboardFirebase, 300);
  }
}

window.addEventListener('firebase-ready', initLeaderboardFirebase);

document.addEventListener('DOMContentLoaded', () => {
  renderLeaderboard();
  initLeaderboardFirebase();
});

function renderLeaderboard() {
  const tbody = document.getElementById('leaderboard-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (leaderboardData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="px-4 py-4 text-center text-slate-500 text-xs">Belum ada skor tercatat di server database.</td></tr>`;
    return;
  }

  // Urutkan skor tertinggi ke terendah
  leaderboardData.sort((a, b) => b.score - a.score);

  leaderboardData.forEach((item, idx) => {
    let rankBadge = `#${idx + 1}`;
    if (idx === 0) rankBadge = '🥇 #1';
    else if (idx === 1) rankBadge = '🥈 #2';
    else if (idx === 2) rankBadge = '🥉 #3';

    tbody.innerHTML += `
      <tr class="hover:bg-slate-800/50 transition">
        <td class="px-4 py-3 font-bold text-amber-400">${rankBadge}</td>
        <td class="px-4 py-3 font-semibold text-white">${item.name}</td>
        <td class="px-4 py-3 font-bold text-indigo-400">${item.score} Pts</td>
      </tr>
    `;
  });
}

// Global Exports
window.renderLeaderboard = renderLeaderboard;
