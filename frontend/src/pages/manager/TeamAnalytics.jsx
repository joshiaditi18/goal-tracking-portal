import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { fetchTeamAnalytics } from '../../api/manager.js';
import Card from '../../components/ui/Card.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

const TeamAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await fetchTeamAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!analytics) return null;

  const chartData = {
    labels: analytics.labels,
    datasets: [
      {
        label: 'Goal Completion %',
        data: analytics.completionRates,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 12,
      },
      {
        label: 'Average Alignment',
        data: analytics.alignmentScores,
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderRadius: 12,
      },
    ],
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card title="Team Analytics">
        <p className="text-sm text-slate-500 dark:text-slate-400">Visualize team performance, completion, and alignment at a glance.</p>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Performance Summary">
          <div className="space-y-4">
            <div className="text-sm text-slate-700 dark:text-slate-200">Total team goals: {analytics.totalGoals}</div>
            <div className="text-sm text-slate-700 dark:text-slate-200">On track: {analytics.onTrack}</div>
            <div className="text-sm text-slate-700 dark:text-slate-200">At risk: {analytics.atRisk}</div>
            <div className="text-sm text-slate-700 dark:text-slate-200">Overdue: {analytics.overdue}</div>
          </div>
        </Card>
        <Card title="Trend Charts" className="lg:col-span-2">
          <div className="rounded-3xl bg-white p-4 dark:bg-slate-950">
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }} height={320} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeamAnalytics;
