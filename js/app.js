/**
 * StaffConnect - Main Application Coordinator
 * Router, modals, toasts, global search, and UI state orchestration.
 */

const App = {
  currentView: 'dashboard',

  init() {
    // Initialize Auth
    window.Auth.init();

    // Setup router
    window.addEventListener('hashchange', () => this.handleRouting());
    this.handleRouting();

    // Bind UI actions
    this.bindGlobalEvents();

    // Update notifications badge
    this.updateNotificationBadge();

    // Listen for store notifications update
    window.store.subscribe('notifications:updated', () => {
      this.updateNotificationBadge();
    });
  },

  handleRouting() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    const validViews = ['dashboard', 'announcements', 'meetings', 'polls', 'notifications', 'profile'];
    const target = validViews.includes(hash) ? hash : 'dashboard';
    this.navigateTo(target, false);
  },

  navigateTo(viewName, updateHash = true) {
    this.currentView = viewName;
    if (updateHash) {
      window.location.hash = '#' + viewName;
    }

    // Update sidebar active link
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkView = link.getAttribute('data-view');
      link.classList.toggle('active', linkView === viewName);
    });

    // Close mobile drawer if open
    this.closeMobileSidebar();

    // Render corresponding view
    const container = document.getElementById('app-content');
    if (!container) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (viewName) {
      case 'dashboard':
        window.DashboardView.render(container);
        break;
      case 'announcements':
        window.AnnouncementsView.render(container);
        break;
      case 'meetings':
        window.MeetingsView.render(container);
        break;
      case 'polls':
        window.PollsView.render(container);
        break;
      case 'notifications':
        window.NotificationsView.render(container);
        break;
      case 'profile':
        window.ProfileView.render(container);
        break;
      default:
        window.DashboardView.render(container);
    }
  },

  bindGlobalEvents() {
    // Navigation clicks
    document.querySelectorAll('.nav-link[data-view]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.getAttribute('data-view');
        this.navigateTo(view);
      });
    });

    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const newTheme = window.store.toggleTheme();
        this.updateThemeIcon(newTheme);
        this.showToast(`Switched to ${newTheme} theme`, 'info');
      });
      this.updateThemeIcon(window.store.getTheme());
    }

    // Mobile Sidebar Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (menuBtn && sidebar) {
      menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active');
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        this.closeMobileSidebar();
      });
    }

    // Global Search
    const searchInput = document.getElementById('global-search-input');
    const searchResultsBox = document.getElementById('global-search-results');
    if (searchInput && searchResultsBox) {
      searchInput.addEventListener('input', (e) => {
        this.handleGlobalSearch(e.target.value.trim());
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResultsBox.contains(e.target)) {
          searchResultsBox.classList.remove('active');
        }
      });

      searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length > 1) {
          searchResultsBox.classList.add('active');
        }
      });
    }

    // Notification dropdown toggle
    const notifBellBtn = document.getElementById('topbar-notif-btn');
    const notifDropdown = document.getElementById('notif-dropdown');
    if (notifBellBtn && notifDropdown) {
      notifBellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleNotificationDropdown();
      });

      document.addEventListener('click', (e) => {
        if (!notifDropdown.contains(e.target) && !notifBellBtn.contains(e.target)) {
          notifDropdown.classList.remove('active');
        }
      });
    }

    // Modal background close
    const modalBackdrop = document.getElementById('generic-modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          this.closeModal();
        }
      });
    }
  },

  updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    if (theme === 'light') {
      btn.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      btn.setAttribute('title', 'Switch to dark theme');
    } else {
      btn.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      btn.setAttribute('title', 'Switch to light theme');
    }
  },

  closeMobileSidebar() {
    const sidebar = document.getElementById('app-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
  },

  updateNotificationBadge() {
    const count = window.store.getUnreadNotificationsCount();
    const bellBadge = document.getElementById('topbar-notif-badge');
    const navBadge = document.getElementById('nav-notif-badge');

    if (bellBadge) {
      if (count > 0) {
        bellBadge.textContent = count > 9 ? '9+' : count;
        bellBadge.classList.add('visible');
      } else {
        bellBadge.classList.remove('visible');
      }
    }

    if (navBadge) {
      if (count > 0) {
        navBadge.textContent = count;
        navBadge.classList.add('visible');
      } else {
        navBadge.classList.remove('visible');
      }
    }
  },

  toggleNotificationDropdown() {
    const dropdown = document.getElementById('notif-dropdown');
    if (!dropdown) return;
    const isActive = dropdown.classList.contains('active');

    if (!isActive) {
      this.populateNotificationDropdown();
      dropdown.classList.add('active');
    } else {
      dropdown.classList.remove('active');
    }
  },

  populateNotificationDropdown() {
    const dropdownList = document.getElementById('notif-dropdown-list');
    if (!dropdownList) return;

    const notifs = window.store.getNotifications().slice(0, 5);

    if (notifs.length === 0) {
      dropdownList.innerHTML = `<div class="p-3 text-center text-muted">No notifications</div>`;
      return;
    }

    dropdownList.innerHTML = notifs.map(n => `
      <div class="dropdown-notif-item ${!n.read ? 'unread' : ''}" 
           onclick="NotificationsView.handleNotificationClick('${n.id}', '${n.type}', '${n.targetId}'); App.toggleNotificationDropdown();">
        <div class="d-flex align-items-center justify-content-between mb-1">
          <span class="dropdown-notif-title">${n.title}</span>
          <span class="text-xs text-muted">${n.timestamp}</span>
        </div>
        <p class="dropdown-notif-msg mb-0">${n.message}</p>
      </div>
    `).join('');
  },

  handleGlobalSearch(query) {
    const box = document.getElementById('global-search-results');
    if (!box) return;

    if (!query || query.length < 2) {
      box.classList.remove('active');
      box.innerHTML = '';
      return;
    }

    const q = query.toLowerCase();
    const announcements = window.store.getAnnouncements().filter(a => 
      a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)
    );
    const meetings = window.store.getMeetings().filter(m => 
      m.title.toLowerCase().includes(q) || m.department.toLowerCase().includes(q)
    );
    const polls = window.store.getPolls().filter(p => 
      p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );

    const total = announcements.length + meetings.length + polls.length;

    if (total === 0) {
      box.innerHTML = `<div class="p-3 text-center text-muted">No matching results for "${query}"</div>`;
    } else {
      let html = '';

      if (announcements.length > 0) {
        html += `<div class="search-category-header">Announcements (${announcements.length})</div>`;
        html += announcements.slice(0, 3).map(a => `
          <div class="search-result-item" onclick="App.viewAnnouncementDetails('${a.id}'); document.getElementById('global-search-results').classList.remove('active');">
            <span class="badge badge-slate mr-2">${a.category}</span>
            <span class="result-title">${a.title}</span>
          </div>
        `).join('');
      }

      if (meetings.length > 0) {
        html += `<div class="search-category-header">Meetings (${meetings.length})</div>`;
        html += meetings.slice(0, 3).map(m => `
          <div class="search-result-item" onclick="App.navigateTo('meetings'); document.getElementById('global-search-results').classList.remove('active');">
            <span class="badge badge-indigo mr-2">${m.date}</span>
            <span class="result-title">${m.title}</span>
          </div>
        `).join('');
      }

      if (polls.length > 0) {
        html += `<div class="search-category-header">Polls & Voting (${polls.length})</div>`;
        html += polls.slice(0, 2).map(p => `
          <div class="search-result-item" onclick="App.navigateTo('polls'); document.getElementById('global-search-results').classList.remove('active');">
            <span class="badge badge-violet mr-2">Poll</span>
            <span class="result-title">${p.title}</span>
          </div>
        `).join('');
      }

      box.innerHTML = html;
    }

    box.classList.add('active');
  },

  // Modals Engine
  showModal({ title, content, maxWidth = '560px' }) {
    const backdrop = document.getElementById('generic-modal-backdrop');
    const container = document.getElementById('generic-modal-container');
    const titleEl = document.getElementById('generic-modal-title');
    const bodyEl = document.getElementById('generic-modal-body');

    if (!backdrop || !container) return;

    if (titleEl) titleEl.textContent = title;
    if (bodyEl) bodyEl.innerHTML = content;

    container.style.maxWidth = maxWidth;
    backdrop.classList.add('active');
  },

  closeModal() {
    const backdrop = document.getElementById('generic-modal-backdrop');
    if (backdrop) backdrop.classList.remove('active');
  },

  // Modal: New Announcement
  openAnnouncementModal() {
    const user = window.store.getCurrentUser();
    this.showModal({
      title: 'Publish College Announcement',
      content: `
        <form id="create-announcement-form" onsubmit="event.preventDefault(); App.handleCreateAnnouncementSubmit();">
          <div class="form-group mb-3">
            <label class="form-label" for="new-ann-title">Announcement Title</label>
            <input type="text" id="new-ann-title" class="form-control" placeholder="e.g. Faculty Senate Agenda Dispatch" required>
          </div>
          <div class="form-row-2 mb-3">
            <div class="form-group">
              <label class="form-label" for="new-ann-category">Department / Category</label>
              <select id="new-ann-category" class="form-control" required>
                <option value="Academic Affairs">Academic Affairs</option>
                <option value="IT & Facilities">IT & Facilities</option>
                <option value="Research & Grants">Research & Grants</option>
                <option value="Human Resources">Human Resources</option>
                <option value="General Campus">General Campus</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="new-ann-priority">Urgency Level</label>
              <select id="new-ann-priority" class="form-control">
                <option value="normal">Standard Bulletin</option>
                <option value="urgent">Urgent / Priority Alert</option>
              </select>
            </div>
          </div>
          <div class="form-group mb-3">
            <label class="form-label" for="new-ann-tags">Tag Keywords (comma separated)</label>
            <input type="text" id="new-ann-tags" class="form-control" placeholder="e.g. Grades, Deadline, Faculty">
          </div>
          <div class="form-group mb-3">
            <label class="form-label" for="new-ann-content">Notice Content</label>
            <textarea id="new-ann-content" class="form-control" rows="5" placeholder="Write bulletin content..." required></textarea>
          </div>
          <div class="d-flex justify-content-end gap-2 mt-4">
            <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Publish Announcement</button>
          </div>
        </form>
      `
    });
  },

  handleCreateAnnouncementSubmit() {
    const title = document.getElementById('new-ann-title').value.trim();
    const category = document.getElementById('new-ann-category').value;
    const priority = document.getElementById('new-ann-priority').value;
    const tagsRaw = document.getElementById('new-ann-tags').value.trim();
    const content = document.getElementById('new-ann-content').value.trim();
    const user = window.store.getCurrentUser();

    if (!title || !content) return;

    const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : ['Faculty'];

    window.store.addAnnouncement({
      title,
      category,
      priority,
      content,
      tags,
      authorName: user ? user.name : 'Faculty Staff',
      authorRole: user ? user.title : 'Staff Member',
      authorAvatar: user ? user.avatarBg : 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
      authorInitials: user ? user.avatarText : 'FS'
    });

    this.closeModal();
    this.showToast('Announcement published successfully to campus feed!', 'success');
    this.navigateTo(this.currentView);
  },

  // Modal: View Announcement Details
  viewAnnouncementDetails(id) {
    const ann = window.store.getAnnouncementById(id);
    if (!ann) return;

    ann.views = (ann.views || 0) + 1;

    this.showModal({
      title: ann.title,
      maxWidth: '680px',
      content: `
        <div class="announcement-detail-view">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="d-flex align-items-center gap-2">
              <div class="author-avatar" style="background:${ann.authorAvatar || 'var(--color-primary)'}">
                ${ann.authorInitials || 'CC'}
              </div>
              <div>
                <strong class="d-block">${ann.authorName}</strong>
                <span class="text-xs text-muted">${ann.authorRole} • ${ann.timestamp}</span>
              </div>
            </div>
            <div class="d-flex gap-1">
              <span class="badge ${ann.priority === 'urgent' ? 'badge-danger' : 'badge-slate'}">${ann.category}</span>
              ${ann.priority === 'urgent' ? `<span class="badge badge-danger">Urgent</span>` : ''}
            </div>
          </div>

          <div class="announcement-full-body mt-3">
            ${ann.content.split('\n\n').map(p => `<p class="mb-3">${p}</p>`).join('')}
          </div>

          ${ann.attachments && ann.attachments.length > 0 ? `
            <div class="attachment-box mt-3 p-3 bg-subtle rounded-3">
              <div class="fw-semibold text-xs text-muted mb-2">OFFICIAL ATTACHMENTS:</div>
              ${ann.attachments.map(att => `
                <div class="attachment-chip cursor-pointer" onclick="App.downloadDemoFile('${att.name}')">
                  <svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <span>${att.name} (${att.size})</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
            <span class="text-xs text-muted">Views: ${ann.views} faculty members</span>
            <button class="btn btn-secondary" onclick="App.closeModal()">Close</button>
          </div>
        </div>
      `
    });
  },

  // Modal: Schedule Meeting
  openScheduleModal() {
    this.showModal({
      title: 'Schedule Faculty or Department Meeting',
      content: `
        <form id="schedule-meeting-form" onsubmit="event.preventDefault(); App.handleScheduleMeetingSubmit();">
          <div class="form-group mb-3">
            <label class="form-label" for="new-mtg-title">Meeting Title</label>
            <input type="text" id="new-mtg-title" class="form-control" placeholder="e.g. Academic Curriculum Review" required>
          </div>
          <div class="form-row-2 mb-3">
            <div class="form-group">
              <label class="form-label" for="new-mtg-dept">Department / Group</label>
              <input type="text" id="new-mtg-dept" class="form-control" value="Computer Science" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="new-mtg-type">Format</label>
              <select id="new-mtg-type" class="form-control">
                <option value="Hybrid">Hybrid (In-Person + Video)</option>
                <option value="In-Person">In-Person Only</option>
                <option value="Virtual">Virtual Only</option>
              </select>
            </div>
          </div>
          <div class="form-row-2 mb-3">
            <div class="form-group">
              <label class="form-label" for="new-mtg-date">Date</label>
              <input type="date" id="new-mtg-date" class="form-control" value="2026-09-08" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="new-mtg-time">Time</label>
              <input type="text" id="new-mtg-time" class="form-control" value="02:00 PM – 03:30 PM" required>
            </div>
          </div>
          <div class="form-group mb-3">
            <label class="form-label" for="new-mtg-location">Location / Room Number</label>
            <input type="text" id="new-mtg-location" class="form-control" value="Tech Hall, Conference Suite 402" required>
          </div>
          <div class="form-group mb-3">
            <label class="form-label" for="new-mtg-agenda">Agenda & Objectives</label>
            <textarea id="new-mtg-agenda" class="form-control" rows="3" placeholder="Brief agenda summary..." required></textarea>
          </div>
          <div class="d-flex justify-content-end gap-2 mt-4">
            <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Schedule Session</button>
          </div>
        </form>
      `
    });
  },

  handleScheduleMeetingSubmit() {
    const title = document.getElementById('new-mtg-title').value.trim();
    const department = document.getElementById('new-mtg-dept').value.trim();
    const type = document.getElementById('new-mtg-type').value;
    const date = document.getElementById('new-mtg-date').value;
    const time = document.getElementById('new-mtg-time').value.trim();
    const location = document.getElementById('new-mtg-location').value.trim();
    const agenda = document.getElementById('new-mtg-agenda').value.trim();
    const user = window.store.getCurrentUser();

    if (!title || !date || !time) return;

    window.store.addMeeting({
      title,
      department,
      type,
      date,
      time,
      location,
      agenda,
      host: user ? user.name : 'Faculty Coordinator',
      virtualLink: type !== 'In-Person' ? `https://meet.crestview.edu/${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : null,
      category: 'department'
    });

    this.closeModal();
    this.showToast('Meeting scheduled & added to department calendar!', 'success');
    this.navigateTo(this.currentView);
  },

  // Modal: Create Staff Poll
  openCreatePollModal() {
    this.showModal({
      title: 'Initiate Staff Poll / Referendum',
      content: `
        <form id="create-poll-form" onsubmit="event.preventDefault(); App.handleCreatePollSubmit();">
          <div class="form-group mb-3">
            <label class="form-label" for="new-poll-title">Ballot / Question Title</label>
            <input type="text" id="new-poll-title" class="form-control" placeholder="e.g. Allocation of Interdisciplinary Seed Grants" required>
          </div>
          <div class="form-row-2 mb-3">
            <div class="form-group">
              <label class="form-label" for="new-poll-category">Category</label>
              <select id="new-poll-category" class="form-control">
                <option value="Academic Governance">Academic Governance</option>
                <option value="Campus Technology">Campus Technology</option>
                <option value="Staff Development">Staff Development</option>
                <option value="Campus Life & Facilities">Campus Life & Facilities</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="new-poll-days">Voting Period (Days)</label>
              <input type="number" id="new-poll-days" class="form-control" value="14" min="1" max="60">
            </div>
          </div>
          <div class="form-group mb-3">
            <label class="form-label" for="new-poll-desc">Context & Description</label>
            <textarea id="new-poll-desc" class="form-control" rows="2" placeholder="Explain the rationale behind this vote..." required></textarea>
          </div>
          <div class="form-group mb-3">
            <label class="form-label">Voting Options (at least 2)</label>
            <input type="text" id="poll-opt-1" class="form-control mb-2" placeholder="Option 1" required>
            <input type="text" id="poll-opt-2" class="form-control mb-2" placeholder="Option 2" required>
            <input type="text" id="poll-opt-3" class="form-control mb-2" placeholder="Option 3 (Optional)">
          </div>
          <div class="d-flex justify-content-end gap-2 mt-4">
            <button type="button" class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Open Poll for Votes</button>
          </div>
        </form>
      `
    });
  },

  handleCreatePollSubmit() {
    const title = document.getElementById('new-poll-title').value.trim();
    const category = document.getElementById('new-poll-category').value;
    const daysRemaining = parseInt(document.getElementById('new-poll-days').value, 10) || 14;
    const description = document.getElementById('new-poll-desc').value.trim();

    const opt1 = document.getElementById('poll-opt-1').value.trim();
    const opt2 = document.getElementById('poll-opt-2').value.trim();
    const opt3 = document.getElementById('poll-opt-3')?.value.trim();

    const options = [opt1, opt2];
    if (opt3) options.push(opt3);

    const user = window.store.getCurrentUser();

    window.store.addPoll({
      title,
      category,
      daysRemaining,
      description,
      creator: user ? `${user.name} (${user.department})` : 'Faculty Committee',
      options
    });

    this.closeModal();
    this.showToast('Staff ballot opened for faculty voting!', 'success');
    this.navigateTo(this.currentView);
  },

  downloadDemoFile(name) {
    this.showToast(`Downloading: ${name}`, 'info');
  },

  // Toast Notification Engine
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;

    let iconSvg = `<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    if (type === 'success') {
      iconSvg = `<svg class="icon-sm text-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg class="icon-sm text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-text">${message}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  }
};

window.App = App;

// Bootstrap application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
