/**
 * StaffConnect - Staff Polls & Voting View
 * Real-time voting, vote distribution progress bars, and staff referendum creation.
 */

const PollsView = {
  filterStatus: 'active', // 'active' | 'all' | 'closed'

  render(container) {
    const polls = window.store.getPolls();

    container.innerHTML = `
      <div class="view-header">
        <div class="view-header-content">
          <h1 class="view-title">Staff Polls & Faculty Voting</h1>
          <p class="view-subtitle">Participate in collegiate decision-making, curriculum ballots, and campus initiative votes.</p>
        </div>
        <div class="view-header-actions">
          <button class="btn btn-primary" onclick="window.App.openCreatePollModal()">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Create Staff Poll
          </button>
        </div>
      </div>

      <!-- Voting Stats Header -->
      <div class="polls-overview-banner">
        <div class="polls-stat">
          <span class="polls-stat-num">${polls.filter(p => p.status === 'active').length}</span>
          <span class="polls-stat-lbl">Active Referendums</span>
        </div>
        <div class="polls-stat">
          <span class="polls-stat-num text-emerald">${polls.filter(p => p.hasVoted).length}</span>
          <span class="polls-stat-lbl">You Have Voted In</span>
        </div>
        <div class="polls-stat">
          <span class="polls-stat-num text-amber">${polls.filter(p => p.status === 'active' && !p.hasVoted).length}</span>
          <span class="polls-stat-lbl">Awaiting Your Vote</span>
        </div>
        <div class="polls-stat">
          <span class="polls-stat-num text-sky">${polls.reduce((acc, p) => acc + (p.totalVotes || 0), 0)}</span>
          <span class="polls-stat-lbl">Total Ballots Cast Across College</span>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="filter-tabs-wrapper mt-3">
        <div class="filter-tabs">
          <button class="filter-tab ${this.filterStatus === 'active' ? 'active' : ''}" onclick="PollsView.setStatusFilter('active')">
            Active Polls (${polls.filter(p => p.status === 'active').length})
          </button>
          <button class="filter-tab ${this.filterStatus === 'all' ? 'active' : ''}" onclick="PollsView.setStatusFilter('all')">
            All Ballots (${polls.length})
          </button>
          <button class="filter-tab ${this.filterStatus === 'closed' ? 'active' : ''}" onclick="PollsView.setStatusFilter('closed')">
            Concluded / Archived (${polls.filter(p => p.status === 'closed').length})
          </button>
        </div>
      </div>

      <!-- Polls Container -->
      <div class="polls-grid" id="polls-grid-container">
        ${this.renderPollsList(polls)}
      </div>
    `;
  },

  setStatusFilter(status) {
    this.filterStatus = status;
    document.querySelectorAll('.filter-tabs .filter-tab').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('onclick').includes(`'${status}'`));
    });
    const container = document.getElementById('polls-grid-container');
    if (container) {
      container.innerHTML = this.renderPollsList(window.store.getPolls());
    }
  },

  getFilteredPolls(polls) {
    if (this.filterStatus === 'active') {
      return polls.filter(p => p.status === 'active');
    }
    if (this.filterStatus === 'closed') {
      return polls.filter(p => p.status === 'closed');
    }
    return polls;
  },

  renderPollsList(polls) {
    const list = this.getFilteredPolls(polls);

    if (list.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg>
          </div>
          <h3>No polls found</h3>
          <p class="text-muted">There are no ballots in this category at the moment.</p>
        </div>
      `;
    }

    return list.map(poll => {
      const isClosed = poll.status === 'closed';
      return `
        <div class="card poll-card ${isClosed ? 'poll-card-closed' : ''}" id="poll-card-${poll.id}">
          <div class="poll-card-top">
            <div class="poll-meta-badges">
              <span class="badge ${isClosed ? 'badge-slate' : 'badge-violet'}">
                ${poll.category}
              </span>
              ${isClosed ? `
                <span class="badge badge-slate">Voting Concluded</span>
              ` : `
                <span class="badge badge-emerald">
                  <span class="pulse-dot-sm"></span> Active Voting
                </span>
              `}
              ${poll.hasVoted ? `
                <span class="badge badge-indigo">
                  <svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  You Voted
                </span>
              ` : ''}
            </div>

            <div class="poll-time-box">
              <svg class="icon-xs text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>${isClosed ? 'Ended on ' + poll.endDate : `${poll.daysRemaining} days remaining`}</span>
            </div>
          </div>

          <h2 class="poll-question-title">${poll.title}</h2>
          <p class="poll-description">${poll.description}</p>
          <div class="poll-creator-line">
            Sponsored by: <strong>${poll.creator}</strong>
          </div>

          <!-- Poll Options & Voting -->
          <div class="poll-options-wrapper" id="poll-options-${poll.id}">
            ${this.renderOptions(poll)}
          </div>

          <div class="poll-footer">
            <div class="poll-voter-summary">
              <svg class="icon-sm text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span><strong>${poll.totalVotes}</strong> certified staff ballots cast</span>
            </div>
            ${!isClosed && !poll.hasVoted ? `
              <span class="hint-text text-amber">Click any option to cast your vote</span>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  renderOptions(poll) {
    const isClosed = poll.status === 'closed';
    const total = poll.totalVotes || 1;

    return poll.options.map(opt => {
      const percentage = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
      const isUserChoice = poll.userVoteOptionId === opt.id;

      return `
        <div class="poll-option-bar ${isUserChoice ? 'selected' : ''} ${poll.hasVoted || isClosed ? 'voted-mode' : ''}"
             ${!isClosed ? `onclick="PollsView.castVote('${poll.id}', '${opt.id}')"` : ''}>
          <div class="poll-option-progress" style="width: ${poll.hasVoted || isClosed ? percentage : 0}%"></div>
          <div class="poll-option-content">
            <div class="poll-radio-indicator">
              ${isUserChoice ? `<span class="radio-check">✓</span>` : ''}
            </div>
            <span class="poll-option-label">${opt.label}</span>
            ${poll.hasVoted || isClosed ? `
              <div class="poll-percentage-badge">
                <span class="fw-bold">${percentage}%</span>
                <span class="vote-count text-muted">(${opt.votes} votes)</span>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  castVote(pollId, optionId) {
    window.store.castVote(pollId, optionId);
    window.App.showToast('Your vote has been counted anonymously.', 'success');
    
    // Refresh only the specific poll card
    const poll = window.store.getPollById(pollId);
    const optionsContainer = document.getElementById(`poll-options-${pollId}`);
    if (optionsContainer && poll) {
      optionsContainer.innerHTML = this.renderOptions(poll);
    }
  }
};

window.PollsView = PollsView;
