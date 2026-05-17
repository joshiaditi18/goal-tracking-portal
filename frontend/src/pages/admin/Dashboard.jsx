import { useEffect, useMemo, useState } from 'react';
import Card from '../../components/ui/Card.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import { fetchAdminDashboard } from '../../api/admin.js';
import { demoAdminDashboard } from '../../utils/demoData.js';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAdminDashboard();
        setStats(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const effective = useMemo(() => {
    const has = stats && typeof stats === 'object';
    const totals = demoAdminDashboard.totals;

    return {
      totalEmployees: has ? stats.totalEmployees ?? totals.totalEmployees : totals.totalEmployees,
      totalManagers: has ? stats.totalManagers ?? totals.totalManagers : totals.totalManagers,
      completionPercent: has ? stats.completionPercent ?? totals.completionPercent : totals.completionPercent,
      activeCycle: has ? stats.activeCycle ?? totals.activeCycle : totals.activeCycle,
      pendingEscalations: has ? stats.pendingEscalations ?? totals.pendingEscalations : totals.pendingEscalations,
      reportsGenerated: has ? stats.reportsGenerated ?? totals.reportsGenerated : totals.reportsGenerated,
      auditActivity: has ? stats.auditActivity ?? totals.auditActivity : totals.auditActivity,
    };
  }, [stats]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card title="Admin Dashboard">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Governance overview: completion, active cycles, escalations, reports, and audit activity.
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Total Employees">
          <div className="text-4xl font-semibold text-slate-900 dark:text-slate-100">{effective.totalEmployees}</div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Active employees in the current cycle.</p>
        </Card>
        <Card title="Total Managers">
          <div className="text-4xl font-semibold text-slate-900 dark:text-slate-100">{effective.totalManagers}</div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Managers responsible for approvals.</p>
        </Card>
        <Card title="Completion %">
          <div className="text-4xl font-semibold text-slate-900 dark:text-slate-100">{effective.completionPercent}%</div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Sheet completion signal across the org.</p>
        </Card>
        <Card title="Active Cycle">
          <div className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{effective.activeCycle}</div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Currently configured quarterly cycle.</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Pending Escalations">
          <div className="text-4xl font-semibold text-slate-900 dark:text-slate-100">{effective.pendingEscalations}</div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Escalation rules awaiting action.</p>
        </Card>
        <Card title="Reports generated & Audit activity">
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <div>• Reports generated: <span className="font-semibold text-slate-900 dark:text-slate-100">{effective.reportsGenerated}</span></div>
            <div>• Audit events: <span className="font-semibold text-slate-900 dark:text-slate-100">{effective.auditActivity}</span></div>
          </div>
        </Card>
      </div>

      <Card title="Controls">
        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <li>• Create and manage users.</li>
          <li>• Configure cycles and departments.</li>
          <li>• Review audit trails and escalations.</li>
        </ul>
      </Card>
    </div>
  );
};

export default Dashboard;

