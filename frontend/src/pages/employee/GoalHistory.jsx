import { useEffect, useState } from 'react';
import { fetchAchievements } from '../../api/boards.js';
import Card from '../../components/ui/Card.jsx';
import ProgressChart from '../../components/charts/ProgressChart.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

const GoalHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchAchievements();
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card title="Goal History Overview">
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <p>Total goals tracked: {history.length}</p>
          <p>Use the chart to see recent progress trends and track completion rate.</p>
        </div>
      </Card>

      <Card title="Historical Progress">
        <div className="h-[420px]">
          <ProgressChart data={history} />
        </div>
      </Card>
    </div>
  );
};

export default GoalHistory;
