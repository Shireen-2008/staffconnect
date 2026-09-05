/**
 * StaffConnect - Central State Store
 * Handles localStorage persistence, state hydration, and reactive event subscriptions.
 */

class StaffConnectStore {
  constructor() {
    this.subscribers = new Map();
    this.init();
  }

  init() {
    // Current User
    const savedUser = localStorage.getItem('staffconnect_user');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (e) {
        this.currentUser = DEMO_USERS[0];
      }
    } else {
      this.currentUser = DEMO_USERS[0]; // Default to Dr. Eleanor Vance
      this.saveUser(this.currentUser);
    }

    // Announcements
    this.announcements = this.loadFromStorage('staffconnect_announcements', INITIAL_ANNOUNCEMENTS);

    // Meetings
    this.meetings = this.loadFromStorage('staffconnect_meetings', INITIAL_MEETINGS);

    // Polls
    this.polls = this.loadFromStorage('staffconnect_polls', INITIAL_POLLS);

    // Notifications
    this.notifications = this.loadFromStorage('staffconnect_notifications', INITIAL_NOTIFICATIONS);

    // Theme
    this.theme = localStorage.getItem('staffconnect_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  loadFromStorage(key, fallbackData) {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallbackData));
      return JSON.parse(JSON.stringify(fallbackData));
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.warn(`Failed to parse ${key} from storage, resetting to fallback.`);
      localStorage.setItem(key, JSON.stringify(fallbackData));
      return JSON.parse(JSON.stringify(fallbackData));
    }
  }

  saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Event Subscription
  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event).push(callback);
    return () => {
      const list = this.subscribers.get(event) || [];
      this.subscribers.set(event, list.filter(cb => cb !== callback));
    };
  }

  notify(event, data) {
    const list = this.subscribers.get(event) || [];
    list.forEach(cb => cb(data));
  }

  // User Management
  getCurrentUser() {
    return this.currentUser;
  }

  saveUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('staffconnect_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('staffconnect_user');
    }
    this.notify('user:changed', this.currentUser);
  }

  updateUserProfile(updatedFields) {
    if (!this.currentUser) return;
    this.currentUser = { ...this.currentUser, ...updatedFields };
    this.saveUser(this.currentUser);
    this.notify('user:profile-updated', this.currentUser);
    return this.currentUser;
  }

  // Theme Management
  getTheme() {
    return this.theme;
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('staffconnect_theme', this.theme);
    document.documentElement.setAttribute('data-theme', this.theme);
    this.notify('theme:changed', this.theme);
    return this.theme;
  }

  // Announcements
  getAnnouncements() {
    return this.announcements;
  }

  getAnnouncementById(id) {
    return this.announcements.find(a => a.id === id);
  }

  addAnnouncement(announcement) {
    const newAnn = {
      id: 'ann-' + Date.now(),
      views: 1,
      pinned: false,
      priority: announcement.priority || 'normal',
      timestamp: 'Just now',
      dateIso: new Date().toISOString(),
      tags: announcement.tags || ['Staff'],
      attachments: announcement.attachments || [],
      ...announcement
    };
    this.announcements.unshift(newAnn);
    this.saveToStorage('staffconnect_announcements', this.announcements);
    this.notify('announcements:updated', this.announcements);

    // Also trigger a notification for campus
    this.addNotification({
      title: 'New Announcement Published',
      message: `${newAnn.authorName} posted: ${newAnn.title}`,
      type: 'announcement',
      targetId: newAnn.id,
      priority: newAnn.priority === 'urgent' ? 'urgent' : 'normal',
      icon: 'megaphone'
    });

    return newAnn;
  }

  // Meetings
  getMeetings() {
    return this.meetings;
  }

  getMeetingById(id) {
    return this.meetings.find(m => m.id === id);
  }

  updateMeetingRsvp(meetingId, newStatus) {
    const meeting = this.meetings.find(m => m.id === meetingId);
    if (!meeting) return null;

    const oldStatus = meeting.userRsvp || 'pending';
    meeting.userRsvp = newStatus;

    // Adjust RSVP count numbers cleanly
    if (!meeting.rsvpCounts) {
      meeting.rsvpCounts = { attending: 0, tentative: 0, declined: 0 };
    }
    if (oldStatus && oldStatus !== 'pending' && meeting.rsvpCounts[oldStatus] > 0) {
      meeting.rsvpCounts[oldStatus]--;
    }
    if (newStatus && newStatus !== 'pending') {
      meeting.rsvpCounts[newStatus] = (meeting.rsvpCounts[newStatus] || 0) + 1;
    }

    this.saveToStorage('staffconnect_meetings', this.meetings);
    this.notify('meetings:updated', this.meetings);
    return meeting;
  }

  addMeeting(meetingData) {
    const newMtg = {
      id: 'mtg-' + Date.now(),
      attendeesCount: 1,
      userRsvp: 'attending',
      rsvpCounts: { attending: 1, tentative: 0, declined: 0 },
      priority: 'medium',
      ...meetingData
    };
    this.meetings.unshift(newMtg);
    this.saveToStorage('staffconnect_meetings', this.meetings);
    this.notify('meetings:updated', this.meetings);

    this.addNotification({
      title: 'New Meeting Scheduled',
      message: `${newMtg.title} scheduled for ${newMtg.date}`,
      type: 'meeting',
      targetId: newMtg.id,
      priority: 'normal',
      icon: 'calendar'
    });

    return newMtg;
  }

  // Polls & Voting
  getPolls() {
    return this.polls;
  }

  getPollById(id) {
    return this.polls.find(p => p.id === id);
  }

  castVote(pollId, optionId) {
    const poll = this.polls.find(p => p.id === pollId);
    if (!poll || poll.status === 'closed') return null;

    // If user previously voted on another option, decrement old
    if (poll.hasVoted && poll.userVoteOptionId) {
      const prevOpt = poll.options.find(o => o.id === poll.userVoteOptionId);
      if (prevOpt && prevOpt.votes > 0) prevOpt.votes--;
    } else {
      poll.totalVotes = (poll.totalVotes || 0) + 1;
    }

    // Increment new option
    const newOpt = poll.options.find(o => o.id === optionId);
    if (newOpt) {
      newOpt.votes = (newOpt.votes || 0) + 1;
    }

    poll.hasVoted = true;
    poll.userVoteOptionId = optionId;

    this.saveToStorage('staffconnect_polls', this.polls);
    this.notify('polls:updated', this.polls);
    return poll;
  }

  addPoll(pollData) {
    const newPoll = {
      id: 'poll-' + Date.now(),
      daysRemaining: 14,
      status: 'active',
      hasVoted: false,
      userVoteOptionId: null,
      totalVotes: 0,
      options: pollData.options.map((opt, idx) => ({
        id: `opt-${Date.now()}-${idx}`,
        label: typeof opt === 'string' ? opt : opt.label,
        votes: 0
      })),
      ...pollData
    };
    this.polls.unshift(newPoll);
    this.saveToStorage('staffconnect_polls', this.polls);
    this.notify('polls:updated', this.polls);

    this.addNotification({
      title: 'New Staff Poll Created',
      message: `Vote on: "${newPoll.title}"`,
      type: 'poll',
      targetId: newPoll.id,
      priority: 'normal',
      icon: 'vote'
    });

    return newPoll;
  }

  // Notifications
  getNotifications() {
    return this.notifications;
  }

  getUnreadNotificationsCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  markNotificationAsRead(id) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif && !notif.read) {
      notif.read = true;
      this.saveToStorage('staffconnect_notifications', this.notifications);
      this.notify('notifications:updated', this.notifications);
    }
  }

  markAllNotificationsAsRead() {
    this.notifications.forEach(n => { n.read = true; });
    this.saveToStorage('staffconnect_notifications', this.notifications);
    this.notify('notifications:updated', this.notifications);
  }

  addNotification(notifData) {
    const newNotif = {
      id: 'notif-' + Date.now(),
      timestamp: 'Just now',
      dateIso: new Date().toISOString(),
      read: false,
      ...notifData
    };
    this.notifications.unshift(newNotif);
    this.saveToStorage('staffconnect_notifications', this.notifications);
    this.notify('notifications:updated', this.notifications);
    return newNotif;
  }

  // Reset to initial demo data
  resetAllData() {
    localStorage.removeItem('staffconnect_announcements');
    localStorage.removeItem('staffconnect_meetings');
    localStorage.removeItem('staffconnect_polls');
    localStorage.removeItem('staffconnect_notifications');
    localStorage.removeItem('staffconnect_user');
    this.init();
    this.notify('data:reset', null);
  }
}

// Global store singleton
window.store = new StaffConnectStore();
