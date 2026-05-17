import { useEffect, useState } from 'react';
import { fetchSharedGoals, updateSharedWeightage, syncSharedGoalAchievement } from '../../api/manager.js';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

const SharedGoalManagement = () => {
  const [sharedGoals, setSharedGoals] = useState([]);
  const [selected, setSelected] = useState(null);
  const [weightage, setWeightage] = useState('');
  const [achievement, setAchievement] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSharedGoals = async () => {
      try {
        const data = await fetchSharedGoals();
        setSharedGoals(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadSharedGoals();
  }, []);

  const updateWeight = async () => {
    if (!selected) return;
    try {
      await updateSharedWeightage(selected._id, { weightage: Number(weightage) });
      setMessage('Weightage updated successfully.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Update failed.');
    }
  };

  const syncAchievement = async () => {
    if (!selected) return;
    try {
      await syncSharedGoalAchievement(selected._id, { achievement: Number(achievement) });
      setMessage('Achievement synced successfully.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Sync failed.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card title="Shared Goal Management">
        <p className="text-sm text-slate-500 dark:text-slate-400">Assign shared goals and keep progress synchronized across employees.</p>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Shared Goals">
          <div className="space-y-3">
            {sharedGoals.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No shared goals found.</p>
            ) : (
              sharedGoals.map((goal) => (
                <button
                  type="button"
                  key={goal._id}
                  onClick={() => {
                    setSelected(goal);
                    setWeightage(goal.weightageByEmployee?.find((row) => row.employee?.role === 'employee')?.weightage || '');
                  }}
                  className={`w-full rounded-3xl p-4 text-left ${selected?._id === goal._id ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-500/40 dark:bg-slate-800' : 'border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'}`}
                >
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{goal.title}</div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Target: {goal.target}</p>
                </button>
              ))
            )}
          </div>
        </Card>
        <Card title="Shared Goal Details">
          {selected ? (
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Title</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selected.title}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Target</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selected.target}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Weightage</label>
                <input
                  type="number"
                  value={weightage}
                  onChange={(e) => setWeightage(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
              <Button type="button" onClick={updateWeight}>Update Weightage</Button>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Achievement</label>
                <input
                  type="number"
                  value={achievement}
                  onChange={(e) => setAchievement(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
              <Button type="button" variant="secondary" onClick={syncAchievement}>Sync Achievement</Button>
              {message && <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{message}</div>}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">Select a shared goal to manage weightage and sync progress.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SharedGoalManagement;
