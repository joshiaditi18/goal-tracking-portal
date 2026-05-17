import { useEffect, useState } from 'react';
import { fetchTeamCheckins, submitManagerComment } from '../../api/manager.js';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

const QuarterlyCheckin = () => {
  const [checkins, setCheckins] = useState([]);
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCheckins = async () => {
      try {
        const data = await fetchTeamCheckins();
        setCheckins(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadCheckins();
  }, []);

  const handleSave = async () => {
    if (!selected) return;
    try {
      await submitManagerComment(selected.goal._id, { actualAchievement: selected.actualAchievement || 0, achievementStatus: selected.achievementStatus || 'On Track', completionDate: selected.checkinDate, managerComments: comment });
      setComment('');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card title="Quarterly Check-in">
        <p className="text-sm text-slate-500 dark:text-slate-400">Review planned vs actual performance and add manager comments.</p>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Check-in Queue">
          <div className="space-y-3">
            {checkins.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No team check-ins available.</p>
            ) : (
              checkins.map((item) => (
                <button
                  type="button"
                  key={item._id}
                  onClick={() => setSelected(item)}
                  className={`w-full rounded-3xl p-4 text-left ${selected?._id === item._id ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-500/40 dark:bg-slate-800' : 'border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'}`}
                >
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{item.goal.title}</div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Status: {item.achievementStatus}</p>
                </button>
              ))
            )}
          </div>
        </Card>
        <Card title="Check-in Review">
          {selected ? (
            <div className="space-y-4">
              <div className="text-sm text-slate-700 dark:text-slate-200">Employee: {selected.employee.name}</div>
              <div className="text-sm text-slate-700 dark:text-slate-200">Actual: {selected.actualAchievement}</div>
              <div className="text-sm text-slate-700 dark:text-slate-200">Score: {selected.score}%</div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Manager comments</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows="4" className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              </div>
              <Button type="button" onClick={handleSave}>Save Comment</Button>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">Select a check-in to review details and add a note.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default QuarterlyCheckin;
