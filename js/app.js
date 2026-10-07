function switchTab(tabName) {
  ['projects', 'game', 'leaderboard'].forEach(tab => {
    const sec = document.getElementById(`section-${tab}`);
    const btn = document.getElementById(`tab-btn-${tab}`);
    if (sec && btn) {
      if (tab === tabName) {
        sec.classList.remove('hidden');
        btn.className = 'px-4 py-1.5 rounded-lg text-sm font-medium transition bg-indigo-600 text-white shadow';
      } else {
        sec.classList.add('hidden');
        btn.className = 'px-4 py-1.5 rounded-lg text-sm font-medium transition text-slate-400 hover:text-slate-200';
      }
    }
  });
}
