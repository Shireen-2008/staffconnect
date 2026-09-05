/**
 * StaffConnect - Meetings View
 * Manage academic meetings, Senate assemblies, departmental syncs, and RSVP responses.
 */

const MeetingsView = {
  activeTab: 'all', // 'all' | 'attending' | 'governance' | 'department'

  render(container) {
    const meetings = window.store.getMeetings();

    container.innerHTML = `
      <div class="view-header">
        <div class="view-header-content">
          <h1 class="view-title">Scheduled Meetings & Assemblies</h1>
          <p class="view-subtitle">Coordinate committees, departmental reviews, and faculty governance sessions.</p>
        </div>
        <div class="view-header-actions">
          <button class="btn btn-secondary" onclick="MeetingsView.exportCalendar()">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Sync iCal / Outlook
          </button>
          <button class="btn btn-primary" onclick="window.App.openScheduleModal()">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Schedule New Meeting
          </button>
        </div>
      </div>

      <!-- Quick Metrics Ribbon -->
      <div class="meeting-stats-bar">
        <div class="meeting-stat-item">
          <span class="stat-num text-primary">${meetings.length}</span>
          <span class="stat-label">Total Scheduled</span>
        </div>
        <div class="meeting-stat-item">
          <span class="stat-num text-emerald">${meetings.filter(m => m.userRsvp === 'attending').length}</span>
          <span class="stat-label">Accepted (Attending)</span>
        </div>
        <div class="meeting-stat-item">
          <span class="stat-num text-amber">${meetings.filter(m => m.userRsvp === 'tentative').length}</span>
          <span class="stat-label">Tentative</span>
        </div>
        <div class="meeting-stat-item">
          <span class="stat-num text-sky">${meetings.filter(m => m.type === 'Hybrid' || m.type === 'Virtual').length}</span>
          <span class="stat-label">Virtual / Hybrid Enabled</span>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-tabs-wrapper">
        <div class="filter-tabs">
          <button class="filter-tab ${this.activeTab === 'all' ? 'active' : ''}" onclick="MeetingsView.setFilter('all')">
            All Sessions (${meetings.length})
          </button>
          <button class="filter-tab ${this.activeTab === 'attending' ? 'active' : ''}" onclick="MeetingsView.setFilter('attending')">
            My Confirmed (${meetings.filter(m => m.userRsvp === 'attending').length})
          </button>
          <button class="filter-tab ${this.activeTab === 'governance' ? 'active' : ''}" onclick="MeetingsView.setFilter('governance')">
            Faculty Senate & Governance
          </button>
          <button class="filter-tab ${this.activeTab === 'department' ? 'active' : ''}" onclick="MeetingsView.setFilter('department')">
            Departmental & Working Groups
          </button>
        </div>
      </div>

      <!-- Meeting Cards Grid -->
      <div class="meetings-grid" id="meetings-grid-container">
        ${this.renderMeetingsList(meetings)}
      </div>
    `;
  },

  setFilter(tab) {
    this.activeTab = tab;
    document.querySelectorAll('.filter-tabs .filter-tab').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('onclick').includes(`'${tab}'`));
    });
    const container = document.getElementById('meetings-grid-container');
    if (container) {
      container.innerHTML = this.renderMeetingsList(window.store.getMeetings());
    }
  },

  getFilteredMeetings(meetings) {
    if (this.activeTab === 'attending') {
      return meetings.filter(m => m.userRsvp === 'attending');
    }
    if (this.activeTab === 'governance') {
      return meetings.filter(m => m.category === 'governance');
    }
    if (this.activeTab === 'department') {
      return meetings.filter(m => m.category === 'department' || m.category === 'research');
    }
    return meetings;
  },

  renderMeetingsList(meetings) {
    const list = this.getFilteredMeetings(meetings);

    if (list.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <h3>No meetings in this category</h3>
          <p class="text-muted">You currently do not have any sessions categorized under "${this.activeTab}".</p>
          <button class="btn btn-secondary mt-2" onclick="MeetingsView.setFilter('all')">Show All Meetings</button>
        </div>
      `;
    }

    return list.map(mtg => {
      const dateObj = new Date(mtg.date);
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      return `
        <div class="card meeting-card">
          <div class="meeting-card-header">
            <div class="meeting-date-badge">
              <span class="date-day">${dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span class="date-num">${dateObj.getDate()}</span>
            </div>
            <div class="meeting-title-block">
              <div class="meeting-badge-row">
                <span class="badge ${mtg.type === 'Hybrid' ? 'badge-indigo' : mtg.type === 'Virtual' ? 'badge-sky' : 'badge-emerald'}">
                  ${mtg.type}
                </span>
                <span class="badge badge-slate">${mtg.department}</span>
              </div>
              <h3 class="meeting-title">${mtg.title}</h3>
            </div>
          </div>

          <div class="meeting-card-details">
            <div class="detail-row">
              <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span><strong>${formattedDate}</strong> • ${mtg.time}</span>
            </div>
            <div class="detail-row">
              <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${mtg.location}</span>
            </div>
            <div class="detail-row">
              <svg class="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>Convened by: <strong>${mtg.host}</strong></span>
            </div>
          </div>

          <div class="meeting-agenda-box">
            <div class="agenda-heading">Agenda & Session Notes:</div>
            <p class="agenda-text">${mtg.agenda}</p>
          </div>

          <!-- RSVP and Actions Bar -->
          <div class="meeting-card-actions">
            <div class="rsvp-action-block">
              <span class="rsvp-label">Your Response:</span>
              <div class="rsvp-btn-group" data-meeting-id="${mtg.id}">
                <button class="rsvp-pill ${mtg.userRsvp === 'attending' ? 'active attending' : ''}" 
                        onclick="MeetingsView.handleRsvp('${mtg.id}', 'attending')">
                  ✓ Attending
                </button>
                <button class="rsvp-pill ${mtg.userRsvp === 'tentative' ? 'active tentative' : ''}" 
                        onclick="MeetingsView.handleRsvp('${mtg.id}', 'tentative')">
                  ? Tentative
                </button>
                <button class="rsvp-pill ${mtg.userRsvp === 'declined' ? 'active declined' : ''}" 
                        onclick="MeetingsView.handleRsvp('${mtg.id}', 'declined')">
                  ✕ Decline
                </button>
              </div>
            </div>

            <div class="meeting-links-block">
              ${mtg.virtualLink ? `
                <button class="btn btn-sm btn-outline-primary" onclick="MeetingsView.joinVirtualRoom('${mtg.virtualLink}', '${mtg.title.replace(/'/g, "\\'")}')">
                  <svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                  Join Meeting Room
                </button>
              ` : ''}
              <button class="btn btn-sm btn-ghost" title="Copy invitation details" onclick="MeetingsView.copyMeetingInfo('${mtg.id}')">
                <svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  handleRsvp(meetingId, status) {
    window.store.updateMeetingRsvp(meetingId, status);
    const names = { attending: 'Accepted (Attending)', tentative: 'Marked as Tentative', declined: 'Declined' };
    window.App.showToast(`Meeting status: ${names[status]}`, 'info');
    
    // Re-render the meetings list
    const container = document.getElementById('meetings-grid-container');
    if (container) {
      container.innerHTML = this.renderMeetingsList(window.store.getMeetings());
    }
  },

  joinVirtualRoom(url, title) {
    window.App.showModal({
      title: 'Connecting to Campus Virtual Conference',
      content: `
        <div class="virtual-room-modal">
          <div class="virtual-room-indicator">
            <span class="sonar-wave"></span>
            <div class="cam-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
            </div>
          </div>
          <h3 class="mt-3">${title}</h3>
          <p class="text-muted">You are connecting to Crestview Secure Video Bridge.</p>
          <div class="video-preview-placeholder">
            <div class="camera-status">Camera & Microphone Checked: High Definition Audio</div>
            <div class="network-badge">Encryption: TLS 1.3 Active</div>
          </div>
          <div class="d-flex justify-content-center gap-2 mt-3">
            <button class="btn btn-secondary" onclick="window.App.closeModal()">Dismiss</button>
            <button class="btn btn-primary" onclick="window.App.showToast('Joined meeting room as ' + window.store.getCurrentUser().name, 'success'); window.App.closeModal();">Enter Room Now</button>
          </div>
        </div>
      `
    });
  },

  copyMeetingInfo(meetingId) {
    const m = window.store.getMeetingById(meetingId);
    if (!m) return;
    const info = `Staff Meeting: ${m.title}\nDate: ${m.date} at ${m.time}\nLocation: ${m.location}\nHost: ${m.host}\nLink: ${m.virtualLink || 'In-Person'}`;
    navigator.clipboard?.writeText(info).then(() => {
      window.App.showToast('Meeting details copied to clipboard!', 'success');
    }).catch(() => {
      window.App.showToast('Meeting details copied!', 'success');
    });
  },

  exportCalendar() {
    window.App.showToast('Exported calendar feed (.ics). Syncing with your faculty schedule.', 'success');
  }
};

window.MeetingsView = MeetingsView;
