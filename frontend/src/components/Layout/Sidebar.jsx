import { NavLink } from 'react-router-dom';

const navItems = (user) => [
  { label: 'Dashboard', to: user?.role === 'manager' ? '/manager/dashboard' : user?.role === 'admin' ? '/admin/dashboard' : '/dashboard', roles: ['employee', 'manager', 'admin'] },
  { label: 'Create Goal Sheet', to: '/employee/create-goal-sheet', roles: ['employee'] },
  { label: 'Draft Goals', to: '/employee/draft-goals', roles: ['employee'] },
  { label: 'Submit Goals', to: '/employee/submit-goals', roles: ['employee'] },
  { label: 'Quarterly Updates', to: '/employee/quarterly-updates', roles: ['employee'] },
  { label: 'Status Tracking', to: '/employee/status-tracking', roles: ['employee'] },
  { label: 'Goal History', to: '/employee/goal-history', roles: ['employee'] },
  { label: 'Team Review', to: '/manager/team-review', roles: ['manager'] },
  { label: 'Goal Approval', to: '/manager/goal-approval', roles: ['manager'] },
  { label: 'Shared Goals', to: '/manager/shared-goals', roles: ['manager'] },
  { label: 'Quarterly Check-in', to: '/manager/quarterly-checkin', roles: ['manager'] },
  { label: 'Team Analytics', to: '/manager/team-analytics', roles: ['manager'] },
  { label: 'Admin Reports', to: '/admin/reports', roles: ['admin'] },
  { label: 'Cycle Management', to: '/admin/cycles', roles: ['admin'] },
  { label: 'User Management', to: '/admin/user-management', roles: ['admin'] },
  { label: 'Audit Trail', to: '/admin/audit', roles: ['admin'] },
  { label: 'Goal Unlock', to: '/admin/goal-unlock', roles: ['admin'] },
  { label: 'Report Center', to: '/admin/report-center', roles: ['admin'] },
  { label: 'Admin Analytics', to: '/admin/analytics', roles: ['admin'] },
];

const Sidebar = ({ user }) => {
  return (
    <aside className="hidden md:flex md:w-72 md:flex-col md:gap-4 md:border-r md:border-slate-200 md:bg-white md:p-5 dark:md:border-slate-800 dark:md:bg-slate-950">
      <div className="mb-6 px-2 text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Menu</div>
      <nav className="flex flex-col gap-2">
        {navItems(user).filter((item) => item.roles.includes(user?.role)).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive ? 'bg-slate-900 text-white dark:bg-slate-700 dark:text-white' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
