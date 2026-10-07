const ADMIN_PIN = "1234"; 
let currentRole = localStorage.getItem('user_role') || 'guest';

function initAuth() {
  updateRoleUI();
}

function openAuthModal() {
  document.getElementById('auth-modal').classList.remove('hidden');
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.add('hidden');
}

function togglePinInput() {
  const role = document.getElementById('role-select').value;
  const pinContainer = document.getElementById('pin-container');
  if (role === 'admin') {
    pinContainer.classList.remove('hidden');
  } else {
    pinContainer.classList.add('hidden');
  }
}

function applyRoleSelection() {
  const selectedRole = document.getElementById('role-select').value;
  
  if (selectedRole === 'admin') {
    const pin = document.getElementById('admin-pin-input').value;
    if (pin !== ADMIN_PIN) {
      alert('PIN Admin salah!');
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
  const authBtn = document.getElementById('auth-btn');

  if (currentRole === 'admin') {
    badge.innerText = 'Role: Admin';
    badge.className = 'px-2.5 py-1 rounded-md text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30';
    authBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Keluar Admin';
    authBtn.onclick = logoutAdmin;
  } else if (currentRole === 'member') {
    badge.innerText = 'Role: Member';
    badge.className = 'px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30';
    authBtn.innerHTML = '<i class="fa-solid fa-key"></i> Switch Role';
    authBtn.onclick = openAuthModal;
  } else {
    badge.innerText = 'Role: Guest';
    badge.className = 'px-2.5 py-1 rounded-md text-xs font-bold bg-slate-700 text-slate-300';
    authBtn.innerHTML = '<i class="fa-solid fa-key"></i> Login Admin';
    authBtn.onclick = openAuthModal;
  }
}

function logoutAdmin() {
  currentRole = 'guest';
  localStorage.setItem('user_role', 'guest');
  updateRoleUI();
}

window.addEventListener('DOMContentLoaded', initAuth);
