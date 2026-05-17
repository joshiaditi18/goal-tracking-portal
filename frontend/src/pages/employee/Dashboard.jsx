import { useEffect, useMemo, useState } from 'react';
import { fetchAchievements, fetchDashboard } from '../../api/boards.js';
import Card from '../../components/ui/Card.jsx';
import ProgressChart from '../../components/charts/ProgressChart.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import RichTable from '../../components/ui/RichTable.jsx';
import { demoEmployeeDashboard } from '../../utils/demoData.js';

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [history, setHistory] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await fetchDashboard();
        const historyData = await fetchAchievements();

        setOverview(dashboardData);
        setHistory(Array.isArray(historyData) ? historyData.slice(0, 6) : []);

        // Try to derive rows from API payload if it matches a known shape; otherwise keep demo.
        const maybeRows = dashboardData?.progressTable?.rows;
        const normalizedRows = Array.isArray(maybeRows) ? maybeRows : [];
        setTableRows(normalizedRows);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const effective = useMemo(() => {
    const hasOverview = overview && typeof overview === 'object';
    const hasTable = Array.isArray(tableRows) && tableRows.length > 0;

    return {
      totals: hasOverview && overview.totals ? overview.totals : demoEmployeeDashboard.totals,
      quarterlyProgress:
        hasOverview && Array.isArray(overview.quarterlyProgress)
          ? overview.quarterlyProgress
          : demoEmployeeDashboard.quarterlyProgress,
      recentUpdates:
        hasOverview && Array.isArray(overview.recentUpdates)
          ? overview.recentUpdates
          : demoEmployeeDashboard.recentUpdates,
      goalStatusCards:
        hasOverview && Array.isArray(overview.goalStatusCards)
          ? overview.goalStatusCards
          : demoEmployeeDashboard.goalStatusCards,
      achievementSummary:
        hasOverview && overview.achievementSummary
          ? overview.achievementSummary
          : demoEmployeeDashboard.achievementSummary,
      kpis:
        hasOverview && Array.isArray(overview.kpis) ? overview.kpis : demoEmployeeDashboard.kpis,
      progressTable: {
        ...demoEmployeeDashboard.progressTable,
        rows: hasTable ? tableRows : demoEmployeeDashboard.progressTable.rows,
      },
    };
  }, [overview, tableRows]);

  if (loading) {
    return (
      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Employee Completion">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="mt-3" />
          </Card>
          <Card title="Manager Review Rate">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="mt-3" />
          </Card>
          <Card title="Pending Tasks">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="mt-3" />
          </Card>
        </div>
        <Card title="Quarterly Progress">
          <Skeleton className="h-80 w-full" />
        </Card>
      </div>
    );
  }

  const totals = effective.totals;
  const quarterly = effective.quarterlyProgress;

  const statusCards = [
    {
      title: 'Total Goals',
      value: totals.totalGoals,
      sub: 'Across current cycle',
      tone: 'slate',
    },
    {
      title: 'Submitted Goals',
      value: totals.submittedGoals,
      sub: 'Awaiting manager validation',
      tone: 'info',
    },
    {
      title: 'Pending Goals',
      value: totals.pendingGoals,
      sub: 'Needs follow-up or review',
      tone: 'warn',
    },
    {
      title: 'Completed Goals',
      value: totals.completedGoals,
      sub: 'Achieved for this quarter',
      tone: 'good',
    },
  ];

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statusCards.map((c) => (
          <Card key={c.title} title={c.title}>
            <div
              className={
                'text-4xl font-semibold ' +
                (c.tone === 'good'
                  ? 'text-emerald-600'
                  : c.tone === 'warn'
                    ? 'text-amber-600'
                    : c.tone === 'info'
                      ? 'text-indigo-600'
                      : 'text-slate-900 dark:text-slate-100')
              }
            >
              {c.value}
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{c.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Quarterly Progress">
          <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
            <div className="h-80">
              <ProgressChart data={quarterly} />
            </div>
          </div>
        </Card>

        <Card title="Recent Updates">
          <div className="space-y-3">
            {effective.recentUpdates.slice(0, 5).map((u) => (
              <div
                key={u.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-950"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{u.title}</p>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {u.date ? new Date(u.date).toLocaleDateString() : ''}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">By {u.by}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Achievement Summary">
          <div className="space-y-3">
            {effective.achievementSummary.achievements.map((a) => (
              <div key={a.title} className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{a.title}</p>
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{a.value}</p>
                </div>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{a.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="KPI Cards">
          <div className="grid gap-3 sm:grid-cols-2">
            {effective.kpis.map((k) => (
              <div
                key={k.label}
                className="rounded-3xl border border-slate-200 bg-white p-4 transition hover:shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{k.label}</p>
                <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {k.value}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Goal Status Cards" className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-3">
            {effective.goalStatusCards.map((s) => (
              <div
                key={s.key}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{s.label}</p>
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200">
                    {s.badge}
                  </span>
                </div>
                <div className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{s.value}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Progress Table">
        <RichTable
          columns={effective.progressTable.columns}
          rows={effective.progressTable.rows}
          searchable
          initialPageSize={5}
          statusColumnKey="status"
        />
      </Card>

      <div className="h-4" />
    </div>
  );
};

export default Dashboard;

