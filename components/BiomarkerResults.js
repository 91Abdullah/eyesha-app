import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, RadialBarChart, RadialBar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const BIOMARKER_CONFIG = {
  // Demographics and Body Composition
  "Age": {
    ranges: [
      { min: 0, max: 30, label: "Young Adult", color: "#4ade80" },
      { min: 31, max: 60, label: "Middle Age", color: "#fbbf24" },
      { min: 61, max: 100, label: "Senior", color: "#f87171" }
    ],
    unit: " years",
    type: "gauge",
    description: "Chronological age"
  },
  "Body mass index": {
    ranges: [
      { min: 0, max: 18.4, label: "Underweight", color: "#fbbf24" },
      { min: 18.5, max: 24.9, label: "Normal", color: "#4ade80" },
      { min: 25, max: 29.9, label: "Overweight", color: "#fbbf24" },
      { min: 30, max: 50, label: "Obese", color: "#f87171" }
    ],
    unit: " kg/m²",
    type: "gauge",
    description: "BMI indicates body fat based on height and weight"
  },
  
  // Blood Pressure
  "Systolic blood pressure": {
    ranges: [
      { min: 0, max: 120, label: "Normal", color: "#4ade80" },
      { min: 121, max: 139, label: "Prehypertension", color: "#fbbf24" },
      { min: 140, max: 250, label: "Hypertension", color: "#f87171" }
    ],
    unit: " mmHg",
    type: "gauge",
    description: "Upper blood pressure value when heart beats"
  },
  "Diastolic blood pressure": {
    ranges: [
      { min: 0, max: 80, label: "Normal", color: "#4ade80" },
      { min: 81, max: 89, label: "Prehypertension", color: "#fbbf24" },
      { min: 90, max: 150, label: "Hypertension", color: "#f87171" }
    ],
    unit: " mmHg",
    type: "gauge",
    description: "Lower blood pressure value between heart beats"
  },

  // Metabolic
  "Glucose": {
    ranges: [
      { min: 0, max: 5.5, label: "Normal", color: "#4ade80" },
      { min: 5.6, max: 7.0, label: "Prediabetes", color: "#fbbf24" },
      { min: 7.1, max: 20, label: "Diabetes", color: "#f87171" }
    ],
    unit: " mmol/L",
    type: "needle",
    description: "Blood sugar level measurement"
  },
  "Haemoglobin A1c": {
    ranges: [
      { min: 0, max: 5.6, label: "Normal", color: "#4ade80" },
      { min: 5.7, max: 6.4, label: "Prediabetes", color: "#fbbf24" },
      { min: 6.5, max: 15, label: "Diabetes", color: "#f87171" }
    ],
    unit: "%",
    type: "needle",
    description: "Average blood sugar over past 2-3 months"
  },
  "Insulin": {
    ranges: [
      { min: 0, max: 25, label: "Normal", color: "#4ade80" },
      { min: 26, max: 35, label: "Borderline", color: "#fbbf24" },
      { min: 36, max: 100, label: "High", color: "#f87171" }
    ],
    unit: " mcunit/mL",
    type: "bar",
    description: "Hormone regulating blood sugar levels"
  },

  // Lipid Profile
  "Total cholesterol": {
    ranges: [
      { min: 0, max: 5.2, label: "Normal", color: "#4ade80" },
      { min: 5.3, max: 6.2, label: "Borderline", color: "#fbbf24" },
      { min: 6.3, max: 10, label: "High", color: "#f87171" }
    ],
    unit: " mmol/L",
    type: "bar",
    description: "Total cholesterol level in blood"
  },
  "HDL-cholesterol": {
    ranges: [
      { min: 0, max: 1.0, label: "Low", color: "#f87171" },
      { min: 1.1, max: 1.5, label: "Moderate", color: "#fbbf24" },
      { min: 1.6, max: 3, label: "High", color: "#4ade80" }
    ],
    unit: " mmol/L",
    type: "bar",
    description: "'Good' cholesterol levels"
  },
  "LDL-cholesterol": {
    ranges: [
      { min: 0, max: 2.6, label: "Optimal", color: "#4ade80" },
      { min: 2.7, max: 3.3, label: "Near Optimal", color: "#fbbf24" },
      { min: 3.4, max: 7, label: "High", color: "#f87171" }
    ],
    unit: " mmol/L",
    type: "bar",
    description: "'Bad' cholesterol levels"
  },
  "Triglyceride": {
    ranges: [
      { min: 0, max: 1.7, label: "Normal", color: "#4ade80" },
      { min: 1.8, max: 2.2, label: "Borderline", color: "#fbbf24" },
      { min: 2.3, max: 5, label: "High", color: "#f87171" }
    ],
    unit: " mmol/L",
    type: "bar",
    description: "Type of fat in blood"
  },

  // Blood Parameters
  "Haematocrit": {
    ranges: [
      { min: 0, max: 35, label: "Low", color: "#f87171" },
      { min: 36, max: 45, label: "Normal", color: "#4ade80" },
      { min: 46, max: 60, label: "High", color: "#fbbf24" }
    ],
    unit: "%",
    type: "gauge",
    description: "Percentage of blood composed of red blood cells"
  },
  "Haemoglobin": {
    ranges: [
      { min: 0, max: 11.9, label: "Low", color: "#f87171" },
      { min: 12, max: 15.5, label: "Normal", color: "#4ade80" },
      { min: 15.6, max: 20, label: "High", color: "#fbbf24" }
    ],
    unit: " g/dL",
    type: "gauge",
    description: "Protein in red blood cells carrying oxygen"
  },
  "Red Blood Cell": {
    ranges: [
      { min: 0, max: 3.9, label: "Low", color: "#f87171" },
      { min: 4.0, max: 5.5, label: "Normal", color: "#4ade80" },
      { min: 5.6, max: 7, label: "High", color: "#fbbf24" }
    ],
    unit: " x10⁶/μL",
    type: "gauge",
    description: "Count of red blood cells"
  },

  // Kidney Function
  "Creatinine": {
    ranges: [
      { min: 0, max: 62, label: "Low", color: "#fbbf24" },
      { min: 63, max: 115, label: "Normal", color: "#4ade80" },
      { min: 116, max: 200, label: "High", color: "#f87171" }
    ],
    unit: " μmol/L",
    type: "gauge",
    description: "Waste product indicating kidney function"
  },

  // Hormones
  "Sex hormone binding globulin": {
    ranges: [
      { min: 0, max: 20, label: "Low", color: "#f87171" },
      { min: 21, max: 60, label: "Normal", color: "#4ade80" },
      { min: 61, max: 100, label: "High", color: "#fbbf24" }
    ],
    unit: " nmol/L",
    type: "bar",
    description: "Protein binding sex hormones"
  },
  "Estradiol": {
    ranges: [
      { min: 0, max: 100, label: "Low", color: "#f87171" },
      { min: 101, max: 400, label: "Normal", color: "#4ade80" },
      { min: 401, max: 700, label: "High", color: "#fbbf24" }
    ],
    unit: " pmol/L",
    type: "bar",
    description: "Primary female sex hormone"
  },
  "Testosterone": {
    ranges: [
      { min: 0, max: 8, label: "Low", color: "#f87171" },
      { min: 9, max: 35, label: "Normal", color: "#4ade80" },
      { min: 36, max: 50, label: "High", color: "#fbbf24" }
    ],
    unit: " nmol/L",
    type: "bar",
    description: "Primary male sex hormone"
  },
  "HbA1c": {
    ranges: [
      { min: 0, max: 5.6, label: "Normal", color: "#4ade80" },
      { min: 5.7, max: 6.4, label: "Prediabetes", color: "#fbbf24" },
      { min: 6.5, max: 15, label: "Diabetes", color: "#f87171" }
    ],
    unit: "%",
    type: "needle",
    description: "HbA1c measures average blood sugar over 2-3 months. Values over 6.5% indicate diabetes."
  },
  "Blood Pressure": {
    ranges: [
      { min: 0, max: 120, label: "Normal", color: "#4ade80" },
      { min: 121, max: 140, label: "Prehypertension", color: "#fbbf24" },
      { min: 141, max: 200, label: "Hypertension", color: "#f87171" }
    ],
    unit: "mmHg",
    type: "gauge",
    description: "Blood pressure measurement indicates cardiovascular health."
  },
  "Cholesterol": {
    ranges: [
      { min: 0, max: 200, label: "Desirable", color: "#4ade80" },
      { min: 201, max: 239, label: "Borderline", color: "#fbbf24" },
      { min: 240, max: 500, label: "High", color: "#f87171" }
    ],
    unit: "mg/dL",
    type: "bar",
    description: "Total cholesterol levels indicate cardiovascular risk."
  }
  // Add other biomarkers with specific ranges and chart types
};

const PieChartWithNeedle = ({ value, config }) => {
  const { ranges } = config;
  const data = ranges.map(range => ({
    name: range.label,
    value: range.max - range.min,
    color: range.color
  }));

  const totalValue = ranges[ranges.length - 1].max - ranges[0].min;
  const needleAngle = ((value - ranges[0].min) / totalValue) * 360;
  const currentRange = ranges.find(r => value >= r.min && value <= r.max);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={180}
            endAngle={0}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <g transform={`translate(${150},${150})`}>
            <line
              y2={-60}
              stroke="black"
              strokeWidth={4}
              transform={`rotate(${needleAngle})`}
            />
            <circle r={5} fill="black" />
          </g>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 w-full text-center">
        <span className={`text-lg font-bold`} style={{ color: currentRange?.color }}>
          {value}{config.unit}
        </span>
      </div>
    </div>
  );
};

const GaugeChart = ({ value, config }) => {
  const { ranges } = config;
  const currentRange = ranges.find(r => value >= r.min && value <= r.max);
  const data = [{
    name: 'Value',
    value: ((value - ranges[0].min) / (ranges[ranges.length-1].max - ranges[0].min)) * 100,
    fill: currentRange?.color || "#gray"
  }];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadialBarChart
        innerRadius="60%"
        outerRadius="100%"
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar
          minAngle={15}
          background
          clockWise={true}
          dataKey="value"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-lg font-bold"
          fill={currentRange?.color}
        >
          {value}{config.unit}
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

const BarChartComponent = ({ value, config }) => {
  const { ranges } = config;
  const currentRange = ranges.find(r => value >= r.min && value <= r.max);
  const data = ranges.map(range => ({
    name: range.label,
    max: range.max,
    color: range.color
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="max">
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
        <line
          x1={0}
          y1={value}
          x2="100%"
          y2={value}
          stroke="black"
          strokeWidth={2}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const BiomarkerCard = ({ biomarker, value }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const config = BIOMARKER_CONFIG[biomarker];
  
  if (!config) return null;

  const ChartComponent = {
    'needle': PieChartWithNeedle,
    'gauge': GaugeChart,
    'bar': BarChartComponent
  }[config.type] || PieChartWithNeedle;

  const currentRange = config.ranges.find(r => value >= r.min && value <= r.max);

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="p-4 border rounded-lg shadow hover:shadow-lg transition-all cursor-pointer bg-white"
      >
        <h3 className="text-lg font-semibold mb-4">{biomarker}</h3>
        <ChartComponent value={value} config={config} />
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm font-medium">{currentRange?.label}</span>
          <span 
            className="px-3 py-1 rounded-full text-white text-sm"
            style={{ backgroundColor: currentRange?.color }}
          >
            {value}{config.unit}
          </span>
        </div>
      </div>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent className="max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{biomarker} Analysis</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="p-6">
            <div className="h-96">
              <ChartComponent value={value} config={config} />
            </div>
            <div className="mt-6 space-y-4">
              <p className="text-gray-600">{config.description}</p>
              <div className="grid grid-cols-3 gap-4">
                {config.ranges.map((range, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${range.color}22` }}
                  >
                    <div className="font-semibold" style={{ color: range.color }}>
                      {range.label}
                    </div>
                    <div className="text-sm">
                      {range.min} - {range.max} {config.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const BiomarkerResults = ({ results }) => {
  if (!results) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {Object.entries(results).map(([biomarker, value]) => (
        <BiomarkerCard
          key={biomarker}
          biomarker={biomarker}
          value={value}
        />
      ))}
    </div>
  );
};

export default BiomarkerResults;