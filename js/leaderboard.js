// Listener Realtime Database Firebase & Rendering Podium Top 3
window.addEventListener('firebase-ready', () => {
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
    tbody.innerHTML += `
      <tr class="hover:bg-slate-800/40">
        <td class="px-4 py-2.5 font-bold text-amber-400">#${idx + 1}</td>
        <td class="px-4 py-2.5 font-medium text-white">${item.name}</td>
        <td class="px-4 py-2.5 font-bold text-indigo-400">${item.score} Pts</td>
      </tr>
    `;
  });
}
