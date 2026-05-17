import { useEffect, useMemo, useState } from 'react';
import { fetchAdminDashboard } from '../../api/admin.js';
import Card from '../../components/ui/Card.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import DemoAnalyticsCharts from '../../components/charts/DemoAnalyticsCharts.jsx';
import { demoAdminDashboard, demoAnalytics } from '../../utils/demoData.js';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchAdminDashboard();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const effective = useMemo(() => {
    const has = stats && typeof stats === 'object';
    return {
      totals: {
        totalEmployees: has ? stats.totalEmployees ?? demoAdminDashboard.totals.totalEmployees : demoAdminDashboard.totals.totalEmployees,
        approvedSheets: has ? stats.approvedSheets ?? 0 : demoAdminDashboard.totals.reportsGenerated,
        pendingTasks: has ? stats.pendingTasks ?? 0 : demoAdminDashboard.totals.pendingEscalations + 10,
        employeeCompletion: has ? stats.employeeCompletion ?? demoAdminDashboard.totals.completionPercent : demoAdminDashboard.totals.completionPercent,
        managerCompletion: has ? stats.managerCompletion ?? 0 : Math.max(60, demoAdminDashboard.totals.completionPercent - 5),
      },
      charts: has ? stats : demoAnalytics,
    };
  }, [stats]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card title="Admin Analytics">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track adoption, approval velocity, and compliance signals with interactive charts.
        </p>
      </Card>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card title="Total Employees">
          <div className="text-4xl font-semibold text-slate-900 dark:text-slate-100">{effective.totals.totalEmployees}</div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Employees with active plans and check-ins.</p>
        </Card>
        <Card title="Approved Sheets">
          <div className="text-4xl font-semibold text-slate-900 dark:text-slate-100">{effective.totals.approvedSheets}</div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Sheets approved by managers and admin.</p>
        </Card>
        <Card title="Pending Tasks">
          <div className="text-4xl font-semibold text-slate-900 dark:text-slate-100">{effective.totals.pendingTasks}</div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Open goal sheets requiring follow-up.</p>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Completion Signals">
          <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
            <div>Employee completion rate: {effective.totals.employeeCompletion}%</div>
            <div>Manager review rate: {effective.totals.managerCompletion}%</div>
          </div>
        </Card>
        <Card title="Charts Overview">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Includes quarterly trends, department completion, employee progress, shared goals distribution, manager effectiveness,
            goal category distribution, monthly check-ins, pending approvals, and cycle completion.
          </div>
        </Card>
      </div>

      <Card title="Analytics Charts">
        <div className="rounded-3xl bg-white p-4 dark:bg-slate-950">
          <DemoAnalyticsCharts data={effective.charts} />
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;

