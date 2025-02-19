import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';
import BIOMARKER_CONFIG from '@/utils/biomarker_config';
import { calculateRiskScore } from '@/utils/risk_score';
import { generateRecommendations } from '@/utils/recommendations';

const BIOMARKER_CATEGORIES = {
  Demographics: ['Age', 'Gender'],
  Cardiovascular: ['Systolic Blood Pressure', 'Diastolic Blood Pressure', 'Total Cholesterol', 'HDL-Cholesterol', 'LDL-Cholesterol', 'Triglyceride'],
  Metabolic: ['Glucose', 'HbA1c', 'Insulin'],
  Hematological: ['Hematocrit', 'Hemoglobin', 'Red Blood Cell', 'Creatinine'],
  Hormonal: ['SHBG', 'Estradiol', 'Testosterone']
};

const GaugeChart = ({ value, ranges }) => {
  const RADIAN = Math.PI / 180;
  const chartData = [
    { name: ranges[0].label, value: ranges[0].max, fill: '#4ade80' },
    { name: ranges[1].label, value: ranges[1].max - ranges[0].max, fill: '#fbbf24' },
    { name: ranges[2].label, value: ranges[2].max - ranges[1].max, fill: '#f87171' }
  ];

  const needle = (value, cx, cy) => {
    const maxValue = ranges[2].max;
    const ang = 180 * (1 - value / maxValue);
    const length = 35;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);

    return [
      <circle cx={cx} cy={cy} r={2} fill="#666" key="circle" />,
      <path
        d={`M ${cx} ${cy} L ${cx + length * cos} ${cy + length * sin}`}
        stroke="#666"
        strokeWidth={2}
        key="path"
      />
    ];
  };

  return (
    <PieChart width={100} height={100}>
      <Pie
        data={chartData}
        cx={50}
        cy={50}
        innerRadius={20}
        outerRadius={40}
        startAngle={180}
        endAngle={0}
        dataKey="value"
      >
        {chartData.map((entry, index) => (
          <Cell key={index} fill={entry.fill} />
        ))}
      </Pie>
      {needle(value, 50, 50)}
    </PieChart>
  );
};

const filterCategories = (categories, data) => {
  const filteredCategories = {};
  Object.entries(categories).forEach(([category, biomarkers]) => {
    const availableBiomarkers = biomarkers.filter(b => data[b] !== undefined);
    if (availableBiomarkers.length > 0) {
      filteredCategories[category] = availableBiomarkers;
    }
  });
  return filteredCategories;
};

const PDFReport = ({ data, imageUrl }) => {
  const filteredCategories = filterCategories(BIOMARKER_CATEGORIES, data);

  const getRiskLevel = (score) => {
    if (score >= 80) return { text: 'High Risk', color: 'text-red-600' };
    if (score >= 50) return { text: 'Moderate Risk', color: 'text-yellow-600' };
    return { text: 'Low Risk', color: 'text-green-600' };
  };

  const riskScore = calculateRiskScore(data);
  const riskLevel = getRiskLevel(riskScore);
  const recommendations = generateRecommendations(data);

  const getBiomarkerStatus = (name, value) => {
    const config = BIOMARKER_CONFIG[name];
    if (!config) return { text: 'N/A', color: 'text-gray-500' };

    const ranges = config.male && config.female ?
      (data.Gender === 'Male' ? config.male.ranges : config.female.ranges) :
      config.ranges;

    if (!ranges) return { text: 'N/A', color: 'text-gray-500' };

    const range = ranges.find(r => value >= r.min && value <= r.max);
    if (!range) return { text: 'Unknown', color: 'text-gray-500' };

    switch (range.label) {
      case 'Normal':
      case 'Optimal':
        return { text: range.label, color: 'text-green-600' };
      case 'Elevated':
      case 'Borderline':
      case 'Near Optimal':
        return { text: range.label, color: 'text-yellow-600' };
      default:
        return { text: range.label, color: 'text-red-600' };
    }
  };

  return (
    <div className="w-full p-8 bg-white min-h-screen">
      {/* Cover Page */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-6">Biomarker Assessment Report</h1>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-gray-600">Assessment Date: {new Date().toLocaleDateString()}</p>
            <p className="text-gray-600 mb-4">Patient ID: {data.id || 'N/A'}</p>
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Overall Risk Assessment</h2>
              <div className={`text-2xl font-bold ${riskLevel.color}`}>
                {riskLevel.text}
              </div>
              <div className="text-4xl font-bold mt-2">{riskScore}%</div>
            </div>
          </div>
          <div>
            <img src={imageUrl} alt="Retinal Scan" className="w-full rounded-lg shadow-lg" />
          </div>
        </div>
      </div>

      {/* Biomarker Categories */}
      {Object.entries(filteredCategories).map(([category, biomarkers]) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{category}</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="py-2">Biomarker</th>
                  <th className="py-2">Value</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Gauge</th>
                </tr>
              </thead>
              <tbody>
                {biomarkers.map(biomarker => {
                  const value = data[biomarker];
                  const status = getBiomarkerStatus(biomarker, value);
                  const config = BIOMARKER_CONFIG[biomarker];

                  return (
                    <tr key={biomarker} className="border-t">
                      <td className="py-3">{biomarker}</td>
                      <td className="py-3">
                        {value}
                        {config?.unit}
                      </td>
                      <td className={`py-3 ${status.color}`}>
                        {status.text}
                      </td>
                      <td className="py-3">
                        {biomarker !== 'Gender' && (
                          <GaugeChart
                            value={value}
                            ranges={config?.male && config?.female ?
                              (data.Gender === 'Male' ? config.male.ranges : config.female.ranges) :
                              config?.ranges}
                          />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Recommendations */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="space-y-4">
            {recommendations.map((r, i) => (
              <div key={i} className={r.color}>• {r.text}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFReport;