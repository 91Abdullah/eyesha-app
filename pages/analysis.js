import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PieChart, Pie, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';
import Modal from '@/components/Modal';
import BIOMARKER_CONFIG from '../utils/biomarker_config';
import PDFReport from '../components/PDFReport';
import generatePDF from '../utils/generatePDF';
import { useRef } from 'react';
import { Resolution, Margin, usePDF } from 'react-to-pdf';
import { DRPredictionCard } from '@/components/DRPredictionCard';

const BIOMARKER_OPTIONS = [
  { value: "Age", label: "Age" },
  { value: "Gender", label: "Gender" },
  { value: "BMI", label: "BMI" },
  { value: "Diastolic Blood Pressure", label: "Diastolic Blood Pressure" },
  { value: "Systolic Blood Pressure", label: "Systolic Blood Pressure" },
  { value: "Total Cholesterol", label: "Total Cholesterol" },
  { value: "Creatinine", label: "Creatinine" },
  { value: "Estradiol", label: "Estradiol" },
  { value: "Glucose", label: "Glucose" },
  { value: "HbA1c", label: "HbA1c" },
  { value: "HDL-Cholesterol", label: "HDL-Cholesterol" },
  { value: "Hematocrit", label: "Hematocrit" },
  { value: "Hemoglobin", label: "Hemoglobin" },
  { value: "Insulin", label: "Insulin" },
  { value: "LDL-Cholesterol", label: "LDL-Cholesterol" },
  { value: "Red Blood Cell", label: "Red Blood Cell" },
  { value: "SHBG", label: "Sex Harmone Binding Globulin" },
  { value: "Testosterone", label: "Testosterone" },
  { value: "Triglyceride", label: "Triglyceride" }
];

const DR_OPTIONS = [
  { value: "Diabetic Retinopathy", label: "Diabetic Retinopathy" },
]

const ImageUploader = ({ onFilesSelected }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    onDrop: onFilesSelected
  });

  return (
    <div 
      {...getRootProps()} 
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-500">Drop the files here...</p>
      ) : (
        <p>Drag & drop fundus images here, or click to select files</p>
      )}
    </div>
  );
};

const DRSelection = ({ selectedDR, onChange }) => {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Disease Risk
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {DR_OPTIONS.map((dr) => (
          <label key={dr.value} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={dr.value}
              checked={selectedDR.includes(dr.value)}
              onChange={(e) => {
                const value = e.target.value;
                onChange(
                  e.target.checked
                    ? [...selectedDR, value]
                    : selectedDR.filter((d) => d !== value)
                );
              }}
              className="rounded border-gray-300"
            />
            <span className="text-sm">{dr.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

const BiomarkerSelector = ({ onChange, selectedBiomarkers }) => {
  const allSelected = selectedBiomarkers.length === BIOMARKER_OPTIONS.length;
 
  const handleSelectAll = (checked) => {
    onChange(checked ? BIOMARKER_OPTIONS.map(b => b.value) : []);
  };
 
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Biomarkers
      </label>
      
      <label className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="rounded border-gray-300"
        />
        <span className="text-sm font-medium">Select All</span>
      </label>
 
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {BIOMARKER_OPTIONS.map((biomarker) => (
          <label key={biomarker.value} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={biomarker.value}
              checked={selectedBiomarkers.includes(biomarker.value)}
              onChange={(e) => {
                const value = e.target.value;
                onChange(
                  e.target.checked
                    ? [...selectedBiomarkers, value]
                    : selectedBiomarkers.filter((b) => b !== value)
                );
              }}
              className="rounded border-gray-300"
            />
            <span className="text-sm">{biomarker.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
 };

 const ResultChart = ({ data, name }) => {
  const RADIAN = Math.PI / 180;
  const value = data[name];
  const gender = data['Gender'];
  const config = BIOMARKER_CONFIG[name];
  
  // Special handling for gender biomarker
  if (name === 'Gender') {
    return null;
  }
  
  // Get appropriate ranges based on gender for gender-specific biomarkers
  const ranges = config.male && config.female ? 
    (gender === 'Male' ? config.male.ranges : config.female.ranges) : 
    config.ranges;

  const chartData = [
    { name: ranges[0].label, value: ranges[0].max, color: '#4ade80' },
    { name: ranges[1].label, value: ranges[1].max - ranges[0].max, color: '#fbbf24' },
    { name: ranges[2].label, value: ranges[2].max - ranges[1].max, color: '#f87171' }
  ];

  const cx = 50;
  const cy = 50;
  const iR = 20;
  const oR = 40;

  const needle = (value, data, cx, cy, iR, oR, color) => {
    let total = ranges[2].max;
    const ang = 180.0 * (1 - value / total);
    const length = (iR + 2 * oR) / 3;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    
    return [
      <circle cx={cx} cy={cy} r={2} fill={color} key="circle" />,
      <path
        d={`M ${cx} ${cy} L ${cx + length * cos} ${cy + length * sin}`}
        strokeWidth="2"
        stroke={color}
        key="path"
      />
    ];
  };

  return (
    <div className="relative w-24 h-24">
      <PieChart width={100} height={100}>
        <Pie
          data={chartData}
          cx={cx}
          cy={cy}
          innerRadius={iR}
          outerRadius={oR}
          startAngle={180}
          endAngle={0}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        {needle(value, chartData, cx, cy, iR, oR, '#666')}
      </PieChart>
    </div>
  );
};

const BiomarkerCard = ({ name, value, gender }) => {
  const getLabelForValue = (name, value) => {
    const config = BIOMARKER_CONFIG[name];
    if (!config) return '';
    
    // Handle gender-specific ranges
    const ranges = config.male && config.female ? 
      (gender === 'Male' ? config.male.ranges : config.female.ranges) : 
      config.ranges;
      
    if (!ranges) return '';

    const range = ranges.find(r => value >= r.min && value <= r.max);
    return range ? range.label : '';
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex flex-col items-center gap-2">
        <span className="font-medium text-center">{name}</span>
        {name === 'Gender' ? (
          <span className="text-lg">{value}</span>
        ) : (
          <>
            <ResultChart data={{ [name]: value, Gender: gender }} name={name} />
            <span>{value}{BIOMARKER_CONFIG[name]?.unit || ''}</span>
            <span className="text-sm text-gray-600">{getLabelForValue(name, value)}</span>
          </>
        )}
      </div>
    </div>
  );
};

const ImagePreview = ({ file, results, results_dr }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gender = results?.Gender;

  return (
    <>
      <div 
        className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex flex-col gap-6">
          <img
            src={URL.createObjectURL(file)}
            alt="Fundus"
            className="w-full h-64 object-contain"
          />
          <div className="flex flex-col">
            {results_dr && Object.entries(results_dr).map(([name, value]) => (
              <DRPredictionCard key={name} predictions={value} />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results && Object.entries(results).map(([name, value]) => (
              <BiomarkerCard key={name} name={name} value={value} gender={gender} />
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-6 overflow-y-auto max-h-[90vh]">
          <img
            src={URL.createObjectURL(file)}
            alt="Fundus"
            className="w-full h-full object-contain"
          />
          <div className="flex flex-col">
            {results_dr && Object.entries(results_dr).map(([name, value]) => (
              <DRPredictionCard key={name} predictions={value} />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results && Object.entries(results).map(([name, value]) => (
              <BiomarkerCard key={name} name={name} value={value} gender={gender} />
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

const BiomarkerAnalysis = () => {
  const [activeTab, setActiveTab] = useState('analysis');
  const [files, setFiles] = useState([]);
  const [selectedBiomarkers, setSelectedBiomarkers] = useState([]);
  const [selectedDR, setSelectedDR] = useState([]);
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toPDF, targetRef } = usePDF({
    filename: 'biomarker-assessment-report.pdf',
    method: 'save',
    page: { margin: Margin.MEDIUM },
    resolution: Resolution.LOW
  });

  const getFilteredData = (data) => {
    const filteredData = { Gender: data.Gender };
    selectedBiomarkers.forEach(biomarker => {
      filteredData[biomarker] = data[biomarker];
    });
    return filteredData;
  };


  const handleDownloadPDF = async () => {
    if (!results.images?.length) return;
    
    const processedData = results.images.map((image, index) => ({
      id: image.image_id,
      predictions: image.predictions,
      imageUrl: URL.createObjectURL(files[index])
    }));
  
    const pdfUrl = await generatePDF(processedData);
    window.open(pdfUrl);
  };

  const handleFilesSelected = (acceptedFiles) => {
    setFiles(acceptedFiles);
    setResults({});
    setError(null);
  };

  const handleAnalyze = async () => {
    if (files.length === 0 || selectedBiomarkers.length === 0) {
      setError('Please select both images and biomarkers');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      formData.append('models', JSON.stringify(selectedBiomarkers));
      formData.append('diseases', JSON.stringify(selectedDR));

      const response = await fetch('http://localhost:5001/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(selectedDR.length === 0)
  }, [selectedDR]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('analysis')}
          className={`px-4 py-2 rounded ${activeTab === 'analysis' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Analysis
        </button>
        <button 
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2 rounded ${activeTab === 'report' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Report
        </button>
        {activeTab === 'report' && results.images?.length > 0 && (
          <button
            onClick={() => toPDF()}
            className="px-4 py-2 rounded bg-green-500 text-white ml-auto"
          >
            Download PDF
          </button>
        )}
      </div>

      {activeTab === 'analysis' ? (
        <>
          <h1 className="text-2xl font-bold mb-6">AI Based Risk Assessment</h1>

          <ImageUploader onFilesSelected={handleFilesSelected} />

          <BiomarkerSelector
            onChange={setSelectedBiomarkers}
            selectedBiomarkers={selectedBiomarkers}
          />

          <DRSelection 
            selectedDR={selectedDR} 
            onChange={setSelectedDR}
          />

          <div className="mt-6">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || files.length === 0 || (selectedBiomarkers.length === 0 && selectedDR.length === 0)}
              className={`px-4 py-2 rounded-md text-white 
                ${isLoading || files.length === 0 || (selectedBiomarkers.length === 0 && selectedDR.length === 0)
                  ? 'bg-gray-400'
                  : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin mr-2" />
                  Analyzing...
                </div>
              ) : (
                'Analyze Images'
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-4">
            {files.map((file, index) => (
              <ImagePreview
                key={file.name}
                file={file}
                results={results.images?.[index]?.predictions}
                results_dr={results.images?.[index]?.predictions_dr}
              />
            ))}
          </div>
        </>
      ) : (
        <div ref={targetRef}>
          {results.images?.map((result, index) => (
            <PDFReport 
              key={index}
              data={getFilteredData(result.predictions)}
              imageUrl={URL.createObjectURL(files[index])}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BiomarkerAnalysis;