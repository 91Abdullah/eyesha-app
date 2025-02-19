const BIOMARKER_CONFIG = {
  'Gender': {
    ranges: [{ min: 0, max: 1, label: "Female" }, { min: 1, max: 2, label: "Male" }],
    unit: ""
  },
  'Age': {
    ranges: [{ min: 0, max: 44, label: "Young Adult" }, { min: 45, max: 64, label: "Middle Age" }, { min: 65, max: 100, label: "Elderly" }],
    unit: " years"
  },
  'BMI': {
    ranges: [{ min: 0, max: 18.4, label: "Underweight" }, { min: 18.5, max: 24.9, label: "Normal" }, { min: 25, max: 50, label: "Overweight" }],
    unit: " kg/m²"
  },
  'Systolic Blood Pressure': {
    ranges: [{ min: 0, max: 120, label: "Normal" }, { min: 121, max: 129, label: "Elevated" }, { min: 130, max: 250, label: "High" }],
    unit: " mmHg"
  },
  'Diastolic Blood Pressure': {
    ranges: [{ min: 0, max: 80, label: "Normal" }, { min: 81, max: 89, label: "Elevated" }, { min: 90, max: 150, label: "High" }],
    unit: " mmHg"
  },
  'Glucose': {
    ranges: [{ min: 0, max: 5.5, label: "Normal" }, { min: 5.6, max: 6.9, label: "Prediabetes" }, { min: 7.0, max: 20, label: "Diabetes" }],
    unit: " mmol/L"
  },
  'HbA1c': {
    ranges: [{ min: 0, max: 5.6, label: "Normal" }, { min: 5.7, max: 6.4, label: "Prediabetes" }, { min: 6.5, max: 15, label: "Diabetes" }],
    unit: "%"
  },
  'Insulin': {
    ranges: [{ min: 0, max: 25, label: "Normal" }, { min: 26, max: 35, label: "Elevated" }, { min: 36, max: 100, label: "High" }],
    unit: " mcunit/mL"
  },
  'Total Cholesterol': {
    ranges: [{ min: 0, max: 5.2, label: "Normal" }, { min: 5.3, max: 6.2, label: "Borderline" }, { min: 6.3, max: 10, label: "High" }],
    unit: " mmol/L"
  },
  'HDL-Cholesterol': {
    male: {
      ranges: [{ min: 0, max: 1.0, label: "Low" }, { min: 1.1, max: 1.3, label: "Medium" }, { min: 1.4, max: 3, label: "High" }]
    },
    female: {
      ranges: [{ min: 0, max: 1.2, label: "Low" }, { min: 1.3, max: 1.5, label: "Medium" }, { min: 1.6, max: 3, label: "High" }]
    },
    unit: " mmol/L"
  },
  'LDL-Cholesterol': {
    ranges: [{ min: 0, max: 2.6, label: "Optimal" }, { min: 2.7, max: 3.3, label: "Near Optimal" }, { min: 3.4, max: 7, label: "High" }],
    unit: " mmol/L"
  },
  'Triglyceride': {
    ranges: [{ min: 0, max: 1.7, label: "Normal" }, { min: 1.8, max: 2.2, label: "Borderline" }, { min: 2.3, max: 5, label: "High" }],
    unit: " mmol/L"
  },
  'Hematocrit': {
    male: {
      ranges: [{ min: 0, max: 38.5, label: "Low" }, { min: 38.6, max: 50, label: "Normal" }, { min: 50.1, max: 60, label: "High" }]
    },
    female: {
      ranges: [{ min: 0, max: 34.9, label: "Low" }, { min: 35, max: 44.5, label: "Normal" }, { min: 44.6, max: 60, label: "High" }]
    },
    unit: "%"
  },
  'Hemoglobin': {
    male: {
      ranges: [{ min: 0, max: 13.4, label: "Low" }, { min: 13.5, max: 17.5, label: "Normal" }, { min: 17.6, max: 20, label: "High" }]
    },
    female: {
      ranges: [{ min: 0, max: 11.9, label: "Low" }, { min: 12.0, max: 15.5, label: "Normal" }, { min: 15.6, max: 20, label: "High" }]
    },
    unit: " g/dL"
  },
  'Red Blood Cell': {
    male: {
      ranges: [{ min: 0, max: 4.3, label: "Low" }, { min: 4.4, max: 5.7, label: "Normal" }, { min: 5.8, max: 7, label: "High" }]
    },
    female: {
      ranges: [{ min: 0, max: 3.9, label: "Low" }, { min: 4.0, max: 5.1, label: "Normal" }, { min: 5.2, max: 7, label: "High" }]
    },
    unit: " x10⁶/μL"
  },
  'Creatinine': {
    male: {
      ranges: [{ min: 0, max: 60, label: "Low" }, { min: 61, max: 120, label: "Normal" }, { min: 121, max: 200, label: "High" }]
    },
    female: {
      ranges: [{ min: 0, max: 45, label: "Low" }, { min: 46, max: 90, label: "Normal" }, { min: 91, max: 200, label: "High" }]
    },
    unit: " μmol/L"
  },
  'SHBG': {
    male: {
      ranges: [{ min: 0, max: 10, label: "Low" }, { min: 11, max: 57, label: "Normal" }, { min: 58, max: 100, label: "High" }]
    },
    female: {
      ranges: [{ min: 0, max: 20, label: "Low" }, { min: 21, max: 130, label: "Normal" }, { min: 131, max: 200, label: "High" }]
    },
    unit: " nmol/L"
  },
  'Estradiol': {
    male: {
      ranges: [{ min: 0, max: 40, label: "Low" }, { min: 41, max: 150, label: "Normal" }, { min: 151, max: 300, label: "High" }]
    },
    female: {
      ranges: [{ min: 0, max: 100, label: "Low" }, { min: 101, max: 400, label: "Normal" }, { min: 401, max: 700, label: "High" }]
    },
    unit: " pmol/L"
  },
  'Testosterone': {
    male: {
      ranges: [{ min: 0, max: 8, label: "Low" }, { min: 9, max: 35, label: "Normal" }, { min: 36, max: 50, label: "High" }]
    },
    female: {
      ranges: [{ min: 0, max: 0.5, label: "Low" }, { min: 0.6, max: 2.4, label: "Normal" }, { min: 2.5, max: 4, label: "High" }]
    },
    unit: " nmol/L"
  }
};

export default BIOMARKER_CONFIG;