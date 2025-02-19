import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import API from '../../api';

export default function PatientHistory() {
  const router = useRouter();
  const { id } = router.query;
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (id) {
      const fetchHistory = async () => {
        const response = await API.get(`/patients/${id}/history`);
        setHistory(response.data);
      };
      fetchHistory();
    }
  }, [id]);

  return (
    <div>
      <h1 className="text-xl font-bold">Biomarker History</h1>
      <ul>
        {history.map((entry, index) => (
          <li key={index} className="p-4 bg-white shadow my-2 rounded">
            <p><strong>{entry.biomarker}</strong>: {entry.value}</p>
            <p>Timestamp: {new Date(entry.timestamp).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
