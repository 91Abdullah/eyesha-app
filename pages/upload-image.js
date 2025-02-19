// /pages/upload-image.js
import { useState } from 'react';
import Button from '../components/Button';

export default function UploadImagePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setMessage('Please select a file.');
      return;
    }
    setMessage(`File "${selectedFile.name}" uploaded successfully!`);
    setSelectedFile(null);
  };

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-text mb-8">Upload Retinal Image</h1>
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full mb-4 border p-2 rounded"
      />
      <Button onClick={handleUpload} variant="primary">
        Upload
      </Button>
      {message && <p className="mt-4 text-success font-medium">{message}</p>}
    </div>
  );
}
