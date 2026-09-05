/**
 * StaffConnect - Notifications Center View
 * Manage real-time alerts, campus announcements notifications, meeting invitations, and unread badges.
 */

const NotificationsView = {
  filterType: 'all', // 'all' | 'unread' | 'urgent'

  render(container) {
    const notifications = window.store.getNotifications();
    const unreadCount = window.store.getUnreadNotificationsCount();

    container.innerHTML = `
      <div class="view-header">
        <div class="view-header-content">
          <h1 class="view-title">Notification & Activity Center</h1>
          <p class="view-subtitle">Stay informed on faculty announcements, schedule updates, and urgent campus alerts.</p>
        </div>
        <div class="view-header-actions">
          <button class="btn btn-secondary" onclick="NotificationsView.markAllRead()" ${unreadCount === 0 ? 'disabled' : ''}>
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Mark All as Read
          </button>
        </div>
      </div>

      <!-- Quick Notification Stats -->
      <div class="notif-stat-banner">
        <div class="notif-stat-box">
          <span class="notif-stat-val text-primary">${notifications.length}</span>
          <span class="notif-stat-lbl">Total Alerts</span>
        </div>
        <div class="notif-stat-box">
          <span class="notif-stat-val ${unreadCount > 0 ? 'text-amber' : 'text-emerald'}">${unreadCount}</span>
          <span class="notif-stat-lbl">Unread Notices</span>
        </div>
        <div class="notif-stat-box">
          <span class="notif-stat-val text-danger">${notifications.filter(n => n.priority === 'urgent').length}</span>
          <span class="notif-stat-lbl">Urgent Level Alerts</span>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-tabs-wrapper mt-3">
        <div class="filter-tabs">
          <button class="filter-tab ${this.filterType === 'all' ? 'active' : ''}" onclick="NotificationsView.setFilter('all')">
            All Notifications (${notifications.length})
          </button>
          <button class="filter-tab ${this.filterType === 'unread' ? 'active' : ''}" onclick="NotificationsView.setFilter('unread')">
            Unread Only (${unreadCount})
          </button>
          <button class="filter-tab ${this.filterType === 'urgent' ? 'active' : ''}" onclick="NotificationsView.setFilter('urgent')">
            Urgent Alerts (${notifications.filter(n => n.priority === 'urgent').length})
          </button>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="notifications-container" id="notifications-list-container">
        ${this.renderList(notifications)}
      </div>
    `;
  },

  setFilter(type) {
    this.filterType = type;
    document.querySelectorAll('.filter-tabs .filter-tab').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('onclick').includes(`'${type}'`));
    });
    const container = document.getElementById('notifications-list-container');
    if (container) {
      container.innerHTML = this.renderList(window.store.getNotifications());
    }
  },

  getFilteredList(notifs) {
    if (this.filterType === 'unread') {
      return notifs.filter(n => !n.read);
    }
    if (this.filterType === 'urgent') {
      return notifs.filter(n => n.priority === 'urgent' || n.priority === 'high');
    }
    return notifs;
  },

  renderList(notifs) {
    const list = this.getFilteredList(notifs);

    if (list.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </div>
          <h3>You're all caught up!</h3>
          <p class="text-muted">No notifications found under "${this.filterType}".</p>
        </div>
      `;
    }

    return list.map(item => {
      const getIcon = (type) => {
        switch (type) {
          case 'announcement':
            return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`;
          case 'meeting':
            return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;
          case 'poll':
            return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg>`;
          default:
            return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        }
      };

      return `
        <div class="card notif-card ${!item.read ? 'unread' : ''} ${item.priority === 'urgent' ? 'urgent-item' : ''}" 
             onclick="NotificationsView.handleNotificationClick('${item.id}', '${item.type}', '${item.targetId}')">
          <div class="notif-icon-col ${item.priority === 'urgent' ? 'icon-danger' : item.type === 'meeting' ? 'icon-indigo' : item.type === 'poll' ? 'icon-violet' : 'icon-emerald'}">
            ${getIcon(item.type)}
          </div>
          <div class="notif-content-col">
            <div class="notif-header-row">
              <span class="notif-title">${item.title}</span>
              <div class="notif-meta-tags">
                ${item.priority === 'urgent' ? `<span class="badge badge-danger">Urgent</span>` : ''}
                <span class="notif-timestamp">${item.timestamp}</span>
              </div>
            </div>
            <p class="notif-message">${item.message}</p>
          </div>
          <div class="notif-status-col">
            ${!item.read ? `
              <span class="unread-dot" title="Unread notification"></span>
            ` : `
              <span class="read-check" title="Read">✓</span>
            `}
          </div>
        </div>
      `;
    }).join('');
  },

  handleNotificationClick(notifId, type, targetId) {
    window.store.markNotificationAsRead(notifId);
    window.App.updateNotificationBadge();

    // Navigate to respective view
    if (type === 'announcement') {
      window.App.navigateTo('announcements');
      if (targetId) {
        setTimeout(() => window.App.viewAnnouncementDetails(targetId), 200);
      }
    } else if (type === 'meeting') {
      window.App.navigateTo('meetings');
    } else if (type === 'poll') {
      window.App.navigateTo('polls');
    }
  },

  markAllRead() {
    window.store.markAllNotificationsAsRead();
    window.App.updateNotificationBadge();
    window.App.showToast('All notifications marked as read', 'success');
    this.render(document.getElementById('app-content'));
  }
};

window.NotificationsView = NotificationsView;
