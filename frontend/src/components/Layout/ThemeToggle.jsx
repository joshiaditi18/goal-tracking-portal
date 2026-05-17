const ThemeToggle = ({ darkMode }) => {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
      onClick={() => window.dispatchEvent(new CustomEvent('toggle-theme'))}
    >
      {darkMode ? 'Light' : 'Dark'}
    </button>
  );
};

export default ThemeToggle;
