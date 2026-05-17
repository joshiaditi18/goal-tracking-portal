import { useState } from 'react';
import { submitCheckin } from '../../api/tracking.js';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';

const QuarterlyUpdates = () => {
  const [goalId, setGoalId] = useState('');
  const [achievement, setAchievement] = useState('');
  const [status, setStatus] = useState('Not Started');
  const [completionDate, setCompletionDate] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async () => {
    setMessage(null);
    try {
      await submitCheckin(goalId, {
        actualAchievement: Number(achievement),
        achievementStatus: status,
        completionDate,
      });
      setMessage('Quarterly update saved successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed.');
    }
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card title="Quarterly Achievement Update">
        <div className="grid gap-4">
          <input
            value={goalId}
            onChange={(e) => setGoalId(e.target.value)}
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Goal id"
          />
          <input
            type="number"
            value={achievement}
            onChange={(e) => setAchievement(e.target.value)}
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Actual achievement"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
            <option>Not Started</option>
            <option>On Track</option>
            <option>Completed</option>
          </select>
          <input
            type="date"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <Button type="button" onClick={handleSubmit}>Submit Update</Button>
          {message && <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{message}</div>}
        </div>
      </Card>
    </div>
  );
};

export default QuarterlyUpdates;
