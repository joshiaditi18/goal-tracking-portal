import { useEffect, useState } from 'react';
import { fetchSubmittedGoals, approveGoalSheet, rejectGoalSheet, returnGoalSheet } from '../../api/manager.js';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

const GoalApproval = () => {
  const [goals, setGoals] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const results = await fetchSubmittedGoals();
        setGoals(results.filter((sheet) => sheet.status === 'submitted'));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadGoals();
  }, []);

  const handleAction = async (action) => {
    if (!selected) return;
    try {
      if (action === 'approve') await approveGoalSheet(selected.sheetId);
      if (action === 'reject') await rejectGoalSheet(selected.sheetId, { reason });
      if (action === 'return') await returnGoalSheet(selected.sheetId, { remark: reason });
      setGoals(goals.filter((goal) => goal.sheetId !== selected.sheetId));
      setSelected(null);
      setReason('');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card title="Goal Approval Center">
        <p className="text-sm text-slate-500 dark:text-slate-400">Review submitted goals, approve, reject, or return for rework.</p>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Submitted Goals">
          <div className="space-y-3">
            {goals.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No submitted goals available.</p>
            ) : (
              goals.map((goal) => (
                <button
                  key={goal.sheetId}
                  type="button"
                  onClick={() => setSelected(goal)}
                  className={`w-full rounded-3xl p-4 text-left transition ${selected?.sheetId === goal.sheetId ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-500/40 dark:bg-slate-800' : 'border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'}`}
                >
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{goal.employee}</div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Quarter: {goal.quarter} • Status: {goal.status}</p>
                </button>
              ))
            )}
          </div>
        </Card>
        <Card title="Approval Panel">
          {selected ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Selected Sheet</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Employee: {selected.employee}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manager: {selected.manager}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Quarter: {selected.quarter}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Status: {selected.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Comment</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  rows="4"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={() => handleAction('approve')}>Approve</Button>
                <Button type="button" variant="secondary" onClick={() => handleAction('reject')}>Reject</Button>
                <Button type="button" variant="secondary" onClick={() => handleAction('return')}>Return</Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">Select a submitted goal sheet to review and take action.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default GoalApproval;
