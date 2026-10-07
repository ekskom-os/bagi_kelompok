window.addEventListener('firebase-ready', () => {
  if (!window.firebaseDb || !window.firebaseRef) return;
  const dbRef = window.firebaseRef(window.firebaseDb, 'leaderboard');
  window.firebaseOnValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    const list = data ? Object.keys(data).map(key => data[key]) : [];
    list.sort((a, b) => b.score - a.score);
    renderLeaderboard(list);
  });
});

function renderLeaderboard(data) {
  const tbody = document.getElementById('leaderboard-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3" class="px-4 py-4 text-center text-slate-500 text-xs">Belum ada skor tercatat.</td></tr>`;
    return;
  }

  data.forEach((item, idx) => {
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
