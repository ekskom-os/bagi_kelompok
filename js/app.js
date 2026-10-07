function switchTab(tabName) {
  const tabs = ['projects', 'game', 'leaderboard'];
  tabs.forEach(tab => {
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

function exportJSON() {
  if (typeof membersData === 'undefined' || !membersData.length) {
    alert('Tidak ada data anggota untuk diekspor!');
    return;
  }
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(membersData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `rekap_ekskul_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);
      if (Array.isArray(importedData)) {
        importedData.forEach(item => {
          const newRef = window.firebaseRef(window.firebaseDb, 'members/' + (item.id || Date.now()));
          window.firebaseSet(newRef, {
            name: item.name,
            project: item.project,
            date: item.date || new Date().toLocaleDateString('id-ID')
          });
        });
        alert('Data berhasil diimpor!');
      } else {
        alert('Format file JSON tidak valid!');
      }
    } catch (err) {
      alert('Gagal membaca file JSON!');
    }
  };
  reader.readAsText(file);
}

// Daftarkan ke window scope
window.switchTab = switchTab;
window.exportJSON = exportJSON;
window.importJSON = importJSON;
