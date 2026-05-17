import { useEffect, useState } from 'react';
import { fetchDashboard, fetchPendingReports } from '../../api/boards.js';
import Card from '../../components/ui/Card.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

const Reports = () => {
  const [dashboard, setDashboard] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const summary = await fetchDashboard();
        const pendingList = await fetchPendingReports();
        setDashboard(summary);
        setPending(pendingList);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card title="Admin Reports Summary">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Employees</div>
            <div className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{dashboard.totalEmployees}</div>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Approved Sheets</div>
            <div className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{dashboard.approvedSheets}</div>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Pending</div>
            <div className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{dashboard.pendingTasks}</div>
          </div>
        </div>
      </Card>

      <Card title="Pending User Reports">
        <div className="space-y-4">
          {pending.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No pending reports at this time.</p>
          ) : (
            pending.map((item) => (
              <div key={item.employeeEmail} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="font-semibold text-slate-900 dark:text-slate-100">{item.employee}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Manager: {item.manager}</div>
                <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">Status: {item.status}</div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default Reports;
