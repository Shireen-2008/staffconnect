/**
 * StaffConnect - Dashboard View
 * Renders executive overview, KPI stats, upcoming meetings, priority announcements, and quick poll widget.
 */

const DashboardView = {
  render(container) {
    const user = window.store.getCurrentUser();
    if (!user) return;

    const announcements = window.store.getAnnouncements();
    const meetings = window.store.getMeetings();
    const polls = window.store.getPolls();
    const unreadNotifs = window.store.getUnreadNotificationsCount();

    // Compute KPIs
    const urgentAnnouncements = announcements.filter(a => a.priority === 'urgent');
    const upcomingMeetings = meetings.slice(0, 3);
    const activePollsPending = polls.filter(p => p.status === 'active' && !p.hasVoted);
    const trendingPoll = polls.find(p => p.status === 'active') || polls[0];

    container.innerHTML = `
      <div class="view-header">
        <div class="view-header-content">
          <div class="greeting-badge">
            <span class="pulse-dot"></span>
            <span>Academic Term: Fall 2026 • Week 4</span>
          </div>
          <h1 class="view-title">Welcome back, <span id="dashboard-user-greeting">${user.name}</span></h1>
          <p class="view-subtitle">Here is your daily campus briefing, scheduled meetings, and active faculty votes.</p>
        </div>
        <div class="view-header-actions">
          <button class="btn btn-secondary" onclick="window.App.openScheduleModal()">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Schedule Meeting
          </button>
          <button class="btn btn-primary" onclick="window.App.openAnnouncementModal()">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            New Announcement
          </button>
        </div>
      </div>

      <!-- Urgent Alert Banner if present -->
      ${urgentAnnouncements.length > 0 ? `
        <div class="alert-banner alert-banner-urgent">
          <div class="alert-banner-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <div class="alert-banner-body">
            <div class="alert-tag">URGENT NOTICE</div>
            <h4 class="alert-title">${urgentAnnouncements[0].title}</h4>
            <p class="alert-desc">${urgentAnnouncements[0].content.slice(0, 140)}...</p>
          </div>
          <button class="btn btn-sm btn-outline-danger" onclick="window.App.viewAnnouncementDetails('${urgentAnnouncements[0].id}')">
            View Details &rarr;
          </button>
        </div>
      ` : ''}

      <!-- KPI Summary Cards -->
      <div class="kpi-grid">
        <div class="kpi-card" onclick="window.App.navigateTo('meetings')">
          <div class="kpi-icon-wrapper bg-indigo-soft">
            <svg class="kpi-icon text-indigo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Upcoming Meetings</span>
            <div class="kpi-value">${meetings.length} <span class="kpi-subtext">scheduled</span></div>
            <span class="kpi-trend positive">Next: Tomorrow at 10:00 AM</span>
          </div>
        </div>

        <div class="kpi-card" onclick="window.App.navigateTo('announcements')">
          <div class="kpi-icon-wrapper bg-emerald-soft">
            <svg class="kpi-icon text-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Announcements</span>
            <div class="kpi-value">${announcements.length} <span class="kpi-subtext">bulletins</span></div>
            <span class="kpi-trend ${urgentAnnouncements.length > 0 ? 'text-danger' : 'positive'}">
              ${urgentAnnouncements.length} high priority
            </span>
          </div>
        </div>

        <div class="kpi-card" onclick="window.App.navigateTo('polls')">
          <div class="kpi-icon-wrapper bg-violet-soft">
            <svg class="kpi-icon text-violet" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Active Staff Polls</span>
            <div class="kpi-value">${polls.filter(p => p.status === 'active').length} <span class="kpi-subtext">live</span></div>
            <span class="kpi-trend ${activePollsPending.length > 0 ? 'text-amber' : 'positive'}">
              ${activePollsPending.length > 0 ? `${activePollsPending.length} awaiting your vote` : 'All votes cast!'}
            </span>
          </div>
        </div>

        <div class="kpi-card" onclick="window.App.navigateTo('notifications')">
          <div class="kpi-icon-wrapper bg-amber-soft">
            <svg class="kpi-icon text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Unread Alerts</span>
            <div class="kpi-value">${unreadNotifs} <span class="kpi-subtext">notices</span></div>
            <span class="kpi-trend positive">Campus systems operational</span>
          </div>
        </div>
      </div>

      <!-- Main Dashboard 2-Column Grid -->
      <div class="dashboard-main-grid">
        <!-- Left 2/3 Column: Upcoming Meetings & Live Poll -->
        <div class="dashboard-primary-col">
          <!-- Upcoming Meetings Block -->
          <div class="card dashboard-card">
            <div class="card-header">
              <div class="card-title-group">
                <h3 class="card-title">
                  <svg class="icon text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Upcoming Staff Meetings
                </h3>
                <span class="card-subtitle">Your synchronized committee and departmental agenda</span>
              </div>
              <button class="btn btn-sm btn-ghost" onclick="window.App.navigateTo('meetings')">
                View All Schedule &rarr;
              </button>
            </div>

            <div class="card-body p-0">
              <div class="meeting-list">
                ${upcomingMeetings.map(mtg => `
                  <div class="meeting-row-item">
                    <div class="meeting-date-badge">
                      <span class="date-day">${new Date(mtg.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span class="date-num">${new Date(mtg.date).getDate()}</span>
                    </div>
                    <div class="meeting-info">
                      <div class="meeting-header-line">
                        <h4 class="meeting-item-title">${mtg.title}</h4>
                        <span class="badge ${mtg.type === 'Hybrid' ? 'badge-indigo' : mtg.type === 'Virtual' ? 'badge-sky' : 'badge-emerald'}">
                          ${mtg.type}
                        </span>
                      </div>
                      <div class="meeting-meta-line">
                        <span class="meta-item">
                          <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          ${mtg.time}
                        </span>
                        <span class="meta-item">
                          <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          ${mtg.location}
                        </span>
                        <span class="meta-item">
                          <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                          ${mtg.attendeesCount} Staff
                        </span>
                      </div>
                    </div>
                    <div class="meeting-rsvp-controls">
                      <div class="rsvp-btn-group" data-meeting-id="${mtg.id}">
                        <button class="rsvp-pill ${mtg.userRsvp === 'attending' ? 'active attending' : ''}" 
                                onclick="DashboardView.handleRsvp('${mtg.id}', 'attending')">
                          Attending
                        </button>
                        <button class="rsvp-pill ${mtg.userRsvp === 'tentative' ? 'active tentative' : ''}" 
                                onclick="DashboardView.handleRsvp('${mtg.id}', 'tentative')">
                          Maybe
                        </button>
                        <button class="rsvp-pill ${mtg.userRsvp === 'declined' ? 'active declined' : ''}" 
                                onclick="DashboardView.handleRsvp('${mtg.id}', 'declined')">
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Featured Staff Poll Widget -->
          ${trendingPoll ? `
            <div class="card dashboard-card">
              <div class="card-header">
                <div class="card-title-group">
                  <div class="badge badge-violet mb-1">LIVE STAFF VOTE</div>
                  <h3 class="card-title">${trendingPoll.title}</h3>
                  <span class="card-subtitle">${trendingPoll.description}</span>
                </div>
                <div class="poll-header-meta">
                  <span class="poll-time-chip">
                    <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    ${trendingPoll.daysRemaining} days left
                  </span>
                </div>
              </div>
              <div class="card-body">
                <div class="dashboard-poll-options" id="dashboard-poll-container">
                  ${DashboardView.renderPollOptionsHtml(trendingPoll)}
                </div>
                <div class="poll-footer-info mt-3">
                  <span class="text-muted">Total votes cast: <strong>${trendingPoll.totalVotes} faculty & staff</strong></span>
                  ${trendingPoll.hasVoted ? `
                    <span class="text-success fw-medium">
                      <svg class="icon-sm text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Your vote is recorded!
                    </span>
                  ` : `
                    <span class="text-amber fw-medium">Click an option to cast your vote</span>
                  `}
                </div>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Right 1/3 Column: Recent Announcements & Quick Campus Info -->
        <div class="dashboard-secondary-col">
          <!-- Announcements Snapshot -->
          <div class="card dashboard-card">
            <div class="card-header">
              <h3 class="card-title">
                <svg class="icon text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                Campus Bulletins
              </h3>
              <button class="btn btn-sm btn-ghost" onclick="window.App.navigateTo('announcements')">
                All Notices &rarr;
              </button>
            </div>
            <div class="card-body p-0">
              <div class="bulletin-list">
                ${announcements.slice(0, 4).map(ann => `
                  <div class="bulletin-item" onclick="window.App.viewAnnouncementDetails('${ann.id}')">
                    <div class="bulletin-item-header">
                      <span class="badge ${ann.priority === 'urgent' ? 'badge-danger' : ann.pinned ? 'badge-primary' : 'badge-slate'}">
                        ${ann.category}
                      </span>
                      <span class="bulletin-time">${ann.timestamp}</span>
                    </div>
                    <h5 class="bulletin-item-title">${ann.title}</h5>
                    <div class="bulletin-author-row">
                      <div class="bulletin-author-avatar" style="background:${ann.authorAvatar}">
                        ${ann.authorInitials}
                      </div>
                      <span class="bulletin-author-name">${ann.authorName}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Quick Campus Directory / Office Hours Summary -->
          <div class="card dashboard-card">
            <div class="card-header">
              <h3 class="card-title">
                <svg class="icon text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Your Faculty Status
              </h3>
            </div>
            <div class="card-body">
              <div class="faculty-status-box">
                <div class="status-row">
                  <span class="status-label">Assigned Office:</span>
                  <span class="status-value">${user.office}</span>
                </div>
                <div class="status-row">
                  <span class="status-label">Office Hours:</span>
                  <span class="status-value">${user.officeHours}</span>
                </div>
                <div class="status-row">
                  <span class="status-label">Department:</span>
                  <span class="status-value">${user.department}</span>
                </div>
                <div class="status-row">
                  <span class="status-label">Staff ID:</span>
                  <span class="status-value font-mono">${user.employeeId}</span>
                </div>
              </div>
              <button class="btn btn-outline-primary btn-block mt-3" onclick="window.App.navigateTo('profile')">
                <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                Edit Office Hours & Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderPollOptionsHtml(poll) {
    const total = poll.totalVotes || 1;
    return poll.options.map(opt => {
      const percentage = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
      const isSelected = poll.userVoteOptionId === opt.id;
      return `
        <div class="poll-option-bar ${isSelected ? 'selected' : ''} ${poll.hasVoted ? 'voted-mode' : ''}"
             onclick="DashboardView.handleVote('${poll.id}', '${opt.id}')">
          <div class="poll-option-progress" style="width: ${poll.hasVoted ? percentage : 0}%"></div>
          <div class="poll-option-content">
            <div class="poll-radio-indicator">
              ${isSelected ? `<span class="radio-check">✓</span>` : ''}
            </div>
            <span class="poll-option-label">${opt.label}</span>
            ${poll.hasVoted ? `
              <div class="poll-percentage-badge">
                <strong>${percentage}%</strong> <span class="vote-count">(${opt.votes})</span>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  handleVote(pollId, optionId) {
    window.store.castVote(pollId, optionId);
    window.App.showToast('Vote recorded successfully!', 'success');
    // Re-render only the poll component smoothly
    const poll = window.store.getPollById(pollId);
    const container = document.getElementById('dashboard-poll-container');
    if (container && poll) {
      container.innerHTML = this.renderPollOptionsHtml(poll);
    }
  },

  handleRsvp(meetingId, status) {
    window.store.updateMeetingRsvp(meetingId, status);
    const statusTitles = { attending: 'Accepted', tentative: 'Marked as Tentative', declined: 'Declined' };
    window.App.showToast(`RSVP Updated: ${statusTitles[status]}`, 'info');
    
    // Update active class on clicked pills
    const group = document.querySelector(`.rsvp-btn-group[data-meeting-id="${meetingId}"]`);
    if (group) {
      group.querySelectorAll('.rsvp-pill').forEach(pill => {
        pill.classList.remove('active', 'attending', 'tentative', 'declined');
      });
      const targetPill = group.querySelector(`.rsvp-pill[onclick*="${status}"]`);
      if (targetPill) {
        targetPill.classList.add('active', status);
      }
    }
  }
};

window.DashboardView = DashboardView;
