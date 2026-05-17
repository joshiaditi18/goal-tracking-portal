import { useEffect, useState } from 'react';
import { fetchPendingSheets, unlockGoalSheet } from '../../api/admin.js';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

const GoalUnlock = () => {
  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadSheets = async () => {
      try {
        const data = await fetchPendingSheets();
        setSheets(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadSheets();
  }, []);

  const handleUnlock = async (sheetId) => {
    try {
      await unlockGoalSheet(sheetId);
      setSheets((prev) => prev.filter((sheet) => sheet.sheetId !== sheetId));
      setMessage('Goal sheet unlocked successfully.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to unlock the goal sheet.');
      console.error(error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card title="Goal Unlock Center">
        <p className="text-sm text-slate-500 dark:text-slate-400">Unlock goal sheets for emergency updates and governance exceptions.</p>
      </Card>
      <div className="space-y-4">
        {message && <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{message}</div>}
        {sheets.length === 0 ? (
          <Card title="No Locked Sheets">
            <p className="text-sm text-slate-500 dark:text-slate-400">There are no locked goal sheets requiring administrative action.</p>
          </Card>
        ) : (
          sheets.map((sheet) => (
            <Card key={sheet.sheetId} title={`${sheet.employee} • ${sheet.status}`}>
              <div className="grid gap-2 text-sm text-slate-500 dark:text-slate-400">
                <div>Manager: {sheet.manager}</div>
                <div>Quarter: {sheet.quarter}</div>
                <div>Updated: {new Date(sheet.updatedAt).toLocaleDateString()}</div>
              </div>
              <div className="mt-4">
                <Button type="button" onClick={() => handleUnlock(sheet.sheetId)}>Unlock Sheet</Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default GoalUnlock;
