import { useEffect, useMemo, useState } from 'react';
import {
  createCycle,
  deleteCycle,
  fetchActiveCycle,
  fetchCycles,
  updateCycle,
  activateCycle,
  deactivateCycle,
} from '../../api/cycle.js';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

const initialForm = {
  name: '',
  quarter: 'Q1',
  year: new Date().getFullYear(),
  goalSettingWindowStart: '',
  goalSettingWindowEnd: '',
  q1WindowStart: '',
  q1WindowEnd: '',
  q2WindowStart: '',
  q2WindowEnd: '',
  q3WindowStart: '',
  q3WindowEnd: '',
  q4WindowStart: '',
  q4WindowEnd: '',
  trackingWindowStart: '',
  trackingWindowEnd: '',
};

const buildStatus = (cycle) => {
  if (!cycle) return 'No active cycle configured.';
  return cycle.active ? 'Active' : 'Inactive';
};

const CycleManagement = () => {
  const [cycles, setCycles] = useState([]);
  const [activeCycle, setActiveCycle] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadCycles = async () => {
    setLoading(true);
    try {
      const [list, active] = await Promise.all([fetchCycles(), fetchActiveCycle()]);
      setCycles(list);
      setActiveCycle(active);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCycles();
  }, []);

  const resetForm = () => {
    setSelected(null);
    setForm(initialForm);
    setMessage('');
  };

  const handleSelect = (cycle) => {
    setSelected(cycle);
    setForm({
      name: cycle.name || '',
      quarter: cycle.quarter || 'Q1',
      year: cycle.year || new Date().getFullYear(),
      goalSettingWindowStart: cycle.goalSettingWindowStart?.slice(0, 10) || '',
      goalSettingWindowEnd: cycle.goalSettingWindowEnd?.slice(0, 10) || '',
      q1WindowStart: cycle.q1WindowStart?.slice(0, 10) || '',
      q1WindowEnd: cycle.q1WindowEnd?.slice(0, 10) || '',
      q2WindowStart: cycle.q2WindowStart?.slice(0, 10) || '',
      q2WindowEnd: cycle.q2WindowEnd?.slice(0, 10) || '',
      q3WindowStart: cycle.q3WindowStart?.slice(0, 10) || '',
      q3WindowEnd: cycle.q3WindowEnd?.slice(0, 10) || '',
      q4WindowStart: cycle.q4WindowStart?.slice(0, 10) || '',
      q4WindowEnd: cycle.q4WindowEnd?.slice(0, 10) || '',
      trackingWindowStart: cycle.trackingWindowStart?.slice(0, 10) || '',
      trackingWindowEnd: cycle.trackingWindowEnd?.slice(0, 10) || '',
    });
    setMessage('Editing selected cycle. Save changes or clear to create a new cycle.');
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        year: Number(form.year),
      };
      if (selected) {
        await updateCycle(selected._id, payload);
        setMessage('Cycle updated successfully.');
      } else {
        await createCycle(payload);
        setMessage('Cycle created successfully.');
      }
      await loadCycles();
      resetForm();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save cycle.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (cycleId) => {
    setSaving(true);
    try {
      await deleteCycle(cycleId);
      setMessage('Cycle deleted.');
      await loadCycles();
      if (selected?._id === cycleId) resetForm();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to delete cycle.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (cycle) => {
    setSaving(true);
    try {
      if (cycle.active) {
        await deactivateCycle(cycle._id);
        setMessage('Cycle deactivated.');
      } else {
        await activateCycle(cycle._id);
        setMessage('Cycle activated.');
      }
      await loadCycles();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to update cycle state.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const currentCalendar = useMemo(() => {
    if (!activeCycle) return null;
    return [
      { label: 'Goal Setting', start: activeCycle.goalSettingWindowStart, end: activeCycle.goalSettingWindowEnd },
      { label: 'Q1', start: activeCycle.q1WindowStart, end: activeCycle.q1WindowEnd },
      { label: 'Q2', start: activeCycle.q2WindowStart, end: activeCycle.q2WindowEnd },
      { label: 'Q3', start: activeCycle.q3WindowStart, end: activeCycle.q3WindowEnd },
      { label: 'Q4', start: activeCycle.q4WindowStart, end: activeCycle.q4WindowEnd },
      { label: 'Tracking', start: activeCycle.trackingWindowStart, end: activeCycle.trackingWindowEnd },
    ];
  }, [activeCycle]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card title="Cycle Management">
        <p className="text-sm text-slate-500 dark:text-slate-400">Define planning cycles, manage activation, and verify calendar windows for governance.</p>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <Card title="Active Cycle Status">
          <div className="space-y-4 text-sm text-slate-700 dark:text-slate-200">
            <div>Name: {activeCycle?.name || 'None configured'}</div>
            <div>Quarter: {activeCycle?.quarter || 'N/A'}</div>
            <div>Year: {activeCycle?.year || 'N/A'}</div>
            <div>Status: <span className={activeCycle?.active ? 'font-semibold text-emerald-600 dark:text-emerald-400' : 'font-semibold text-amber-600 dark:text-amber-400'}>{buildStatus(activeCycle)}</span></div>
          </div>
        </Card>

        <Card title="Calendar View">
          {currentCalendar ? (
            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
              {currentCalendar.map((window) => (
                <div key={window.label} className="grid gap-1 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">{window.label}</div>
                  <div className="text-slate-500 dark:text-slate-400">{new Date(window.start).toLocaleDateString()} — {new Date(window.end).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">No active cycle available to display.</p>
          )}
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card title={selected ? 'Edit Cycle' : 'Create Cycle'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <span>Name</span>
                <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              </label>
              <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <span>Quarter</span>
                <select value={form.quarter} onChange={(e) => handleChange('quarter', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <span>Year</span>
                <input type="number" value={form.year} onChange={(e) => handleChange('year', Number(e.target.value))} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              </label>
              <div />
            </div>

            <Card title="Goal Setting Window">
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                    <span>Start</span>
                    <input type="date" value={form.goalSettingWindowStart} onChange={(e) => handleChange('goalSettingWindowStart', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                  </label>
                  <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                    <span>End</span>
                    <input type="date" value={form.goalSettingWindowEnd} onChange={(e) => handleChange('goalSettingWindowEnd', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                  </label>
                </div>
              </div>
            </Card>

            {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
              <Card key={quarter} title={`${quarter} Window`}>
                <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                      <span>{quarter} Start</span>
                      <input type="date" value={form[`${quarter.toLowerCase()}WindowStart`]} onChange={(e) => handleChange(`${quarter.toLowerCase()}WindowStart`, e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                      <span>{quarter} End</span>
                      <input type="date" value={form[`${quarter.toLowerCase()}WindowEnd`]} onChange={(e) => handleChange(`${quarter.toLowerCase()}WindowEnd`, e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                    </label>
                  </div>
                </div>
              </Card>
            ))}

            <Card title="Tracking Window">
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-900">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                    <span>Start</span>
                    <input type="date" value={form.trackingWindowStart} onChange={(e) => handleChange('trackingWindowStart', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                  </label>
                  <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                    <span>End</span>
                    <input type="date" value={form.trackingWindowEnd} onChange={(e) => handleChange('trackingWindowEnd', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                  </label>
                </div>
              </div>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={saving}>{selected ? 'Update Cycle' : 'Create Cycle'}</Button>
              <Button type="button" variant="secondary" onClick={resetForm}>Clear</Button>
            </div>
            {message && <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{message}</p>}
          </form>
        </Card>

        <Card title="Saved Cycles">
          <div className="space-y-4">
            {cycles.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No cycles have been created yet.</p>
            ) : (
              cycles.map((cycle) => (
                <div key={cycle._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{cycle.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{cycle.quarter} • {cycle.year}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="secondary" onClick={() => handleSelect(cycle)}>Edit</Button>
                      <Button type="button" variant="danger" onClick={() => handleRemove(cycle._id)}>Delete</Button>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <span>Status: {cycle.active ? 'Active' : 'Inactive'}</span>
                    <span>Goal Setting: {cycle.goalSettingWindowStart?.slice(0, 10)} → {cycle.goalSettingWindowEnd?.slice(0, 10)}</span>
                    <span>Tracking: {cycle.trackingWindowStart?.slice(0, 10)} → {cycle.trackingWindowEnd?.slice(0, 10)}</span>
                  </div>
                  <div className="mt-4">
                    <Button type="button" onClick={() => handleToggleActive(cycle)}>{cycle.active ? 'Deactivate' : 'Activate'}</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CycleManagement;
