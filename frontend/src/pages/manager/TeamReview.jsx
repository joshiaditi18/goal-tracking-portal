import { useEffect, useState } from 'react';
import { fetchPendingReports } from '../../api/boards.js';
import Card from '../../components/ui/Card.jsx';

const TeamReview = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchPendingReports();
        setReports(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadReports();
  }, []);

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card title="Team Review">
        <p className="text-sm text-slate-500 dark:text-slate-400">Pending goal sheets and employee updates awaiting your action.</p>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        {reports.map((item) => (
          <Card key={item.employeeEmail}>
            <div className="text-sm text-slate-900 dark:text-slate-100">{item.employee} ({item.employeeEmail})</div>
            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">Status: {item.status}</div>
            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">Updated: {new Date(item.updatedAt).toLocaleDateString()}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamReview;
