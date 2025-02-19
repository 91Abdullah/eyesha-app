import { Line } from 'react-chartjs-2';

export default function BiomarkerTrend({ data, labels }) {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Biomarker Value',
        data,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        fill: true,
      },
    ],
  };

  return <Line data={chartData} />;
}
