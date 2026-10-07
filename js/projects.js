// Logika Pendaftaran, Kalkulasi Kuota, & Rendering Tabel
let membersData = [];
const projectsList = ["Web Development", "Game Dev", "UI/UX Design", "Cyber Security"];
const MAX_QUOTA = 5;

window.addEventListener('firebase-ready', () => {
  const dbRef = window.firebaseRef(window.firebaseDb, 'members');
  window.firebaseOnValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    membersData = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
    renderProjectsGrid();
    renderMembersTable();
  });
});

function renderProjectsGrid() {
  const container = document.getElementById('projects-grid');
  if (!container) return;
  container.innerHTML = '';

  projectsList.forEach(proj => {
    const count = membersData.filter(m => m.project === proj).length;
    const remaining = MAX_QUOTA - count;
    container.innerHTML += `
      <div class="bg-slate-800 border border-slate-700 p-4 rounded-xl space-y-2">
        <h4 class="font-bold text-slate-200 text-sm">${proj}</h4>
        <div class="flex justify-between text-xs text-slate-400">
          <span>Terisi: ${count}/${MAX_QUOTA}</span>
          <span class="${remaining > 0 ? 'text-emerald-400' : 'text-rose-400'}">${remaining > 0 ? 'Sisa ' + remaining : 'Penuh'}</span>
        </div>
        <div class="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
          <div class="bg-indigo-500 h-2 rounded-full" style="width: ${(count/MAX_QUOTA)*100}%"></div>
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
    tbody.innerHTML = `<tr><td colspan="5" class="px-4 py-4 text-center text-slate-500 text-xs">Belum ada anggota terdaftar.</td></tr>`;
    return;
  }

  membersData.forEach((m, idx) => {
    tbody.innerHTML += `
      <tr class="hover:bg-slate-800/40">
        <td class="px-4 py-2.5">${idx + 1}</td>
        <td class="px-4 py-2.5 font-medium text-white">${m.name}</td>
        <td class="px-4 py-2.5"><span class="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded border border-indigo-500/30">${m.project}</span></td>
        <td class="px-4 py-2.5 text-xs text-slate-400">${m.date || '-'}</td>
        <td class="px-4 py-2.5 admin-only text-center">
          <button onclick="deleteMember('${m.id}')" class="text-rose-400 hover:text-rose-300 text-xs"><i class="fa-solid fa-trash"></i> Hapus</button>
        </td>
      </tr>
    `;
  });
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('member-name').value.trim();
  const project = document.getElementById('project-select').value;
  
  if (!name || !project) return;

  const currentCount = membersData.filter(m => m.project === project).length;
  if (currentCount >= MAX_QUOTA) {
    alert('Kuota proyek ini sudah penuh!');
    return;
  }

  const newRef = window.firebaseRef(window.firebaseDb, 'members/' + Date.now());
  window.firebaseSet(newRef, {
    name: name,
    project: project,
    date: new Date().toLocaleDateString('id-ID')
  }).then(() => {
    document.getElementById('project-form').reset();
  });
}

function deleteMember(id) {
  if (confirm('Hapus anggota ini?')) {
    const itemRef = window.firebaseRef(window.firebaseDb, 'members/' + id);
    window.firebaseRemove(itemRef);
  }
}
