import Card from '../../components/ui/Card.jsx';

const Dashboard = () => (
  <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
    <Card title="Manager Dashboard">
      <p className="text-sm text-slate-500 dark:text-slate-400">Review subordinate goal sheets, check-in progress, and approve critical updates.</p>
    </Card>
    <Card title="Actions">
      <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
        <li>• Review submitted goal sheets.</li>
        <li>• Monitor quarterly updates.</li>
        <li>• Add check-in comments and coaching notes.</li>
      </ul>
    </Card>
  </div>
);

export default Dashboard;
