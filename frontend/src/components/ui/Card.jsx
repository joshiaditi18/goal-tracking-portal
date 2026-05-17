const Card = ({ title, children }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
    {title && <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>}
    {children}
  </div>
);
export default Card;
