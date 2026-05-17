const Skeleton = ({ className = 'h-4 w-full' }) => (
  <div className={`animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800 ${className}`} />
);

export default Skeleton;

