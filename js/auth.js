/**
 * StaffConnect - Authentication & Session Management
 * Handles login, demo presets, password visibility, and user session changes.
 */

const Auth = {
  init() {
    this.bindEvents();
    this.checkSession();
  },

  checkSession() {
    const user = window.store.getCurrentUser();
    const loginModal = document.getElementById('login-modal');
    const appShell = document.getElementById('app-shell');

    if (!user) {
      if (loginModal) loginModal.classList.add('active');
      if (appShell) appShell.classList.add('blurred');
    } else {
      if (loginModal) loginModal.classList.remove('active');
      if (appShell) appShell.classList.remove('blurred');
      this.updateUserUI(user);
    }
  },

  bindEvents() {
    // Demo user quick select buttons
    document.querySelectorAll('.demo-user-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const userId = btn.getAttribute('data-user-id');
        this.loginWithDemoUser(userId);
      });
    });

    // Manual login form submission
    const loginForm = document.getElementById('manual-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('login-remember')?.checked;

        this.handleManualLogin(email, password, rememberMe);
      });
    }

    // Password toggle
    const togglePassBtn = document.getElementById('toggle-password-btn');
    if (togglePassBtn) {
      togglePassBtn.addEventListener('click', () => {
        const passInput = document.getElementById('login-password');
        if (passInput) {
          const isPass = passInput.type === 'password';
          passInput.type = isPass ? 'text' : 'password';
          togglePassBtn.innerHTML = isPass 
            ? `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
            : `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
        }
      });
    }

    // Logout buttons
    document.querySelectorAll('[data-action="logout"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    });

    // Profile update reactive subscription
    window.store.subscribe('user:profile-updated', (user) => {
      this.updateUserUI(user);
    });

    window.store.subscribe('user:changed', (user) => {
      this.checkSession();
    });
  },

  loginWithDemoUser(userId) {
    const user = DEMO_USERS.find(u => u.id === userId);
    if (!user) return;

    // Simulate pleasant login transition
    this.showLoginFeedback('Authenticating as ' + user.name + '...', 'success');
    
    setTimeout(() => {
      window.store.saveUser(user);
      this.closeLoginModal();
      window.App.showToast(`Welcome back, ${user.name}!`, 'success');
      window.App.navigateTo('dashboard');
    }, 450);
  },

  handleManualLogin(email, password, rememberMe) {
    const errorEl = document.getElementById('login-error-msg');
    if (errorEl) errorEl.textContent = '';

    // Check against demo users
    const matched = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!matched) {
      this.showLoginFeedback('Account not found with this email. Try selecting a demo profile below or use "eleanor.vance@crestview.edu".', 'error');
      return;
    }

    if (password !== 'password123' && password !== matched.password) {
      this.showLoginFeedback('Incorrect password. (Hint: Demo password is "password123")', 'error');
      return;
    }

    this.showLoginFeedback('Credentials verified. Loading faculty dashboard...', 'success');
    setTimeout(() => {
      window.store.saveUser(matched);
      this.closeLoginModal();
      window.App.showToast(`Welcome back, ${matched.name}!`, 'success');
      window.App.navigateTo('dashboard');
    }, 400);
  },

  showLoginFeedback(message, type) {
    const errorEl = document.getElementById('login-error-msg');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.className = 'login-feedback ' + (type === 'error' ? 'text-danger' : 'text-success');
    }
  },

  logout() {
    window.store.saveUser(null);
    const loginModal = document.getElementById('login-modal');
    const appShell = document.getElementById('app-shell');
    if (loginModal) loginModal.classList.add('active');
    if (appShell) appShell.classList.add('blurred');
    window.App.showToast('You have been logged out securely.', 'info');
  },

  closeLoginModal() {
    const loginModal = document.getElementById('login-modal');
    const appShell = document.getElementById('app-shell');
    if (loginModal) loginModal.classList.remove('active');
    if (appShell) appShell.classList.remove('blurred');
  },

  updateUserUI(user) {
    if (!user) return;

    // Sidebar user details
    const sidebarAvatar = document.getElementById('sidebar-user-avatar');
    const sidebarName = document.getElementById('sidebar-user-name');
    const sidebarRole = document.getElementById('sidebar-user-role');

    if (sidebarAvatar) {
      sidebarAvatar.style.background = user.avatarBg || 'var(--color-primary)';
      sidebarAvatar.textContent = user.avatarText || user.name.slice(0, 2).toUpperCase();
    }
    if (sidebarName) sidebarName.textContent = user.name;
    if (sidebarRole) sidebarRole.textContent = user.role || user.department;

    // Topbar user details
    const topbarAvatar = document.getElementById('topbar-user-avatar');
    const topbarName = document.getElementById('topbar-user-name');
    if (topbarAvatar) {
      topbarAvatar.style.background = user.avatarBg || 'var(--color-primary)';
      topbarAvatar.textContent = user.avatarText || user.name.slice(0, 2).toUpperCase();
    }
    if (topbarName) topbarName.textContent = user.name.split(' ')[0] || user.name;

    // Update greeting banner in dashboard if present
    const greetingEl = document.getElementById('dashboard-user-greeting');
    if (greetingEl) {
      greetingEl.textContent = user.name;
    }
  }
};

window.Auth = Auth;
