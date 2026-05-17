import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
    tooltip: { enabled: true },
  },
};

const StackBarChart = ({ labels, datasets }) => {
  const data = {
    labels,
    datasets,
  };

  const options = {
    ...commonOptions,
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: { color: 'rgba(148,163,184,0.35)' },
      },
    },
  };

  // react-chartjs-2 Bar supports stacked via options
  return (
    <Bar data={data} options={options} />
  );
};

const DemoAnalyticsCharts = ({ data }) => {
  const {
    labelsQuarter = [],
    departmentCompletion = [],
    employeeProgress = [],
    sharedGoalsDistribution = [],
    managerEffectiveness = [],
    goalCategoryDistribution = [],
    monthlyCheckins = { months: [], values: [] },
    pendingApprovals = { statuses: [], values: [] },
    cycleCompletion = [],
  } = data || {};

  const deptLabels = departmentCompletion.map((d) => d.department);
  const deptValues = departmentCompletion.map((d) => d.value);

  const empLabels = employeeProgress.map((e) => e.employee);
  const empValues = employeeProgress.map((e) => e.value);

  const sharedLabels = sharedGoalsDistribution.map((d) => d.label);
  const sharedValues = sharedGoalsDistribution.map((d) => d.value);

  const mgrLabels = managerEffectiveness.map((m) => m.manager);
  const mgrValues = managerEffectiveness.map((m) => m.score);

  const catLabels = goalCategoryDistribution.map((d) => d.category);
  const catValues = goalCategoryDistribution.map((d) => d.value);

  const lineLabels = monthlyCheckins.months;
  const lineValues = monthlyCheckins.values;

  const pendingLabels = pendingApprovals.statuses;
  const pendingValues = pendingApprovals.values;

  const cycleLabels = cycleCompletion.map((c) => c.quarter);
  const cycleCompleted = cycleCompletion.map((c) => c.completed);
  const cycleTotal = cycleCompletion.map((c) => c.total);
  const cycleRemaining = cycleTotal.map((t, i) => Math.max(0, t - (cycleCompleted[i] ?? 0)));

  const color = {
    indigo: 'rgba(79,70,229,0.9)',
    emerald: 'rgba(16,185,129,0.9)',
    amber: 'rgba(245,158,11,0.9)',
    rose: 'rgba(244,63,94,0.9)',
    sky: 'rgba(14,165,233,0.9)',
    slate: 'rgba(100,116,139,0.9)',
  };

  const barData = {
    labels: deptLabels,
    datasets: [
      {
        label: 'Department Completion %',
        data: deptValues,
        backgroundColor: deptValues.map((_, i) =>
          i % 2 === 0 ? 'rgba(79,70,229,0.85)' : 'rgba(14,165,233,0.75)'
        ),
        borderRadius: 10,
      },
    ],
  };

  const barOptions = {
    ...commonOptions,
    plugins: { ...commonOptions.plugins, title: { display: false } },
    scales: {
      y: { beginAtZero: true, max: 100, grid: { color: 'rgba(148,163,184,0.35)' } },
      x: { grid: { display: false } },
    },
  };

  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: 'Monthly Check-ins',
        data: lineValues,
        borderColor: 'rgba(16,185,129,0.95)',
        backgroundColor: 'rgba(16,185,129,0.15)',
        tension: 0.35,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const lineOptions = {
    ...commonOptions,
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(148,163,184,0.35)' } },
      x: { grid: { display: false } },
    },
  };

  const pieData = {
    labels: sharedLabels,
    datasets: [
      {
        data: sharedValues,
        backgroundColor: [
          'rgba(79,70,229,0.85)',
          'rgba(16,185,129,0.85)',
          'rgba(245,158,11,0.85)',
          'rgba(244,63,94,0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const donutData = {
    labels: catLabels,
    datasets: [
      {
        data: catValues,
        backgroundColor: [
          'rgba(59,130,246,0.85)',
          'rgba(16,185,129,0.85)',
          'rgba(245,158,11,0.85)',
          'rgba(244,63,94,0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const stackedDatasets = [
    {
      label: 'Completed',
      data: cycleCompleted,
      backgroundColor: 'rgba(16,185,129,0.85)',
      borderRadius: 10,
    },
    {
      label: 'Remaining',
      data: cycleRemaining,
      backgroundColor: 'rgba(148,163,184,0.55)',
      borderRadius: 10,
    },
  ];

  const pendingPieData = {
    labels: pendingLabels,
    datasets: [
      {
        data: pendingValues,
        backgroundColor: ['rgba(245,158,11,0.85)', 'rgba(244,63,94,0.8)', 'rgba(79,70,229,0.8)'],
        borderWidth: 0,
      },
    ],
  };

  const managerBarData = {
    labels: mgrLabels,
    datasets: [
      {
        label: 'Manager Effectiveness Score',
        data: mgrValues,
        backgroundColor: 'rgba(79,70,229,0.85)',
        borderRadius: 10,
      },
    ],
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Department Completion
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Bar</div>
          </div>
          <div className="h-72">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Quarterly Trends (Completion %)
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Line</div>
          </div>
          <div className="h-72">
            <Line
              data={{
                labels: labelsQuarter,
                datasets: [
                  {
                    label: 'Completion',
                    data: labelsQuarter.map((_, i) => {
                      // lightweight fallback: use completed from cycle if sizes match
                      return cycleCompleted[i] ?? (40 + i * 12);
                    }),
                    borderColor: 'rgba(79,70,229,0.95)',
                    backgroundColor: 'rgba(79,70,229,0.15)',
                    fill: true,
                    tension: 0.35,
                    pointRadius: 3,
                  },
                ],
              }}
              options={lineOptions}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Shared Goals Distribution
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Pie</div>
          </div>
          <div className="h-72">
            <Pie data={pieData} options={commonOptions} />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Goal Category Distribution
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Doughnut</div>
          </div>
          <div className="h-72">
            <Doughnut data={donutData} options={commonOptions} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Manager Effectiveness
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Bar</div>
          </div>
          <div className="h-72">
            <Bar data={managerBarData} options={barOptions} />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Pending Approvals
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Pie</div>
          </div>
          <div className="h-72">
            <Pie data={pendingPieData} options={commonOptions} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Employee Progress Snapshot
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Bar</div>
          </div>
          <div className="h-72">
            <Bar
              data={{
                labels: empLabels,
                datasets: [
                  {
                    label: 'Progress %',
                    data: empValues,
                    backgroundColor: empValues.map((_, i) => (i % 2 === 0 ? 'rgba(79,70,229,0.85)' : 'rgba(16,185,129,0.8)')),
                    borderRadius: 10,
                  },
                ],
              }}
              options={barOptions}
            />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-950">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Cycle Completion (Stacked)
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Stacked</div>
          </div>
          <div className="h-72">
            <StackBarChart labels={cycleLabels} datasets={stackedDatasets} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoAnalyticsCharts;

