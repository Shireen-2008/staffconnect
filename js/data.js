/**
 * StaffConnect - Sample & Demo Data
 * Preloaded mock data for Crestview College faculty and staff portal.
 */

const DEMO_USERS = [
  {
    id: 'usr-101',
    name: 'Dr. Eleanor Vance',
    title: 'Dean of Computer Science & Engineering',
    role: 'Dean / Professor',
    email: 'eleanor.vance@crestview.edu',
    password: 'password123',
    department: 'Computer Science',
    departmentId: 'dept-cs',
    office: 'Tech Hall, Room 402',
    officeHours: 'Mon & Wed 2:00 PM – 4:30 PM',
    phone: '+1 (555) 382-9011',
    employeeId: 'EMP-78401',
    avatarBg: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
    avatarText: 'EV',
    bio: 'Professor and researcher specializing in distributed algorithms and ethical AI. Leading the modern computing curriculum committee at Crestview College with 14+ years of higher education leadership.',
    subjects: ['CS 401: Distributed Systems', 'CS 512: Ethical AI Architectures', 'CS 320: Advanced Algorithms'],
    emergencyContact: 'Robert Vance (+1 555-908-1123)',
    preferences: {
      emailDigest: true,
      urgentAlerts: true,
      meetingReminders: true,
      pollInvitations: true
    }
  },
  {
    id: 'usr-102',
    name: 'Prof. Marcus Chen',
    title: 'Associate Professor of Cybersecurity',
    role: 'Associate Professor',
    email: 'marcus.chen@crestview.edu',
    password: 'password123',
    department: 'Computer Science',
    departmentId: 'dept-cs',
    office: 'Tech Hall, Room 318',
    officeHours: 'Tue & Thu 10:00 AM – 12:30 PM',
    phone: '+1 (555) 441-2099',
    employeeId: 'EMP-82914',
    avatarBg: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
    avatarText: 'MC',
    bio: 'Lead coordinator for the National Cyber Defense research lab. Passionate about zero-trust security architectures and mentoring undergraduate capstone cohorts.',
    subjects: ['CS 380: Network Security', 'CS 490: Capstone Defense Project'],
    emergencyContact: 'Linda Chen (+1 555-321-7788)',
    preferences: {
      emailDigest: false,
      urgentAlerts: true,
      meetingReminders: true,
      pollInvitations: true
    }
  },
  {
    id: 'usr-103',
    name: 'Dr. Sarah Jenkins',
    title: 'Department Chair & Professor of Mathematics',
    role: 'Department Chair',
    email: 'sarah.jenkins@crestview.edu',
    password: 'password123',
    department: 'Mathematics & Statistics',
    departmentId: 'dept-math',
    office: 'Science Complex, Suite 310',
    officeHours: 'Mon & Fri 1:00 PM – 3:30 PM',
    phone: '+1 (555) 872-3341',
    employeeId: 'EMP-61204',
    avatarBg: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    avatarText: 'SJ',
    bio: 'Senior researcher in Bayesian statistical models and stochastic calculus. Serving as Department Chair for 6 consecutive semesters.',
    subjects: ['MATH 240: Linear Algebra', 'STAT 410: Applied Bayesian Statistics'],
    emergencyContact: 'David Jenkins (+1 555-667-8901)',
    preferences: {
      emailDigest: true,
      urgentAlerts: true,
      meetingReminders: true,
      pollInvitations: false
    }
  },
  {
    id: 'usr-104',
    name: 'Elena Rostova',
    title: 'Director of Academic Personnel & HR',
    role: 'Staff Administrator',
    email: 'elena.rostova@crestview.edu',
    password: 'password123',
    department: 'Human Resources & Administration',
    departmentId: 'dept-hr',
    office: 'Administration Building, Suite 104',
    officeHours: 'Mon – Fri 9:00 AM – 5:00 PM',
    phone: '+1 (555) 211-9870',
    employeeId: 'EMP-51092',
    avatarBg: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
    avatarText: 'ER',
    bio: 'Overseeing faculty development, institutional onboarding, college benefits compliance, and annual academic senate nominations.',
    subjects: ['Staff Professional Development Seminar Series'],
    emergencyContact: 'Michael Rostova (+1 555-882-3490)',
    preferences: {
      emailDigest: true,
      urgentAlerts: true,
      meetingReminders: true,
      pollInvitations: true
    }
  }
];

const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Mandatory Grade Submission Deadline: Fall Midterms 2026',
    category: 'Academic Affairs',
    priority: 'urgent',
    pinned: true,
    authorName: 'Office of the Registrar',
    authorRole: 'Academic Administration',
    authorAvatar: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
    authorInitials: 'REG',
    timestamp: 'Today at 08:30 AM',
    dateIso: '2026-09-04T08:30:00Z',
    views: 184,
    content: `All faculty members and teaching assistants are reminded that mid-term grade submissions for the Fall 2026 term close this Friday at 11:59 PM sharp.\n\nPlease ensure all grade books in the SIS portal are fully synchronized. Students with incomplete attendance records must be flagged immediately for academic counseling outreach. If you experience system delays, contact the Registrar Helpdesk at ext. 4200.`,
    tags: ['Grades', 'Deadline', 'Academic Policy'],
    attachments: [
      { name: 'Fall_2026_Grade_Submission_Protocol.pdf', size: '2.4 MB' }
    ]
  },
  {
    id: 'ann-2',
    title: 'Campus Fiber Network Maintenance & LMS Brief Downtime',
    category: 'IT & Facilities',
    priority: 'normal',
    pinned: true,
    authorName: 'Central IT Infrastructure',
    authorRole: 'IT Operations',
    authorAvatar: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    authorInitials: 'IT',
    timestamp: 'Yesterday at 04:15 PM',
    dateIso: '2026-09-03T16:15:00Z',
    views: 246,
    content: `Central IT will be performing scheduled core router maintenance and fiber link upgrades on Saturday, September 6th between 01:00 AM and 04:00 AM.\n\nDuring this window, the StaffConnect portal and Canvas LMS will experience intermittent connectivity drops. All scheduled course assignments should avoid submission deadlines during this maintenance window.`,
    tags: ['IT Maintenance', 'Canvas LMS', 'Network'],
    attachments: []
  },
  {
    id: 'ann-3',
    title: 'Call for Proposals: Annual Crestview Faculty Research Symposium',
    category: 'Research & Grants',
    priority: 'normal',
    pinned: false,
    authorName: 'Dr. Sarah Jenkins',
    authorRole: 'Department Chair, Mathematics',
    authorAvatar: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    authorInitials: 'SJ',
    timestamp: 'Sep 2, 2026 at 11:00 AM',
    dateIso: '2026-09-02T11:00:00Z',
    views: 310,
    content: `The Research Council invites submissions for oral presentations, interdisciplinary poster sessions, and panel proposals for the upcoming 18th Annual Crestview Faculty Research Symposium.\n\nKeynote speaker this year will be Dr. Aris Thorne from MIT CSAIL on "Next-Generation Quantum-Safe Computing". Faculty grant seed funding of up to $25,000 per accepted research track will be awarded.`,
    tags: ['Symposium', 'Research Grants', 'Call for Papers'],
    attachments: [
      { name: 'Research_Symposium_Call_2026.pdf', size: '1.8 MB' },
      { name: 'Seed_Grant_Application_Template.docx', size: '420 KB' }
    ]
  },
  {
    id: 'ann-4',
    title: 'Staff Health & Wellness Benefit Enrollment Window Now Open',
    category: 'Human Resources',
    priority: 'normal',
    pinned: false,
    authorName: 'Elena Rostova',
    authorRole: 'Director of HR',
    authorAvatar: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
    authorInitials: 'ER',
    timestamp: 'Aug 30, 2026 at 09:15 AM',
    dateIso: '2026-08-30T09:15:00Z',
    views: 412,
    content: `Open enrollment for annual comprehensive faculty and staff dental, vision, and mental wellness coverage is available through the HR Benefits self-service portal until the end of the month.\n\nInformational Q&A webinars will be held every Thursday at 12:00 PM via Zoom. Check the portal for plan comparison documents and dependent coverage options.`,
    tags: ['Benefits', 'Health', 'HR Portal'],
    attachments: [
      { name: '2026-2027_Benefits_Summary_Guide.pdf', size: '3.1 MB' }
    ]
  },
  {
    id: 'ann-5',
    title: 'Faculty Parking Lot B Resurfacing Notice',
    category: 'IT & Facilities',
    priority: 'low',
    pinned: false,
    authorName: 'Campus Facilities Office',
    authorRole: 'Facilities Coordinator',
    authorAvatar: 'linear-gradient(135deg, #64748b 0%, #334155 100%)',
    authorInitials: 'FAC',
    timestamp: 'Aug 28, 2026 at 02:20 PM',
    dateIso: '2026-08-28T14:20:00Z',
    views: 156,
    content: `Faculty Parking Lot B adjacent to the Science Complex will be closed for repaving and EV charger installation from next Monday through Wednesday. Please utilize Lot C or the East Multi-story Garage during this period. Faculty parking permits remain valid across all lots.`,
    tags: ['Facilities', 'Parking', 'Campus'],
    attachments: []
  }
];

const INITIAL_MEETINGS = [
  {
    id: 'mtg-1',
    title: 'Faculty Senate General Assembly',
    department: 'Academic Senate',
    date: '2026-09-05', // Tomorrow
    time: '02:00 PM – 03:30 PM',
    location: 'Auditorium Hall A & Zoom Hybrid',
    virtualLink: 'https://meet.crestview.edu/senate-general',
    type: 'Hybrid',
    host: 'Dr. Arthur Sterling (Senate President)',
    attendeesCount: 48,
    agenda: '1. Approval of Previous Minutes\n2. Provost Address on 2027 Strategic Plan\n3. Vote on Curriculum Modernization Policy\n4. Departmental Open Floor',
    userRsvp: 'attending', // 'attending' | 'tentative' | 'declined' | 'pending'
    rsvpCounts: { attending: 38, tentative: 6, declined: 4 },
    category: 'governance',
    priority: 'high'
  },
  {
    id: 'mtg-2',
    title: 'CS & Engineering Curriculum Modernization Working Group',
    department: 'Computer Science',
    date: '2026-09-05', // Tomorrow
    time: '10:00 AM – 11:15 AM',
    location: 'Tech Hall, Conference Suite 4B',
    virtualLink: 'https://meet.crestview.edu/cs-curriculum-review',
    type: 'In-Person',
    host: 'Dr. Eleanor Vance (Dean)',
    attendeesCount: 9,
    agenda: 'Review revised syllabi for CS 401 & CS 512. Establish prerequisite alignment for incoming Spring cohort and approve hardware lab allocation.',
    userRsvp: 'attending',
    rsvpCounts: { attending: 8, tentative: 1, declined: 0 },
    category: 'department',
    priority: 'medium'
  },
  {
    id: 'mtg-3',
    title: 'Interdisciplinary AI & Ethics Research Collaboration',
    department: 'Cross-Departmental',
    date: '2026-09-08',
    time: '01:30 PM – 02:45 PM',
    location: 'Science Complex, Seminar Room 102',
    virtualLink: 'https://meet.crestview.edu/ai-ethics-grant',
    type: 'Hybrid',
    host: 'Prof. Marcus Chen & Dr. Vance',
    attendeesCount: 14,
    agenda: 'Formulation of joint NSF grant proposal on Algorithmic Transparency. Division of section writing and institutional co-investigator signoffs.',
    userRsvp: 'pending',
    rsvpCounts: { attending: 10, tentative: 3, declined: 1 },
    category: 'research',
    priority: 'high'
  },
  {
    id: 'mtg-4',
    title: 'Academic Staff Mentorship & Advisory Council',
    department: 'Human Resources & Administration',
    date: '2026-09-10',
    time: '03:00 PM – 04:00 PM',
    location: 'Administration Building, Boardroom 2',
    virtualLink: 'https://meet.crestview.edu/staff-mentorship',
    type: 'In-Person',
    host: 'Elena Rostova (Director of HR)',
    attendeesCount: 18,
    agenda: 'Mid-term check-in with junior faculty mentors, review of new tenure-track orientation feedback, and scheduling of upcoming leadership retreats.',
    userRsvp: 'tentative',
    rsvpCounts: { attending: 12, tentative: 4, declined: 2 },
    category: 'staff',
    priority: 'medium'
  },
  {
    id: 'mtg-5',
    title: 'College IT Security Council: Multi-Factor Policy Review',
    department: 'Central IT',
    date: '2026-09-12',
    time: '11:00 AM – 12:00 PM',
    location: 'Virtual Only (Zoom)',
    virtualLink: 'https://meet.crestview.edu/it-security-mfa',
    type: 'Virtual',
    host: 'Central IT Security Directorate',
    attendeesCount: 22,
    agenda: 'Implementation timeline for hardware security keys for faculty accessing student PII, SIS backend hardening, and phishing resilience drills.',
    userRsvp: 'pending',
    rsvpCounts: { attending: 16, tentative: 5, declined: 1 },
    category: 'it',
    priority: 'low'
  }
];

const INITIAL_POLLS = [
  {
    id: 'poll-1',
    title: 'Proposed Academic Calendar Adjustment for Academic Year 2027',
    description: 'Faculty Senate vote to determine start dates and break lengths to better accommodate regional intercollegiate conferences and research symposia.',
    creator: 'Dr. Arthur Sterling (Senate President)',
    category: 'Academic Governance',
    endDate: '2026-09-15',
    daysRemaining: 11,
    status: 'active',
    hasVoted: false,
    userVoteOptionId: null,
    totalVotes: 87,
    options: [
      { id: 'opt-1', label: 'Option A: Early Start (Jan 8) with 2-week Mid-Spring Recess', votes: 42 },
      { id: 'opt-2', label: 'Option B: Standard Start (Jan 19) with 1-week Spring Break', votes: 31 },
      { id: 'opt-3', label: 'Option C: Retain Existing Structure with Extended Reading Week', votes: 14 }
    ]
  },
  {
    id: 'poll-2',
    title: 'Faculty Computing Equipment Cycle 2026–2028 Platform Preference',
    description: 'Central IT budget allocation committee is surveying full-time faculty for standard issue hardware bundles before contract renewal.',
    creator: 'Central IT Procurement',
    category: 'Campus Technology',
    endDate: '2026-09-10',
    daysRemaining: 6,
    status: 'active',
    hasVoted: true,
    userVoteOptionId: 'opt-apple',
    totalVotes: 134,
    options: [
      { id: 'opt-apple', label: 'Apple MacBook Pro M3 (16GB/512GB) Workstation Package', votes: 76 },
      { id: 'opt-dell', label: 'Dell XPS 15 / Precision Developer Edition (Linux/Windows)', votes: 45 },
      { id: 'opt-thinkpad', label: 'Lenovo ThinkPad X1 Carbon Series (Ultraportable)', votes: 13 }
    ]
  },
  {
    id: 'poll-3',
    title: 'Theme & Keynote Focus for Spring 2027 Faculty Development Day',
    description: 'Help the Faculty Center for Teaching Excellence select our primary institutional theme for interactive workshops.',
    creator: 'Elena Rostova (HR & Development)',
    category: 'Staff Development',
    endDate: '2026-09-20',
    daysRemaining: 16,
    status: 'active',
    hasVoted: false,
    userVoteOptionId: null,
    totalVotes: 59,
    options: [
      { id: 'opt-ai', label: 'Generative AI Pedagogies & Authentic Academic Assessment', votes: 34 },
      { id: 'opt-mental', label: 'Student Mental Wellbeing & Trauma-Informed Instruction', votes: 16 },
      { id: 'opt-grants', label: 'Federal Grant Writing & Corporate Research Partnerships', votes: 9 }
    ]
  },
  {
    id: 'poll-4',
    title: 'Campus Faculty Dining Hall Menu & Dietary Inclusivity Review',
    description: 'Closed survey regarding expanded plant-based, halal, and kosher hot meal rotations at the Faculty Club.',
    creator: 'Campus Dining Services',
    category: 'Campus Life',
    endDate: '2026-08-25',
    daysRemaining: 0,
    status: 'closed',
    hasVoted: true,
    userVoteOptionId: 'opt-support',
    totalVotes: 162,
    options: [
      { id: 'opt-support', label: 'Strongly Support Daily Expanded Dietary Selections', votes: 118 },
      { id: 'opt-neutral', label: 'Neutral / Occasional Visitor', votes: 32 },
      { id: 'opt-oppose', label: 'Prefer Existing Traditional Buffet Roster', votes: 12 }
    ]
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'New Announcement Posted',
    message: 'Registrar posted: Mandatory Grade Submission Deadline for Fall Midterms.',
    type: 'announcement',
    targetId: 'ann-1',
    timestamp: '25 mins ago',
    dateIso: '2026-09-04T08:35:00Z',
    read: false,
    priority: 'urgent',
    icon: 'megaphone'
  },
  {
    id: 'notif-2',
    title: 'Meeting Tomorrow Morning',
    message: 'CS & Engineering Curriculum Modernization begins tomorrow at 10:00 AM.',
    type: 'meeting',
    targetId: 'mtg-2',
    timestamp: '1 hour ago',
    dateIso: '2026-09-04T08:00:00Z',
    read: false,
    priority: 'high',
    icon: 'calendar'
  },
  {
    id: 'notif-3',
    title: 'New Staff Poll Available',
    message: 'Faculty Senate has opened voting on: Proposed Academic Calendar Adjustment.',
    type: 'poll',
    targetId: 'poll-1',
    timestamp: '3 hours ago',
    dateIso: '2026-09-04T06:00:00Z',
    read: false,
    priority: 'normal',
    icon: 'vote'
  },
  {
    id: 'notif-4',
    title: 'RSVP Confirmation',
    message: 'Prof. Marcus Chen confirmed attendance for CS Curriculum Working Group.',
    type: 'meeting',
    targetId: 'mtg-2',
    timestamp: 'Yesterday at 5:20 PM',
    dateIso: '2026-09-03T17:20:00Z',
    read: true,
    priority: 'normal',
    icon: 'users'
  },
  {
    id: 'notif-5',
    title: 'Research Council Grant Call',
    message: 'Dr. Sarah Jenkins published the Call for Proposals for the 18th Research Symposium.',
    type: 'announcement',
    targetId: 'ann-3',
    timestamp: '2 days ago',
    dateIso: '2026-09-02T11:05:00Z',
    read: true,
    priority: 'normal',
    icon: 'award'
  }
];

const QUICK_CAMPUS_STATS = {
  activeFacultyCount: 248,
  activeStaffCount: 165,
  currentTerm: 'Fall Semester 2026',
  campusTermWeek: 'Week 4 of 16',
  campusStatus: 'Normal Operations (All Campuses Open)'
};
