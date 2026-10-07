const ADMIN_PIN = "1234";
let currentRole = localStorage.getItem('user_role') || 'guest';

function openAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.add('hidden');
}

function togglePinInput() {
  const roleSelect = document.getElementById('role-select');
  const pinContainer = document.getElementById('pin-container');
  if (roleSelect && pinContainer) {
    if (roleSelect.value === 'admin') pinContainer.classList.remove('hidden');
    else pinContainer.classList.add('hidden');
  }
}

function applyRoleSelection() {
  const roleSelect = document.getElementById('role-select');
  if (!roleSelect) return;

  const selectedRole = roleSelect.value;
  if (selectedRole === 'admin') {
    const pinInput = document.getElementById('admin-pin-input');
    const pin = pinInput ? pinInput.value : '';
    if (pin !== ADMIN_PIN) {
      alert('PIN Admin Salah!');
      return;
    }
  }

  currentRole = selectedRole;
  localStorage.setItem('user_role', currentRole);
  updateRoleUI();
  closeAuthModal();
}

function updateRoleUI() {
  document.body.className = document.body.className.replace(/role-\w+/g, '');
  document.body.classList.add(`role-${currentRole}`);

  const badge = document.getElementById('role-badge');
  const banner = document.getElementById('access-banner');
  const authBtn = document.getElementById('auth-btn');

  if (badge) {
    if (currentRole === 'admin') {
      badge.innerText = 'Role: Admin';
      badge.className = 'px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30';
    } else if (currentRole === 'member') {
      badge.innerText = 'Role: Member';
      badge.className = 'px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30';
    } else {
      badge.innerText = 'Role: Guest';
      badge.className = 'px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-700 text-slate-300';
    }
  }

  if (banner) {
    if (currentRole === 'admin') {
      banner.innerHTML = '<i class="fa-solid fa-user-shield text-rose-400 mr-2"></i> <b>Akses Admin Aktif:</b> Kontrol penuh atas data dan sistem.';
    } else if (currentRole === 'member') {
      banner.innerHTML = '<i class="fa-solid fa-user text-indigo-400 mr-2"></i> <b>Akses Member:</b> Anda dapat mendaftar proyek dan mengikuti tes logika.';
    } else {
      banner.innerHTML = '<i class="fa-solid fa-eye text-slate-400 mr-2"></i> <b>Akses Guest:</b> Hanya dapat melihat status kuota dan peringkat.';
    }
  }

  if (authBtn) {
    if (currentRole === 'admin') {
      authBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Keluar Admin';
      authBtn.onclick = logoutAdmin;
    } else {
      authBtn.innerHTML = '<i class="fa-solid fa-key"></i> Login Admin';
      authBtn.onclick = openAuthModal;
    }
  }

  if (typeof renderMembersTable === 'function') renderMembersTable();
}

function logoutAdmin() {
  currentRole = 'guest';
  localStorage.setItem('user_role', 'guest');
  updateRoleUI();
}

// Global Exports
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.togglePinInput = togglePinInput;
window.applyRoleSelection = applyRoleSelection;
window.logoutAdmin = logoutAdmin;

document.addEventListener('DOMContentLoaded', updateRoleUI);
