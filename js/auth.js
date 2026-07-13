/* ==========================================
   STACKLY TOURS — auth.js
   localStorage-based auth system
   ========================================== */

const AUTH_KEY = 'stackly_tours_user';

function authLogin(name, email, role, password) {
  const user = { name, email, role, password, loggedIn: true, ts: Date.now() };
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

function authSignup(name, email, role, password) {
  const user = { name, email, role, password, loggedIn: false, ts: Date.now() };
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

function authGetUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user && user.loggedIn ? user : null;
  } catch { return null; }
}

function authIsLoggedIn() { return !!authGetUser(); }

function authLogout() {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = 'index.html';
}

function authSyncNavbar() {
  const user = authGetUser();

  const loginWrap = document.querySelector('.nav-login-btn-wrap');
  if (loginWrap) {
    if (user) {
      const initial = (user.name || 'U')[0].toUpperCase();
      const firstName = user.name ? user.name.split(' ')[0] : 'User';
      loginWrap.innerHTML = `
        <div class="nav-user-chip" id="nav-user-chip" role="button" aria-label="User menu" aria-expanded="false" tabindex="0">
          <div class="nav-user-avatar">${initial}</div>
          <span class="nav-user-name">${firstName}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          <div class="nav-user-dropdown" id="nav-user-dropdown" role="menu">
            <a href="dashboard.html" role="menuitem"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Dashboard</a>
            <a href="bookings.html" role="menuitem"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> My Bookings</a>
            <button onclick="authLogout()" class="nav-logout-btn" role="menuitem"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Logout</button>
          </div>
        </div>`;

      const chip = document.getElementById('nav-user-chip');
      const dropdown = document.getElementById('nav-user-dropdown');
      if (chip && dropdown) {
        chip.addEventListener('click', (e) => { e.stopPropagation(); const isOpen = dropdown.classList.toggle('open'); chip.setAttribute('aria-expanded', isOpen); });
        chip.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chip.click(); } });
        document.addEventListener('click', () => { dropdown.classList.remove('open'); chip.setAttribute('aria-expanded', 'false'); });
      }
    } else {
      loginWrap.innerHTML = `<a href="login.html" class="nav-login-btn" id="nav-login-link">Login</a><a href="contact.html" class="nav-cta-btn">Book a Trip</a>`;
    }
  }

  const mobileLoginWrap = document.querySelector('.mobile-login-wrap');
  if (mobileLoginWrap) {
    if (user) {
      const initial = (user.name || 'U')[0].toUpperCase();
      mobileLoginWrap.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.75rem;padding:0.85rem 1rem;background:var(--bg-light-alt);border-radius:18px;border:1px solid var(--border-light);">
          <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--accent));display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;font-size:1rem;flex-shrink:0;">${initial}</div>
          <div style="flex:1;min-width:0;overflow:hidden;">
            <div style="font-weight:700;font-size:0.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${user.name}</div>
            <div style="font-size:0.75rem;color:var(--text-dark-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${user.email}</div>
          </div>
          <button onclick="authLogout()" style="flex-shrink:0;font-size:0.78rem;color:var(--danger);background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.12);border-radius:12px;padding:0.35rem 0.65rem;cursor:pointer;font-weight:600;">Logout</button>
        </div>`;
    } else {
      mobileLoginWrap.innerHTML = `<a href="login.html" style="display:flex;align-items:center;justify-content:center;padding:0.8rem;border-radius:999px;background:var(--primary);color:#fff;font-weight:700;font-size:0.9rem;">Login to Your Account</a>`;
    }
  }
}

function authApplyRBAC() {
  const user = authGetUser();
  if (!user) return;
  const isAgent = user.role === 'Travel Agent';
  document.querySelectorAll('[data-role="traveler-only"]').forEach(el => { el.style.display = isAgent ? 'none' : ''; });
  document.querySelectorAll('[data-role="agent-only"]').forEach(el => { el.style.display = !isAgent ? 'none' : ''; });
}

document.addEventListener('DOMContentLoaded', () => {
  authSyncNavbar();
  authApplyRBAC();
});
