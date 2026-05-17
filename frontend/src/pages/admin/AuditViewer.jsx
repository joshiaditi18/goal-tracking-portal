import { useEffect, useState } from 'react';
import { fetchAuditLogs } from '../../api/admin.js';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

const AuditViewer = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState({ entityType: '', entityId: '', changedBy: '' });
  const [loading, setLoading] = useState(true);

  const loadLogs = async (params = {}) => {
    setLoading(true);
    try {
      const data = await fetchAuditLogs(params);
      setLogs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card title="Audit Trail Viewer">
        <p className="text-sm text-slate-500 dark:text-slate-400">Inspect governance events, data changes, and role-based activity.</p>
      </Card>
      <Card title="Search Audit Records">
        <div className="grid gap-4 md:grid-cols-3">
          {['entityType', 'entityId', 'changedBy'].map((field) => (
            <label key={field} className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <span>{field.replace(/([A-Z])/g, ' $1')}</span>
              <input value={filter[field]} onChange={(e) => setFilter((prev) => ({ ...prev, [field]: e.target.value }))} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
            </label>
          ))}
        </div>
        <div className="mt-4">
          <Button type="button" onClick={() => loadLogs(filter)}>Search</Button>
        </div>
      </Card>
      <Card title="Audit Records">
        {loading ? (
          <LoadingSpinner />
        ) : logs.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No audit records matched your filters.</p>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{log.entityType}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Entity ID: {log.entityId}</div>
                  </div>
                  <div className="text-right text-sm text-slate-500 dark:text-slate-400">{new Date(log.timestamp).toLocaleString()}</div>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <span>Field: {log.field}</span>
                  <span>Changed By: {log.changedBy?.name || 'System'} ({log.changedBy?.role || 'N/A'})</span>
                  <span>From: {String(log.oldValue)}</span>
                  <span>To: {String(log.newValue)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AuditViewer;
