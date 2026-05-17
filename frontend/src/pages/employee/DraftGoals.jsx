import { useEffect, useState } from 'react';
import { getGoalSheet, saveDraftSheet } from '../../api/goals.js';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';

const DraftGoals = () => {
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

  const handleSave = async () => {
    if (!sheet) return;
    setMessage(null);
    try {
      const payload = {
        sheetId: sheet._id,
        employee: sheet.employee,
        manager: sheet.manager,
        quarter: sheet.quarter,
        cycle: sheet.cycle,
        goals: sheet.goals.map((goal) => ({
          id: goal._id,
          thrustArea: goal.thrustArea,
          title: goal.title,
          description: goal.description,
          uomType: goal.uomType,
          target: goal.target,
          weightage: goal.weightage,
        })),
      };
      await saveDraftSheet(payload);
      setMessage('Draft updated successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed.');
    }
  };

  useEffect(() => {
    if (sheetId.length === 24) {
      loadSheet();
    }
  }, [sheetId]);

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card title="Load Draft Sheet">
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            value={sheetId}
            onChange={(e) => setSheetId(e.target.value)}
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Goal sheet id"
          />
          <Button type="button" onClick={loadSheet}>Load Draft</Button>
        </div>
      </Card>

      {sheet && (
        <Card title="Draft Goals">
          <div className="space-y-4">
            {sheet.goals.map((goal) => (
              <div key={goal._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{goal.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{goal.description}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div className="text-sm text-slate-700 dark:text-slate-200">UoM: {goal.uomType}</div>
                  <div className="text-sm text-slate-700 dark:text-slate-200">Target: {goal.target}</div>
                  <div className="text-sm text-slate-700 dark:text-slate-200">Weightage: {goal.weightage}%</div>
                </div>
              </div>
            ))}
            <Button type="button" onClick={handleSave}>Update Draft</Button>
          </div>
        </Card>
      )}
      {message && <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{message}</div>}
    </div>
  );
};

export default DraftGoals;
