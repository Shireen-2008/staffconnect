/**
 * StaffConnect - Profile & Settings View
 * Manage faculty credentials, office hours, research bio, courses taught, and preferences.
 */

const ProfileView = {
  render(container) {
    const user = window.store.getCurrentUser();
    if (!user) return;

    container.innerHTML = `
      <div class="view-header">
        <div class="view-header-content">
          <h1 class="view-title">Faculty & Staff Profile</h1>
          <p class="view-subtitle">Manage your institutional identity, student office hours, academic curriculum, and notification settings.</p>
        </div>
        <div class="view-header-actions">
          <button class="btn btn-secondary" onclick="ProfileView.resetDataPrompt()">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
            Reset Demo Data
          </button>
          <button class="btn btn-primary" onclick="ProfileView.saveProfileForm()">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            Save Profile Changes
          </button>
        </div>
      </div>

      <div class="profile-layout-grid">
        <!-- Left Column: Identity Card -->
        <div class="profile-sidebar-card">
          <div class="card p-4 text-center">
            <div class="profile-avatar-large" id="profile-avatar-display" style="background: ${user.avatarBg || 'var(--color-primary)'}">
              ${user.avatarText || user.name.slice(0, 2).toUpperCase()}
            </div>

            <h3 class="profile-card-name mt-3" id="profile-name-display">${user.name}</h3>
            <p class="profile-card-title text-muted" id="profile-title-display">${user.title}</p>
            <div class="badge badge-indigo mt-1" id="profile-dept-display">${user.department}</div>

            <hr class="profile-divider my-4">

            <div class="profile-contact-list">
              <div class="profile-contact-row">
                <svg class="icon-sm text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span class="text-truncate">${user.email}</span>
              </div>
              <div class="profile-contact-row">
                <svg class="icon-sm text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span>${user.phone || '+1 (555) 000-0000'}</span>
              </div>
              <div class="profile-contact-row">
                <svg class="icon-sm text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>${user.office}</span>
              </div>
              <div class="profile-contact-row">
                <svg class="icon-sm text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                <span>ID: <code class="font-mono">${user.employeeId}</code></span>
              </div>
            </div>

            <div class="mt-4 p-3 bg-subtle rounded-3 text-start">
              <span class="fw-semibold d-block text-muted text-xs mb-1">CURRENT OFFICE HOURS</span>
              <span class="text-sm fw-medium text-emerald" id="profile-hours-display">
                ${user.officeHours}
              </span>
            </div>
          </div>
        </div>

        <!-- Right Column: Edit Profile Form & Preferences -->
        <div class="profile-form-column">
          <form id="profile-form" onsubmit="event.preventDefault(); ProfileView.saveProfileForm();">
            <!-- Academic Information Card -->
            <div class="card mb-4">
              <div class="card-header">
                <h3 class="card-title">Academic & Office Information</h3>
                <span class="card-subtitle">Publicly displayed in student directories and department schedules</span>
              </div>
              <div class="card-body">
                <div class="form-row-2">
                  <div class="form-group">
                    <label class="form-label" for="prof-name">Full Name & Honorific</label>
                    <input type="text" id="prof-name" class="form-control" value="${user.name}" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="prof-title">Academic Title / Role</label>
                    <input type="text" id="prof-title" class="form-control" value="${user.title}" required>
                  </div>
                </div>

                <div class="form-row-2 mt-3">
                  <div class="form-group">
                    <label class="form-label" for="prof-department">Academic Department</label>
                    <input type="text" id="prof-department" class="form-control" value="${user.department}" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="prof-office">Campus Office Location</label>
                    <input type="text" id="prof-office" class="form-control" value="${user.office}" required>
                  </div>
                </div>

                <div class="form-row-2 mt-3">
                  <div class="form-group">
                    <label class="form-label" for="prof-hours">Student Office Hours</label>
                    <input type="text" id="prof-hours" class="form-control" value="${user.officeHours}" placeholder="e.g. Mon & Wed 2:00 PM - 4:30 PM">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="prof-phone">Direct Contact Phone</label>
                    <input type="text" id="prof-phone" class="form-control" value="${user.phone}">
                  </div>
                </div>

                <div class="form-group mt-3">
                  <label class="form-label" for="prof-subjects">Courses / Subjects Currently Instructed</label>
                  <input type="text" id="prof-subjects" class="form-control" value="${user.subjects ? user.subjects.join(', ') : ''}" placeholder="Separate courses with commas">
                  <small class="text-muted">Separate multiple courses or subjects with commas</small>
                </div>

                <div class="form-group mt-3">
                  <label class="form-label" for="prof-bio">Academic Biography & Research Focus</label>
                  <textarea id="prof-bio" class="form-control" rows="4">${user.bio || ''}</textarea>
                </div>
              </div>
            </div>

            <!-- Portal Notification & Alerts Preferences -->
            <div class="card mb-4">
              <div class="card-header">
                <h3 class="card-title">Notification & Dispatch Preferences</h3>
                <span class="card-subtitle">Control how and when you receive collegiate updates</span>
              </div>
              <div class="card-body">
                <div class="pref-toggle-list">
                  <div class="pref-toggle-item">
                    <div class="pref-toggle-text">
                      <div class="pref-title">Urgent Campus Alerts</div>
                      <div class="pref-desc">Receive immediate browser alerts for campus emergencies or crucial deadlines.</div>
                    </div>
                    <label class="switch">
                      <input type="checkbox" id="pref-urgent" ${user.preferences?.urgentAlerts ? 'checked' : ''}>
                      <span class="slider round"></span>
                    </label>
                  </div>

                  <div class="pref-toggle-item">
                    <div class="pref-toggle-text">
                      <div class="pref-title">Meeting & Assembly Reminders</div>
                      <div class="pref-desc">Receive notices 1 hour prior to scheduled Senate sessions and committee syncs.</div>
                    </div>
                    <label class="switch">
                      <input type="checkbox" id="pref-meetings" ${user.preferences?.meetingReminders ? 'checked' : ''}>
                      <span class="slider round"></span>
                    </label>
                  </div>

                  <div class="pref-toggle-item">
                    <div class="pref-toggle-text">
                      <div class="pref-title">Faculty Senate Ballot Invitations</div>
                      <div class="pref-desc">Notify whenever a new institutional poll or referendum opens for staff vote.</div>
                    </div>
                    <label class="switch">
                      <input type="checkbox" id="pref-polls" ${user.preferences?.pollInvitations ? 'checked' : ''}>
                      <span class="slider round"></span>
                    </label>
                  </div>

                  <div class="pref-toggle-item">
                    <div class="pref-toggle-text">
                      <div class="pref-title">Daily Campus Digest</div>
                      <div class="pref-desc">Consolidate general non-urgent announcements into a single morning overview.</div>
                    </div>
                    <label class="switch">
                      <input type="checkbox" id="pref-digest" ${user.preferences?.emailDigest ? 'checked' : ''}>
                      <span class="slider round"></span>
                    </label>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-top d-flex justify-content-end">
                  <button type="button" class="btn btn-primary" onclick="ProfileView.saveProfileForm()">
                    Save All Profile Settings
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  saveProfileForm() {
    const name = document.getElementById('prof-name').value.trim();
    const title = document.getElementById('prof-title').value.trim();
    const department = document.getElementById('prof-department').value.trim();
    const office = document.getElementById('prof-office').value.trim();
    const officeHours = document.getElementById('prof-hours').value.trim();
    const phone = document.getElementById('prof-phone').value.trim();
    const subjectsRaw = document.getElementById('prof-subjects').value.trim();
    const bio = document.getElementById('prof-bio').value.trim();

    const urgentAlerts = document.getElementById('pref-urgent').checked;
    const meetingReminders = document.getElementById('pref-meetings').checked;
    const pollInvitations = document.getElementById('pref-polls').checked;
    const emailDigest = document.getElementById('pref-digest').checked;

    if (!name || !title) {
      window.App.showToast('Please provide your name and academic title.', 'error');
      return;
    }

    const subjects = subjectsRaw ? subjectsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

    const updatedUser = window.store.updateUserProfile({
      name,
      title,
      department,
      office,
      officeHours,
      phone,
      subjects,
      bio,
      avatarText: name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      preferences: {
        urgentAlerts,
        meetingReminders,
        pollInvitations,
        emailDigest
      }
    });

    // Update left card displays immediately
    const nameDisplay = document.getElementById('profile-name-display');
    const titleDisplay = document.getElementById('profile-title-display');
    const deptDisplay = document.getElementById('profile-dept-display');
    const hoursDisplay = document.getElementById('profile-hours-display');
    const avatarDisplay = document.getElementById('profile-avatar-display');

    if (nameDisplay) nameDisplay.textContent = updatedUser.name;
    if (titleDisplay) titleDisplay.textContent = updatedUser.title;
    if (deptDisplay) deptDisplay.textContent = updatedUser.department;
    if (hoursDisplay) hoursDisplay.textContent = updatedUser.officeHours;
    if (avatarDisplay) avatarDisplay.textContent = updatedUser.avatarText;

    window.App.showToast('Profile and settings successfully saved!', 'success');
  },

  resetDataPrompt() {
    window.App.showModal({
      title: 'Reset Demo Data to Factory Defaults?',
      content: `
        <div class="text-center p-3">
          <p class="text-muted">This will restore all default college announcements, meetings, polls, and reset faculty profiles to initial demo state.</p>
          <div class="d-flex justify-content-center gap-2 mt-4">
            <button class="btn btn-secondary" onclick="window.App.closeModal()">Cancel</button>
            <button class="btn btn-danger" onclick="window.store.resetAllData(); window.App.closeModal(); window.App.showToast('Demo data restored!', 'info'); window.App.navigateTo('dashboard');">
              Yes, Reset Everything
            </button>
          </div>
        </div>
      `
    });
  }
};

window.ProfileView = ProfileView;
