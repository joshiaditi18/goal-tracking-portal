const Button = ({ children, variant = 'primary', ...props }) => {
  const styles = {
    primary: 'rounded-xl bg-indigo-600 px-5 py-3 text-white transition hover:bg-indigo-700',
    secondary: 'rounded-xl border border-slate-300 bg-white px-5 py-3 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800',
    danger: 'rounded-xl border border-red-500 bg-red-500 px-5 py-3 text-white transition hover:bg-red-600',
  };

  return (
    <button className={styles[variant]} {...props}>
      {children}
    </button>
  );
};

export default Button;
