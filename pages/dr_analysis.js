import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2 } from 'lucide-react';
import Modal from '@/components/Modal';
import BIOMARKER_CONFIG from '../utils/biomarker_config';
import PDFReportDR from '@/components/PDFReportDR';
import generatePDF from '../utils/generatePDF';
import { Resolution, Margin, usePDF } from 'react-to-pdf';
import { DRPredictionCard } from '@/components/DRPredictionCard';

// Reduced options for DR analysis page
const BIOMARKER_OPTIONS = [
    { value: "HbA1c", label: "HbA1c" }
];

const DR_OPTIONS = [
    { value: "Diabetic Retinopathy", label: "Diabetic Retinopathy" }
];

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

const BiomarkerCard = ({ name, value, gender }) => {
    const getLabelForValue = (name, value) => {
        const config = BIOMARKER_CONFIG[name];
        if (!config) return '';

        const ranges = config.ranges;
        if (!ranges) return '';

        const range = ranges.find(r => value >= r.min && value <= r.max);
        return range ? range.label : '';
    };

    return (
        <div className="p-4 border rounded-lg">
            <div className="flex flex-col items-center gap-2">
                <span className="font-medium text-center">{name}</span>
                <span className="text-xl font-semibold">{value}{BIOMARKER_CONFIG[name]?.unit || ''}</span>
                <span className="text-sm text-gray-600">{getLabelForValue(name, value)}</span>
            </div>
        </div>
    );
};

const ImagePreview = ({ file, results, results_dr }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                    <div className="grid grid-cols-1 gap-4">
                        {results && Object.entries(results).map(([name, value]) => (
                            name === "HbA1c" && <BiomarkerCard key={name} name={name} value={value} />
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
                    <div className="grid grid-cols-1 gap-4">
                        {results && Object.entries(results).map(([name, value]) => (
                            name === "HbA1c" && <BiomarkerCard key={name} name={name} value={value} />
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
};

const DRAnalysis = () => {
    const [activeTab, setActiveTab] = useState('analysis');
    const [files, setFiles] = useState([]);
    const [selectedBiomarkers, setSelectedBiomarkers] = useState(["HbA1c"]); // Default selection for HbA1c
    const [selectedDR, setSelectedDR] = useState(["Diabetic Retinopathy"]); // Default selection for DR
    const [results, setResults] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { toPDF, targetRef } = usePDF({
        filename: 'dr-assessment-report.pdf',
        method: 'save',
        page: { margin: Margin.MEDIUM },
        resolution: Resolution.LOW
    });

    const getFilteredData = (data) => {
        const filteredData = {};
        if (data.HbA1c) {
            filteredData.HbA1c = data.HbA1c;
        }
        return filteredData;
    };

    const handleDownloadPDF = async () => {
        if (!results.images?.length) return;

        const processedData = results.images.map((image, index) => ({
            id: image.image_id,
            predictions: image.predictions,
            predictions_dr: image.predictions_dr,
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
        if (files.length === 0) {
            setError('Please select fundus images');
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
                    <h1 className="text-2xl font-bold mb-6">Diabetic Retinopathy Risk Assessment</h1>

                    <ImageUploader onFilesSelected={handleFilesSelected} />

                    <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-700">
                            This analysis will evaluate your fundus images for:
                        </p>
                        <ul className="list-disc ml-6 mt-2 text-sm text-blue-700">
                            <li>Diabetic Retinopathy risk prediction</li>
                            <li>HbA1c level estimation</li>
                        </ul>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading || files.length === 0}
                            className={`px-4 py-2 rounded-md text-white 
                ${isLoading || files.length === 0
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
                        <PDFReportDR
                            key={index}
                            data={getFilteredData(result.predictions)}
                            drData={result.predictions_dr}
                            imageUrl={URL.createObjectURL(files[index])}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DRAnalysis;