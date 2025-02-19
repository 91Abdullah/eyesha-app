import { calculateRiskScore } from './risk_score';

export const generateRecommendations = (data) => {
    const recommendations = [];
    const riskScore = calculateRiskScore(data);
  
    // High-risk recommendations
    if (riskScore >= 80) {
      recommendations.push({
        text: 'Immediate consultation with healthcare provider recommended',
        color: 'text-red-600'
      });
    }
  
    // Cardiovascular recommendations
    if (data['Systolic Blood Pressure'] > 130 || data['Diastolic Blood Pressure'] > 80) {
      recommendations.push({
        text: 'Regular blood pressure monitoring advised',
        color: 'text-yellow-600'
      });
    }
  
    if (data['Total Cholesterol'] > 5.2 || data['LDL-Cholesterol'] > 3.3) {
      recommendations.push({
        text: 'Lipid profile monitoring and lifestyle modifications recommended',
        color: 'text-yellow-600'
      });
    }
  
    // Metabolic recommendations
    if (data['Glucose'] > 5.6 || data['HbA1c'] > 5.7) {
      recommendations.push({
        text: 'Blood glucose monitoring and diabetes screening recommended',
        color: 'text-yellow-600'
      });
    }
  
    if (data['BMI'] > 25) {
      recommendations.push({
        text: 'Weight management program recommended',
        color: 'text-yellow-600'
      });
    }
  
    // Hematological recommendations
    if (data['Hemoglobin'] < (data['Gender'] === 'Male' ? 13.5 : 12.0) || 
        data['Hematocrit'] < (data['Gender'] === 'Male' ? 38.5 : 34.9)) {
      recommendations.push({
        text: 'Complete blood count follow-up recommended',
        color: 'text-yellow-600'
      });
    }
  
    // Hormonal recommendations
    const hasHormonalImbalance = (
      data['SHBG'] !== undefined && (
        data['Gender'] === 'Male' ? 
          (data['SHBG'] < 10 || data['SHBG'] > 57) :
          (data['SHBG'] < 20 || data['SHBG'] > 130)
      )
    ) || (
      data['Testosterone'] !== undefined && (
        data['Gender'] === 'Male' ?
          (data['Testosterone'] < 8 || data['Testosterone'] > 35) :
          (data['Testosterone'] < 0.5 || data['Testosterone'] > 2.4)
      )
    );
  
    if (hasHormonalImbalance) {
      recommendations.push({
        text: 'Hormonal evaluation recommended',
        color: 'text-yellow-600'
      });
    }
  
    // General recommendations based on risk score
    if (riskScore >= 50) {
      recommendations.push({
        text: 'Schedule follow-up assessment in 3 months',
        color: 'text-yellow-600'
      });
    } else {
      recommendations.push({
        text: 'Schedule routine follow-up in 6 months',
        color: 'text-gray-600'
      });
    }
  
    recommendations.push({
      text: 'Maintain healthy lifestyle with regular exercise and balanced diet',
      color: 'text-gray-600'
    });
  
    return recommendations;
  };