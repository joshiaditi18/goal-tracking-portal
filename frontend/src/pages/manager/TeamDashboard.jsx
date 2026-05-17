import { useEffect, useMemo, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { fetchTeamAnalytics, fetchTeamOverview, fetchTeamCheckins, fetchPendingApprovals } from '../../api/manager.js';
import Card from '../../components/ui/Card.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import RichTable from '../../components/ui/RichTable.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import DemoAnalyticsCharts from '../../components/charts/DemoAnalyticsCharts.jsx';
import { demoManagerDashboard, demoAnalytics } from '../../utils/demoData.js';
import ProgressChart from '../../components/charts/ProgressChart.jsx';

const chartCommon = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } },
  scales: { y: { beginAtZero: true, max: 100 } },
};

const TeamDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [pending, setPending] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [summary, pendingList, checkinsList, analyticsData] = await Promise.all([
          fetchTeamOverview(),
          fetchPendingApprovals(),
          fetchTeamCheckins(),
          fetchTeamAnalytics(),
        ]);

        setOverview(summary);
        setPending(Array.isArray(pendingList) ? pendingList : []);
        setCheckins(Array.isArray(checkinsList) ? checkinsList : []);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const effective = useMemo(() => {
    const hasOverview = overview && typeof overview === 'object';
    const totals = {
      total: demoManagerDashboard.teamProgress.total,
      onTrack: demoManagerDashboard.teamProgress.onTrack,
      atRisk: demoManagerDashboard.teamProgress.atRisk,
      overdue: demoManagerDashboard.teamProgress.overdue,
      completion: demoManagerDashboard.teamProgress.completion,
    };

    // If backend summary contains similar keys, map them.
    const completion = hasOverview
      ? overview?.teamCompletion ?? overview?.employeeCompletion ?? demoManagerDashboard.teamProgress.completion
      : demoManagerDashboard.teamProgress.completion;

    const managerCompletion = hasOverview
      ? overview?.managerCompletion ?? demoManagerDashboard.teamProgress.onTrack
      : demoManagerDashboard.teamProgress.onTrack;

    return {
      teamProgress: {
        ...totals,
        completion,
        onTrack: managerCompletion,
      },
      teamMembers: hasOverview && Array.isArray(overview?.teamMembers) ? overview.teamMembers : demoManagerDashboard.team.members,
      pendingApprovals: Array.isArray(pending) && pending.length > 0 ? pending : demoManagerDashboard.pendingApprovals,
      quarterlyCheckins:
        Array.isArray(checkins) && checkins.length > 0
          ? checkins
          : demoManagerDashboard.quarterlyCheckins,
      employeePerformanceCards:
        Array.isArray(overview?.employeePerformance)
          ? overview.employeePerformance
          : demoManagerDashboard.employeePerformanceCards,
      departmentSummary:
        Array.isArray(overview?.departmentSummary) ? overview.departmentSummary : demoManagerDashboard.departmentSummary,
      analytics,
    };
  }, [overview, pending, checkins, analytics]);

  if (loading) {
    return (
      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <Card title="Team Performance">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-3" />
        </Card>
        <Card title="Pending Approvals">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="mt-3 h-24" />
        </Card>
      </div>
    );
  }

  const pendingRows = effective.pendingApprovals.map((p) => ({
    id: p.id ?? `${p.employeeEmail}-${p.quarter}`,
    employee: p.employee ?? p.employeeName ?? p.employeeEmail ?? '—',
    quarter: p.quarter ?? p.cycleQuarter ?? '—',
    manager: p.manager ?? '—',
    status: p.status ?? 'Pending',
    progress: p.progress ?? p.score ?? 0,
  }));

  const memberRows = effective.teamMembers.map((m) => ({
    id: m.id ?? m.name,
    name: m.name,
    department: m.department,
    completion: m.completion,
    role: m.role,
  }));

  const quarterlyLabels = effective.quarterlyCheckins.map((c) => c.quarter ?? 'Q');
  const quarterlyValues = effective.quarterlyCheckins.map((c) => Number(c.progress ?? c.score ?? 0));

  const lineData = {
    labels: quarterlyLabels,
    datasets: [
      {
        label: 'Check-in Progress %',
        data: quarterlyValues,
        borderColor: 'rgba(16,185,129,0.95)',
        backgroundColor: 'rgba(16,185,129,0.15)',
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const barData = {
    labels: memberRows.map((m) => m.name),
    datasets: [
      {
        label: 'Completion %',
        data: memberRows.map((m) => m.completion ?? 0),
        backgroundColor: 'rgba(79,70,229,0.85)',
        borderRadius: 10,
      },
    ],
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Team Performance">
          <div className="text-4xl font-semibold text-slate-900 dark:text-slate-100">{effective.teamProgress.completion}%</div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Team completion relative to plan.</p>
        </Card>
        <Card title="Pending Approvals">
          <div className="text-4xl font-semibold text-slate-900 dark:text-slate-100">{effective.pendingApprovals.length}</div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Goal sheets waiting for approval.</p>
        </Card>
        <Card title="Quarterly On-Track">
          <div className="text-4xl font-semibold text-slate-900 dark:text-slate-100">{effective.teamProgress.onTrack}%</div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Aligned progress across employees.</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Quarterly Check-ins">
          <div className="h-80 rounded-3xl bg-white p-4 dark:bg-slate-950">
            <Line data={lineData} options={chartCommon} />
          </div>
        </Card>

        <Card title="Team Members">
          <RichTable
            columns={[
              { key: 'name', label: 'Employee' },
              { key: 'department', label: 'Department' },
              { key: 'completion', label: 'Completion' },
              { key: 'role', label: 'Role' },
            ]}
            rows={memberRows}
            searchable
            initialPageSize={5}
          />
        </Card>

        <Card title="Department Summary" className="lg:col-span-1">
          <div className="space-y-3">
            {effective.departmentSummary.map((d) => (
              <div
                key={d.id ?? d.department}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{d.department}</p>
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200">
                    {d.completion ?? d.value ?? 0}%
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Pending: {d.pending ?? 0}</p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all"
                    style={{ width: `${Math.max(0, Math.min(100, d.completion ?? d.value ?? 0))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Employee Performance Cards">
          <div className="grid gap-3 sm:grid-cols-2">
            {effective.employeePerformanceCards.map((e) => (
              <div
                key={e.id ?? e.name}
                className="rounded-3xl border border-slate-200 bg-white p-4 transition hover:shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{e.name}</p>
                  <span
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    {e.trend ?? '—'}
                  </span>
                </div>
                <div className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{e.completion ?? 0}%</div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {e.tone === 'good' ? 'On track' : e.tone === 'warn' ? 'At risk' : 'Monitoring'}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Pending Approvals">
          <RichTable
            columns={[
              { key: 'employee', label: 'Employee' },
              { key: 'quarter', label: 'Quarter' },
              { key: 'manager', label: 'Manager' },
              { key: 'status', label: 'Status' },
            ]}
            rows={pendingRows}
            searchable
            initialPageSize={6}
            statusColumnKey="status"
          />
        </Card>
      </div>

      <Card title="Manager Analytics (Charts)">
        <div className="rounded-3xl bg-white p-4 dark:bg-slate-950">
          <DemoAnalyticsCharts data={effective.analytics ? effective.analytics : demoAnalytics} />
        </div>
      </Card>
    </div>
  );
};

export default TeamDashboard;

