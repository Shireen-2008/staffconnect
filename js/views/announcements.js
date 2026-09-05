/**
 * StaffConnect - Announcements View
 * Filter, search, read, and publish college bulletins and academic announcements.
 */

const AnnouncementsView = {
  activeCategory: 'all',
  searchQuery: '',

  render(container) {
    const announcements = window.store.getAnnouncements();

    container.innerHTML = `
      <div class="view-header">
        <div class="view-header-content">
          <h1 class="view-title">Campus Announcements & Bulletins</h1>
          <p class="view-subtitle">Official notifications from college departments, registrar, and administrative offices.</p>
        </div>
        <div class="view-header-actions">
          <button class="btn btn-primary" onclick="window.App.openAnnouncementModal()">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Post Announcement
          </button>
        </div>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="filter-toolbar">
        <div class="search-input-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="announcement-search-input" class="form-control" placeholder="Search bulletins by title, keyword, or author..." value="${this.searchQuery}">
          ${this.searchQuery ? `
            <button class="clear-search-btn" onclick="AnnouncementsView.clearSearch()">✕</button>
          ` : ''}
        </div>

        <div class="filter-pills-scroll">
          <button class="filter-pill ${this.activeCategory === 'all' ? 'active' : ''}" onclick="AnnouncementsView.setCategory('all')">All Notices</button>
          <button class="filter-pill ${this.activeCategory === 'urgent' ? 'active' : ''}" onclick="AnnouncementsView.setCategory('urgent')">🔥 Urgent Only</button>
          <button class="filter-pill ${this.activeCategory === 'Academic Affairs' ? 'active' : ''}" onclick="AnnouncementsView.setCategory('Academic Affairs')">Academic Affairs</button>
          <button class="filter-pill ${this.activeCategory === 'IT & Facilities' ? 'active' : ''}" onclick="AnnouncementsView.setCategory('IT & Facilities')">IT & Facilities</button>
          <button class="filter-pill ${this.activeCategory === 'Research & Grants' ? 'active' : ''}" onclick="AnnouncementsView.setCategory('Research & Grants')">Research & Grants</button>
          <button class="filter-pill ${this.activeCategory === 'Human Resources' ? 'active' : ''}" onclick="AnnouncementsView.setCategory('Human Resources')">Human Resources</button>
        </div>
      </div>

      <!-- Announcements Card Grid / Feed -->
      <div class="announcements-feed" id="announcements-feed-container">
        ${this.renderListHtml(announcements)}
      </div>
    `;

    this.bindSearchEvent();
  },

  bindSearchEvent() {
    const input = document.getElementById('announcement-search-input');
    if (input) {
      input.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.updateFeed();
      });
    }
  },

  setCategory(cat) {
    this.activeCategory = cat;
    document.querySelectorAll('.filter-pills-scroll .filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.includes(cat) || (cat === 'all' && btn.textContent.includes('All')));
    });
    this.updateFeed();
  },

  clearSearch() {
    this.searchQuery = '';
    const input = document.getElementById('announcement-search-input');
    if (input) input.value = '';
    this.updateFeed();
  },

  getFilteredList(announcements) {
    return announcements.filter(item => {
      // Category filter
      if (this.activeCategory === 'urgent') {
        if (item.priority !== 'urgent') return false;
      } else if (this.activeCategory !== 'all') {
        if (item.category !== this.activeCategory) return false;
      }

      // Search filter
      if (this.searchQuery) {
        const text = `${item.title} ${item.content} ${item.authorName} ${item.category} ${item.tags ? item.tags.join(' ') : ''}`.toLowerCase();
        if (!text.includes(this.searchQuery)) return false;
      }

      return true;
    });
  },

  updateFeed() {
    const announcements = window.store.getAnnouncements();
    const container = document.getElementById('announcements-feed-container');
    if (container) {
      container.innerHTML = this.renderListHtml(announcements);
    }
  },

  renderListHtml(allAnnouncements) {
    const list = this.getFilteredList(allAnnouncements);

    if (list.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <h3>No announcements found</h3>
          <p class="text-muted">No bulletins matched your current filter "${this.activeCategory}" or query "${this.searchQuery}".</p>
          <button class="btn btn-secondary mt-2" onclick="AnnouncementsView.clearSearch(); AnnouncementsView.setCategory('all');">Reset Filters</button>
        </div>
      `;
    }

    return list.map(item => `
      <article class="card announcement-card ${item.pinned ? 'pinned-card' : ''} ${item.priority === 'urgent' ? 'urgent-border' : ''}">
        ${item.pinned ? `
          <div class="pinned-ribbon">
            <svg class="icon-xs" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>
            Pinned Bulletin
          </div>
        ` : ''}

        <div class="card-body">
          <div class="announcement-header">
            <div class="author-meta-group">
              <div class="author-avatar" style="background:${item.authorAvatar || 'var(--color-primary)'}">
                ${item.authorInitials || 'CC'}
              </div>
              <div class="author-details">
                <span class="author-name">${item.authorName}</span>
                <span class="author-role">${item.authorRole || 'Faculty & Staff'} • ${item.timestamp}</span>
              </div>
            </div>
            <div class="announcement-badge-group">
              <span class="badge ${item.priority === 'urgent' ? 'badge-danger' : 'badge-slate'}">
                ${item.category}
              </span>
              ${item.priority === 'urgent' ? `<span class="badge badge-danger">Urgent</span>` : ''}
            </div>
          </div>

          <h3 class="announcement-title" onclick="window.App.viewAnnouncementDetails('${item.id}')">
            ${item.title}
          </h3>

          <p class="announcement-excerpt">
            ${item.content.length > 220 ? item.content.slice(0, 220) + '...' : item.content}
          </p>

          ${item.tags && item.tags.length > 0 ? `
            <div class="tag-list">
              ${item.tags.map(t => `<span class="tag-pill">#${t}</span>`).join('')}
            </div>
          ` : ''}

          ${item.attachments && item.attachments.length > 0 ? `
            <div class="attachment-preview-box">
              <span class="attachment-label">Attachments (${item.attachments.length}):</span>
              ${item.attachments.map(att => `
                <div class="attachment-chip" onclick="window.App.downloadDemoFile('${att.name}')">
                  <svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <span class="file-name">${att.name}</span>
                  <span class="file-size">(${att.size})</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div class="announcement-footer">
            <span class="views-counter">
              <svg class="icon-sm text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              ${item.views} faculty views
            </span>
            <button class="btn btn-sm btn-outline-primary" onclick="window.App.viewAnnouncementDetails('${item.id}')">
              Read Full Notice &rarr;
            </button>
          </div>
        </div>
      </article>
    `).join('');
  }
};

window.AnnouncementsView = AnnouncementsView;
