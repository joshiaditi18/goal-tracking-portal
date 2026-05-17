import { useState } from 'react';
import { submitSheet, getGoalSheet } from '../../api/goals.js';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';

const SubmitGoals = () => {
  const [sheetId, setSheetId] = useState('');
  const [sheet, setSheet] = useState(null);
  const [message, setMessage] = useState(null);

  const loadSheet = async () => {
    setMessage(null);
    try {
      const data = await getGoalSheet(sheetId);
      setSheet(data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Unable to load sheet.');
      setSheet(null);
    }
  };

  const handleSubmit = async () => {
    setMessage(null);
    try {
      await submitSheet(sheetId);
      setMessage('Goal sheet submitted successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Submit failed.');
    }
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card title="Submit Goal Sheet">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            value={sheetId}
            onChange={(e) => setSheetId(e.target.value)}
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Goal sheet id"
          />
          <Button type="button" onClick={loadSheet}>Load Sheet</Button>
        </div>
      </Card>

      {sheet && (
        <Card title="Review before submit">
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{sheet.quarter} / {sheet.cycle}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Status: {sheet.status}</p>
            </div>
            <Button type="button" onClick={handleSubmit}>Submit Goal Sheet</Button>
          </div>
        </Card>
      )}
      {message && <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{message}</div>}
    </div>
  );
};

export default SubmitGoals;
