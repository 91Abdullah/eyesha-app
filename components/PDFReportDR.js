import React, { useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell
} from 'recharts';
import BIOMARKER_CONFIG from '@/utils/biomarker_config';

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

const DRSeverityCard = ({ predictions }) => {

    useEffect(() => {
        console.log("DR Severity Predictions:", predictions);
    }, [predictions]);

  // DR severity levels
  const severityLevels = [
    { name: 'No DR', threshold: 0.5, color: 'bg-green-100 text-green-800' },
    { name: 'Mild', threshold: 0.5, color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Moderate', threshold: 0.5, color: 'bg-orange-100 text-orange-800' },
    { name: 'Severe', threshold: 0.5, color: 'bg-red-100 text-red-800' },
    { name: 'Proliferative DR', threshold: 0.5, color: 'bg-red-200 text-red-900' }
  ];

  // Find the highest probability severity
  let highestProb = -1;
  let highestSeverity = null;

  Object.entries(predictions).forEach(([severity, probability]) => {
    if (probability > highestProb) {
      highestProb = probability;
      highestSeverity = severity;
    }
  });

  // Find the appropriate severity level
  const severityLevel = severityLevels.find(level => 
    level.name.toLowerCase() === highestSeverity?.toLowerCase()
  ) || severityLevels[0];

  return (
    <div className="bg-white border rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3">Diabetic Retinopathy Assessment</h3>
      
      <div className="space-y-2">
        <div className={`rounded-md p-3 ${severityLevel.color}`}>
          <div className="flex justify-between">
            <span className="font-medium">Detected Severity:</span>
            <span className="font-bold">{highestSeverity}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Confidence:</span>
            <span>{(highestProb).toFixed(1)}%</span>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium mb-2">Detailed Probabilities:</h4>
          <div className="space-y-2">
            {Object.entries(predictions).map(([severity, probability]) => (
              <div key={severity} className="flex items-center">
                <div className="w-1/3 text-sm">{severity}:</div>
                <div className="w-2/3 bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-600 rounded-full h-4" 
                    style={{width: `${probability}%`}}
                  />
                </div>
                <div className="ml-2 text-sm">{(probability).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const getDRRecommendations = (drData, hba1cValue) => {
  // Determine highest probability DR severity
  let highestProb = -1;
  let highestSeverity = "No DR";
  
  if (drData && Object.keys(drData).length > 0) {
    Object.entries(drData["Diabetic Retinopathy"] || {}).forEach(([severity, probability]) => {
      if (probability > highestProb) {
        highestProb = probability;
        highestSeverity = severity;
      }
    });
  }

  // Basic recommendations based on DR severity and HbA1c
  const recommendations = [];

  // HbA1c specific recommendations
  if (hba1cValue) {
    if (hba1cValue >= 6.5) {
      recommendations.push({
        text: "Your HbA1c level indicates diabetes. Consult with your healthcare provider about diabetes management.",
        color: "text-red-600"
      });
    } else if (hba1cValue >= 5.7) {
      recommendations.push({
        text: "Your HbA1c level indicates prediabetes. Consider lifestyle modifications to prevent progression to diabetes.",
        color: "text-yellow-600"
      });
    } else {
      recommendations.push({
        text: "Your HbA1c level is within normal range. Continue maintaining healthy lifestyle habits.",
        color: "text-green-600"
      });
    }
  }

  // DR severity specific recommendations
  switch (highestSeverity.toLowerCase()) {
    case "no dr":
      recommendations.push({
        text: "No signs of diabetic retinopathy detected. Continue regular eye screenings.",
        color: "text-green-600"
      });
      break;
    case "mild npdr":
      recommendations.push({
        text: "Mild non-proliferative diabetic retinopathy detected. Follow up with an ophthalmologist within 6-12 months.",
        color: "text-yellow-600"
      });
      break;
    case "moderate npdr":
      recommendations.push({
        text: "Moderate non-proliferative diabetic retinopathy detected. Follow up with an ophthalmologist within 3-6 months.",
        color: "text-yellow-600"
      });
      break;
    case "severe npdr":
      recommendations.push({
        text: "Severe non-proliferative diabetic retinopathy detected. Urgent follow-up with an ophthalmologist within 1 month is recommended.",
        color: "text-red-600"
      });
      break;
    case "pdr":
      recommendations.push({
        text: "Proliferative diabetic retinopathy detected. Immediate evaluation by an ophthalmologist is required.",
        color: "text-red-600"
      });
      break;
    default:
      recommendations.push({
        text: "Follow up with your eye care provider for a comprehensive evaluation.",
        color: "text-blue-600"
      });
  }

  // General recommendations
  recommendations.push({
    text: "Maintain good blood glucose control to prevent progression of diabetic eye disease.",
    color: "text-blue-600"
  });
  
  recommendations.push({
    text: "Attend regular eye screenings as recommended by your healthcare provider.",
    color: "text-blue-600"
  });

  return recommendations;
};

const PDFReportDR = ({ data, drData, imageUrl, title = 'Diabetic Retinopathy Assessment Report' }) => {
  const hba1cValue = data?.HbA1c;
  const hba1cConfig = BIOMARKER_CONFIG["HbA1c"];
  
  const getBiomarkerStatus = (name, value) => {
    const config = BIOMARKER_CONFIG[name];
    if (!config) return { text: 'N/A', color: 'text-gray-500' };

    const ranges = config.ranges;
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

  const hba1cStatus = hba1cValue ? getBiomarkerStatus("HbA1c", hba1cValue) : null;
  const recommendations = getDRRecommendations(drData, hba1cValue);

  return (
    <div className="w-full p-8 bg-white min-h-screen">
      {/* Cover Page */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-gray-600">Assessment Date: {new Date().toLocaleDateString()}</p>
            <p className="text-gray-600 mb-4">Patient ID: {data?.id || 'N/A'}</p>
            
            {drData && Object.keys(drData).length > 0 && (
              <div className="mt-4">
                <DRSeverityCard predictions={drData["Diabetic Retinopathy"] || {}} />
              </div>
            )}
          </div>
          <div>
            <img src={imageUrl} alt="Retinal Scan" className="w-full rounded-lg shadow-lg" />
          </div>
        </div>
      </div>

      {/* HbA1c Section */}
      {hba1cValue && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Glycemic Control</h2>
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
                <tr className="border-t">
                  <td className="py-3">HbA1c</td>
                  <td className="py-3">
                    {hba1cValue}
                    {hba1cConfig?.unit}
                  </td>
                  <td className={`py-3 ${hba1cStatus?.color}`}>
                    {hba1cStatus?.text}
                  </td>
                  <td className="py-3">
                    <GaugeChart
                      value={hba1cValue}
                      ranges={hba1cConfig?.ranges}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

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

export default PDFReportDR;