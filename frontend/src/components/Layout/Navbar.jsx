import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext.jsx';
import ProfileMenu from './ProfileMenu.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const Navbar = ({ user, onLogout, notifications }) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">In-House Goal Portal</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Role: {user?.role}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
            Notifications <span className="rounded-full bg-indigo-600 px-2 py-1 text-xs font-semibold text-white">{notifications?.length || 0}</span>
          </button>
          <ThemeToggle darkMode={darkMode} />
          <ProfileMenu user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
