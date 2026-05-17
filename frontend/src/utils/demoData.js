export const demoEmployeeDashboard = {
  totals: {
    totalGoals: 18,
    submittedGoals: 12,
    pendingGoals: 4,
    completedGoals: 6,
  },
  quarterlyProgress: [
    { quarter: 'Q1', progressScore: 46 },
    { quarter: 'Q2', progressScore: 63 },
    { quarter: 'Q3', progressScore: 71 },
    { quarter: 'Q4', progressScore: 82 },
  ],
  recentUpdates: [
    { id: 'u1', title: 'Submitted quarterly goals', by: 'You', date: '2026-02-14' },
    { id: 'u2', title: 'Uploaded progress evidence', by: 'You', date: '2026-03-02' },
    { id: 'u3', title: 'Manager feedback received', by: 'Alex (Manager)', date: '2026-03-18' },
    { id: 'u4', title: 'Re-aligned two goals to department priorities', by: 'You', date: '2026-04-06' },
  ],
  goalStatusCards: [
    { key: 'submitted', label: 'Submitted', value: 12, badge: 'On Track' },
    { key: 'pending', label: 'Pending Review', value: 4, badge: 'Waiting' },
    { key: 'completed', label: 'Completed', value: 6, badge: 'Achieved' },
  ],
  achievementSummary: {
    achievements: [
      { title: 'Alignment', value: '92%', desc: 'Goals aligned to OKRs' },
      { title: 'Momentum', value: '76%', desc: 'Progress vs last quarter' },
      { title: 'Quality', value: '88%', desc: 'Evidence completeness' },
    ],
  },
  kpis: [
    { label: 'On-track rate', value: '83%', tone: 'good' },
    { label: 'Avg. completion', value: '71%', tone: 'info' },
    { label: 'Risk goals', value: '2', tone: 'warn' },
    { label: 'Avg. manager latency', value: '2.1 days', tone: 'neutral' },
  ],
  progressTable: {
    rows: [
      {
        id: 'g1',
        goal: 'Implement quarterly reporting automation',
        quarter: 'Q3',
        status: 'Completed',
        owner: 'You',
        progress: 100,
        updatedAt: '2026-04-20',
      },
      {
        id: 'g2',
        goal: 'Improve customer onboarding satisfaction',
        quarter: 'Q3',
        status: 'Pending',
        owner: 'You',
        progress: 68,
        updatedAt: '2026-04-14',
      },
      {
        id: 'g3',
        goal: 'Reduce incident response time',
        quarter: 'Q2',
        status: 'In Progress',
        owner: 'You',
        progress: 78,
        updatedAt: '2026-03-26',
      },
      {
        id: 'g4',
        goal: 'Launch team OKR review cadence',
        quarter: 'Q2',
        status: 'Submitted',
        owner: 'You',
        progress: 52,
        updatedAt: '2026-03-10',
      },
      {
        id: 'g5',
        goal: 'Build shared goal alignment dashboard',
        quarter: 'Q1',
        status: 'Completed',
        owner: 'You',
        progress: 100,
        updatedAt: '2026-02-08',
      },
    ],
    columns: [
      { key: 'goal', label: 'Goal' },
      { key: 'quarter', label: 'Quarter' },
      { key: 'status', label: 'Status' },
      { key: 'progress', label: 'Progress' },
      { key: 'updatedAt', label: 'Last Updated' },
    ],
  },
};

export const demoManagerDashboard = {
  team: {
    members: [
      { id: 'm1', name: 'Priya Sharma', role: 'Employee', department: 'Product', completion: 74 },
      { id: 'm2', name: 'Daniel Ruiz', role: 'Employee', department: 'Engineering', completion: 66 },
      { id: 'm3', name: 'Emily Chen', role: 'Employee', department: 'Support', completion: 81 },
      { id: 'm4', name: 'Samir Patel', role: 'Employee', department: 'Operations', completion: 59 },
    ],
  },
  pendingApprovals: [
    { id: 'p1', employeeEmail: 'priya@company.com', employee: 'Priya Sharma', manager: 'You', status: 'Awaiting Approval', quarter: 'Q3' },
    { id: 'p2', employeeEmail: 'daniel@company.com', employee: 'Daniel Ruiz', manager: 'You', status: 'Need Changes', quarter: 'Q3' },
  ],
  quarterlyCheckins: [
    { id: 'c1', title: 'Q2 check-in: coaching notes', progress: 62, quarter: 'Q2' },
    { id: 'c2', title: 'Q3 check-in: evidence review', progress: 70, quarter: 'Q3' },
    { id: 'c3', title: 'Q3 check-in: alignment adjustments', progress: 58, quarter: 'Q3' },
  ],
  teamProgress: {
    total: 42,
    onTrack: 28,
    atRisk: 9,
    overdue: 5,
    completion: 71,
  },
  employeePerformanceCards: [
    { id: 'e1', name: 'Priya Sharma', completion: 74, trend: '+6%', tone: 'good' },
    { id: 'e2', name: 'Daniel Ruiz', completion: 66, trend: '-2%', tone: 'warn' },
    { id: 'e3', name: 'Emily Chen', completion: 81, trend: '+4%', tone: 'good' },
    { id: 'e4', name: 'Samir Patel', completion: 59, trend: '-5%', tone: 'neutral' },
  ],
  departmentSummary: [
    { id: 'd1', department: 'Product', completion: 77, pending: 2 },
    { id: 'd2', department: 'Engineering', completion: 69, pending: 3 },
    { id: 'd3', department: 'Support', completion: 82, pending: 1 },
    { id: 'd4', department: 'Operations', completion: 60, pending: 2 },
  ],
};

export const demoAdminDashboard = {
  totals: {
    totalEmployees: 214,
    totalManagers: 18,
    completionPercent: 78,
    activeCycle: 'Q3 2026',
    pendingEscalations: 3,
    reportsGenerated: 128,
    auditActivity: 54,
  },
};

export const demoAnalytics = {
  labelsQuarter: ['Q1', 'Q2', 'Q3', 'Q4'],
  departmentCompletion: [
    { department: 'Product', value: 82 },
    { department: 'Engineering', value: 74 },
    { department: 'Support', value: 88 },
    { department: 'Operations', value: 69 },
  ],
  employeeProgress: [
    { employee: 'Priya Sharma', value: 74 },
    { employee: 'Daniel Ruiz', value: 66 },
    { employee: 'Emily Chen', value: 81 },
    { employee: 'Samir Patel', value: 59 },
  ],
  sharedGoalsDistribution: [
    { label: 'Cross-team', value: 42 },
    { label: 'Department-wide', value: 28 },
    { label: 'Strategic initiative', value: 19 },
    { label: 'Operational', value: 11 },
  ],
  managerEffectiveness: [
    { manager: 'Alex (Manager)', score: 86 },
    { manager: 'Morgan (Manager)', score: 79 },
    { manager: 'Taylor (Manager)', score: 91 },
  ],
  goalCategoryDistribution: [
    { category: 'Delivery', value: 33 },
    { category: 'Quality', value: 24 },
    { category: 'Customer', value: 21 },
    { category: 'Operations', value: 22 },
  ],
  monthlyCheckins: {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [38, 44, 51, 56, 60, 68],
  },
  pendingApprovals: {
    statuses: ['Awaiting', 'Need Changes', 'Returned'],
    values: [12, 7, 4],
  },
  cycleCompletion: [
    { quarter: 'Q1', completed: 62, total: 80 },
    { quarter: 'Q2', completed: 71, total: 86 },
    { quarter: 'Q3', completed: 78, total: 92 },
    { quarter: 'Q4', completed: 84, total: 98 },
  ],
};

export const demoLogin = {
  credentials: {
    // match seeded users in backend/seed.js
    employee: { email: 'alice@company.com', password: 'Employee1@1234' },
    manager: { email: 'manager1@company.com', password: 'Manager1@1234' },
    admin: { email: 'admin@company.com', password: 'Admin@1234' },
  },
};

