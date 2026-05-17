import { useEffect, useState } from 'react';
import { fetchCheckins } from '../../api/tracking.js';
import Card from '../../components/ui/Card.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

const StatusTracking = () => {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCheckins();
        setCheckins(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card title="Status Tracking">
        <div className="space-y-4">
          {checkins.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">No updates recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {checkins.map((checkin) => (
                <div key={checkin._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{checkin.goal.title}</h3>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">{checkin.achievementStatus}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Actual: {checkin.actualAchievement}</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3 text-sm text-slate-500 dark:text-slate-400">
                    <span>Score: {checkin.score}%</span>
                    <span>Quarter: {checkin.quarter}</span>
                    <span>Updated: {new Date(checkin.checkinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StatusTracking;
