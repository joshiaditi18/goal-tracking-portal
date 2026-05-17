const ProfileMenu = ({ user, onLogout }) => {
  return (
    <div className="relative">
      <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-800 dark:bg-slate-800 dark:text-slate-100">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-300 text-sm font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-100">{user?.name?.charAt(0)}</span>
        <div className="hidden sm:block">
          <div className="font-semibold">{user?.name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</div>
        </div>
      </div>
      <button
        onClick={onLogout}
        className="mt-2 w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        Logout
      </button>
    </div>
  );
};

export default ProfileMenu;
