let membersData = [];

// Pengaturan Kuota 4 Proyek (Total: 18 + 18 + 17 + 17 = 70 Anggota)
const projectQuotas = {
  "Web Deve & Game Dev": 23,
  "UI/UX Design": 23,
  "Arduiuno": 24,
};

// Inisialisasi Listener Real-time ke Server Cloud Firebase
function initProjectsFirebase() {
  if (window.firebaseDb && window.firebaseRef && window.firebaseOnValue) {
    const dbRef = window.firebaseRef(window.firebaseDb, 'members');
    
    window.firebaseOnValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        membersData = Object.keys(data).map(key => ({ id: key, ...data[key] }));
      } else {
        membersData = [];
      }
      renderProjectsGrid();
      renderMembersTable();
    }, (error) => {
      console.error("Gagal terhubung ke server Firebase:", error);
    });
  } else {
    setTimeout(initProjectsFirebase, 300);
  }
}

window.addEventListener('firebase-ready', initProjectsFirebase);

document.addEventListener('DOMContentLoaded', () => {
  renderProjectsGrid();
  renderMembersTable();
  initProjectsFirebase();
});

function renderProjectsGrid() {
  const container = document.getElementById('projects-grid');
  if (!container) return;
  container.innerHTML = '';

  Object.keys(projectQuotas).forEach(proj => {
    const maxQuota = projectQuotas[proj];
    const count = membersData.filter(m => m.project === proj).length;
    const remaining = maxQuota - count;
    const percentage = Math.min((count / maxQuota) * 100, 100);

    container.innerHTML += `
      <div class="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl space-y-2.5 shadow-lg">
        <h4 class="font-bold text-slate-200 text-sm">${proj}</h4>
        <div class="flex justify-between text-xs text-slate-400">
          <span>Terisi: ${count}/${maxQuota}</span>
          <span class="${remaining > 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}">${remaining > 0 ? 'Sisa ' + remaining : 'Penuh'}</span>
        </div>
        <div class="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700/50">
          <div class="bg-indigo-500 h-2 rounded-full transition-all duration-300" style="width: ${percentage}%"></div>
        </div>
      </div>
    `;
  });
}

function renderMembersTable() {
  const tbody = document.getElementById('members-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (membersData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-4 py-4 text-center text-slate-500 text-xs">Belum ada anggota terdaftar di server database.</td></tr>`;
    return;
  }

  membersData.forEach((m, idx) => {
    tbody.innerHTML += `
      <tr class="hover:bg-slate-800/50 transition">
        <td class="px-4 py-3">${idx + 1}</td>
        <td class="px-4 py-3 font-semibold text-white">${m.name}</td>
        <td class="px-4 py-3"><span class="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-1 rounded-lg border border-indigo-500/30">${m.project}</span></td>
        <td class="px-4 py-3 text-xs text-slate-400">${m.date || '-'}</td>
        <td class="px-4 py-3 admin-only text-center">
          <button onclick="deleteMember('${m.id}')" class="text-rose-400 hover:text-rose-300 text-xs transition"><i class="fa-solid fa-trash"></i> Hapus</button>
        </td>
      </tr>
    `;
  });
}

function handleRegister(e) {
  if (e) e.preventDefault();

  const nameInput = document.getElementById('member-name');
  const projectSelect = document.getElementById('project-select');
  
  if (!nameInput || !projectSelect) return;
  
  const name = nameInput.value.trim();
  const project = projectSelect.value;
  
  if (!name || !project) {
    alert('Mohon isi nama lengkap dan pilih proyek terlebih dahulu!');
    return;
  }

  const maxQuota = projectQuotas[project] || 18;
  const currentCount = membersData.filter(m => m.project === project).length;
  
  if (currentCount >= maxQuota) {
    alert(`Kuota untuk proyek "${project}" sudah penuh! (Maksimal ${maxQuota} anggota)`);
    return;
  }

  if (!window.firebaseDb || !window.firebaseRef || !window.firebaseSet) {
    alert('Koneksi ke server database belum siap. Silakan coba beberapa detik lagi!');
    return;
  }

  const memberId = 'mem_' + Date.now();
  const newMember = {
    name: name,
    project: project,
    date: new Date().toLocaleDateString('id-ID')
  };

  const newRef = window.firebaseRef(window.firebaseDb, 'members/' + memberId);
  window.firebaseSet(newRef, newMember)
    .then(() => {
      const form = document.getElementById('project-form');
      if (form) form.reset();
    })
    .catch(err => {
      alert('Gagal menyimpan ke server: ' + err.message);
    });
}

function deleteMember(id) {
  if (!confirm('Hapus anggota ini dari server?')) return;

  if (window.firebaseDb && window.firebaseRef && window.firebaseRemove) {
    const itemRef = window.firebaseRef(window.firebaseDb, 'members/' + id);
    window.firebaseRemove(itemRef).catch(err => alert('Gagal hapus dari server: ' + err.message));
  }
}

// Global Exports
window.handleRegister = handleRegister;
window.deleteMember = deleteMember;
window.renderMembersTable = renderMembersTable;
window.renderProjectsGrid = renderProjectsGrid;
