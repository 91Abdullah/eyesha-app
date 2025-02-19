import React, { useState } from 'react';
import API from '../pages/api';

export default function FileUpload({ onResults }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file');
    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await API.post('/predict/biomarkers', formData);
      onResults(response.data);
    } catch (err) {
      console.error('Prediction failed', err);
      alert('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
