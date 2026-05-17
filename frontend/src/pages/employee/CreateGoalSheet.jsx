import { useState } from 'react';
import { saveDraftSheet, submitSheet } from '../../api/goals.js';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';

const emptyGoal = { thrustArea: '', title: '', description: '', uomType: 'Numeric', target: '', weightage: '' };

const CreateGoalSheet = () => {
  const [employee, setEmployee] = useState('');
  const [manager, setManager] = useState('');
  const [quarter, setQuarter] = useState('Q1');
  const [cycle, setCycle] = useState('2026');
  const [goals, setGoals] = useState([emptyGoal]);
  const [sheetId, setSheetId] = useState('');
  const [message, setMessage] = useState(null);

  const handleGoalChange = (index, field, value) => {
    const updated = [...goals];
    updated[index][field] = value;
    setGoals(updated);
  };

  const addGoal = () => {
    if (goals.length < 8) setGoals([...goals, emptyGoal]);
  };

  const removeGoal = (index) => {
    setGoals(goals.filter((_, idx) => idx !== index));
  };

  const handleSaveDraft = async () => {
    setMessage(null);
    try {
      const payload = { sheetId, employee, manager, quarter, cycle, goals };
      const data = await saveDraftSheet(payload);
      setSheetId(data._id);
      setMessage('Draft saved successfully.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Save failed.');
    }
  };

  const handleSubmit = async () => {
    if (!sheetId) {
      setMessage('Save a draft first.');
      return;
    }
    setMessage(null);
    try {
      await submitSheet(sheetId);
      setMessage('Goal sheet submitted successfully.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Submission failed.');
    }
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Create Goal Sheet">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Employee ID</label>
              <input value={employee} onChange={(e) => setEmployee(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" placeholder="Employee ObjectId" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Manager ID</label>
              <input value={manager} onChange={(e) => setManager(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" placeholder="Manager ObjectId" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Quarter</label>
                <select value={quarter} onChange={(e) => setQuarter(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                  <option>Q1</option>
                  <option>Q2</option>
                  <option>Q3</option>
                  <option>Q4</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Cycle</label>
                <input value={cycle} onChange={(e) => setCycle(e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" placeholder="2026" />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={handleSaveDraft}>Save Draft</Button>
              <Button type="button" variant="secondary" onClick={handleSubmit}>Submit Sheet</Button>
            </div>
            {message && <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{message}</div>}
          </div>
        </Card>
      </div>

      <Card title="Goal Entries">
        <div className="space-y-6">
          {goals.map((goal, index) => (
            <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Goal {index + 1}</h3>
                <button className="text-sm text-red-600 hover:underline dark:text-red-400" type="button" onClick={() => removeGoal(index)}>Remove</button>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Thrust Area</label>
                  <input value={goal.thrustArea} onChange={(e) => handleGoalChange(index, 'thrustArea', e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Goal Title</label>
                  <input value={goal.title} onChange={(e) => handleGoalChange(index, 'title', e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">UoM Type</label>
                  <select value={goal.uomType} onChange={(e) => handleGoalChange(index, 'uomType', e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                    <option>Numeric</option>
                    <option>Percentage</option>
                    <option>Timeline</option>
                    <option>Zero-based</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Weightage (%)</label>
                  <input type="number" value={goal.weightage} onChange={(e) => handleGoalChange(index, 'weightage', e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Description</label>
                  <textarea value={goal.description} onChange={(e) => handleGoalChange(index, 'description', e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" rows="3" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Target</label>
                  <input type="number" value={goal.target} onChange={(e) => handleGoalChange(index, 'target', e.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                </div>
              </div>
            </div>
          ))}
          <Button type="button" onClick={addGoal}>Add Another Goal</Button>
        </div>
      </Card>
    </div>
  );
};

export default CreateGoalSheet;
