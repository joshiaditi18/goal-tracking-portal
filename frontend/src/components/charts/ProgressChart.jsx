import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const ProgressChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.quarter || item.title || 'Entry'),
    datasets: [
      {
        label: 'Progress Score',
        data: data.map((item) => item.progressScore || 0),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default ProgressChart;
