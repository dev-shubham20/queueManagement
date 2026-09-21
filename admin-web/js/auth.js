// CareQueue Super Admin Auth Guard & Session Manager
(function() {
  const token = localStorage.getItem('superadmin_token');
  const rawUser = localStorage.getItem('superadmin_user');

  // If on login.html, do not redirect
  if (window.location.pathname.endsWith('/login.html') || window.location.pathname.endsWith('/login')) {
    return;
  }

  if (!token || !rawUser) {
    window.location.href = 'login.html';
    return;
  }

  let currentUser = null;
  try {
    currentUser = JSON.parse(rawUser);
  } catch (e) {
    localStorage.removeItem('superadmin_token');
    localStorage.removeItem('superadmin_user');
    window.location.href = 'login.html';
    return;
  }

  if (currentUser.role !== 'SUPER_ADMIN' && currentUser.role !== 'super_admin') {
    localStorage.removeItem('superadmin_token');
    localStorage.removeItem('superadmin_user');
    window.location.href = 'login.html';
    return;
  }

  // Session is valid. Update UI on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Update Profile Display
    const nameEls = document.querySelectorAll('.owner-name');
    nameEls.forEach(el => {
      el.textContent = currentUser.name || 'Shubham Agrawal';
    });

    const roleEls = document.querySelectorAll('.owner-role');
    roleEls.forEach(el => {
      el.textContent = currentUser.email || 'SUPER ADMIN';
      el.title = currentUser.email || '';
    });

    // 2. Add Logout Button to Topbar
    const topbarRight = document.querySelector('.topbar-right');
    if (topbarRight && !document.getElementById('btn-admin-logout')) {
      const logoutBtn = document.createElement('button');
      logoutBtn.id = 'btn-admin-logout';
      logoutBtn.className = 'btn btn-outline btn-sm';
      logoutBtn.style.marginLeft = '12px';
      logoutBtn.style.display = 'inline-flex';
      logoutBtn.style.alignItems = 'center';
      logoutBtn.style.gap = '6px';
      logoutBtn.style.color = '#EF4444';
      logoutBtn.style.borderColor = '#FECACA';
      logoutBtn.style.backgroundColor = '#FFFFFF';
      logoutBtn.style.fontWeight = '700';
      logoutBtn.innerHTML = '<span>⎋</span><span>Logout</span>';
      logoutBtn.title = 'Sign out of Super Admin';
      logoutBtn.onclick = () => {
        if (confirm('Are you sure you want to sign out of the Super Admin console?')) {
          localStorage.removeItem('superadmin_token');
          localStorage.removeItem('superadmin_user');
          window.location.href = 'login.html';
        }
      };
      topbarRight.appendChild(logoutBtn);
    }
  });

  window.adminLogout = () => {
    localStorage.removeItem('superadmin_token');
    localStorage.removeItem('superadmin_user');
    window.location.href = 'login.html';
  };
})();
