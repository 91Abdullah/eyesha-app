export const calculateRiskScore = (values) => {
    let score = 0;
    let maxScore = 0;
  
    // Cardiovascular Risk (30%)
    if (values['Systolic Blood Pressure'] !== undefined) {
      maxScore += 10;
      if (values['Systolic Blood Pressure'] > 140) score += 10;
      else if (values['Systolic Blood Pressure'] > 130) score += 7;
      else if (values['Systolic Blood Pressure'] > 120) score += 3;
    }
  
    if (values['Total Cholesterol'] !== undefined) {
      maxScore += 10;
      if (values['Total Cholesterol'] > 6.2) score += 10;
      else if (values['Total Cholesterol'] > 5.2) score += 7;
      else if (values['Total Cholesterol'] > 4.0) score += 3;
    }
  
    if (values['HDL-Cholesterol'] !== undefined) {
      maxScore += 10;
      if (values['HDL-Cholesterol'] < 1.0) score += 10;
      else if (values['HDL-Cholesterol'] < 1.3) score += 7;
      else if (values['HDL-Cholesterol'] < 1.6) score += 3;
    }
  
    // Metabolic Risk (30%)
    if (values['Glucose'] !== undefined) {
      maxScore += 10;
      if (values['Glucose'] > 7.0) score += 10;
      else if (values['Glucose'] > 5.6) score += 7;
      else if (values['Glucose'] > 5.0) score += 3;
    }
  
    if (values['HbA1c'] !== undefined) {
      maxScore += 10;
      if (values['HbA1c'] > 6.5) score += 10;
      else if (values['HbA1c'] > 5.7) score += 7;
      else if (values['HbA1c'] > 5.0) score += 3;
    }
  
    if (values['BMI'] !== undefined) {
      maxScore += 10;
      if (values['BMI'] > 30) score += 10;
      else if (values['BMI'] > 25) score += 7;
      else if (values['BMI'] > 18.5) score += 3;
    }
  
    // Hematological Risk (20%)
    if (values['Hematocrit'] !== undefined) {
      maxScore += 7;
      const gender = values['Gender'];
      if (gender === 'Male') {
        if (values['Hematocrit'] > 50 || values['Hematocrit'] < 38.5) score += 7;
        else if (values['Hematocrit'] > 48 || values['Hematocrit'] < 40) score += 4;
      } else {
        if (values['Hematocrit'] > 44.5 || values['Hematocrit'] < 34.9) score += 7;
        else if (values['Hematocrit'] > 42 || values['Hematocrit'] < 36) score += 4;
      }
    }
  
    if (values['Hemoglobin'] !== undefined) {
      maxScore += 7;
      const gender = values['Gender'];
      if (gender === 'Male') {
        if (values['Hemoglobin'] > 17.5 || values['Hemoglobin'] < 13.5) score += 7;
        else if (values['Hemoglobin'] > 16.5 || values['Hemoglobin'] < 14) score += 4;
      } else {
        if (values['Hemoglobin'] > 15.5 || values['Hemoglobin'] < 12.0) score += 7;
        else if (values['Hemoglobin'] > 14.5 || values['Hemoglobin'] < 12.5) score += 4;
      }
    }
  
    if (values['Creatinine'] !== undefined) {
      maxScore += 6;
      const gender = values['Gender'];
      if (gender === 'Male') {
        if (values['Creatinine'] > 120 || values['Creatinine'] < 60) score += 6;
        else if (values['Creatinine'] > 110 || values['Creatinine'] < 70) score += 3;
      } else {
        if (values['Creatinine'] > 90 || values['Creatinine'] < 45) score += 6;
        else if (values['Creatinine'] > 85 || values['Creatinine'] < 50) score += 3;
      }
    }
  
    // Age factor (10%)
    if (values['Age'] !== undefined) {
      maxScore += 10;
      if (values['Age'] > 65) score += 10;
      else if (values['Age'] > 45) score += 6;
      else if (values['Age'] > 30) score += 3;
    }
  
    // Hormonal Risk (10%)
    if (values['SHBG'] !== undefined) {
      maxScore += 4;
      const gender = values['Gender'];
      if (gender === 'Male') {
        if (values['SHBG'] < 10 || values['SHBG'] > 57) score += 4;
        else if (values['SHBG'] < 20 || values['SHBG'] > 50) score += 2;
      } else {
        if (values['SHBG'] < 20 || values['SHBG'] > 130) score += 4;
        else if (values['SHBG'] < 30 || values['SHBG'] > 100) score += 2;
      }
    }
  
    if (values['Testosterone'] !== undefined) {
      maxScore += 3;
      const gender = values['Gender'];
      if (gender === 'Male') {
        if (values['Testosterone'] < 8 || values['Testosterone'] > 35) score += 3;
        else if (values['Testosterone'] < 10 || values['Testosterone'] > 30) score += 1;
      } else {
        if (values['Testosterone'] < 0.5 || values['Testosterone'] > 2.4) score += 3;
        else if (values['Testosterone'] < 0.7 || values['Testosterone'] > 2.0) score += 1;
      }
    }
  
    if (values['Estradiol'] !== undefined) {
      maxScore += 3;
      const gender = values['Gender'];
      if (gender === 'Male') {
        if (values['Estradiol'] < 40 || values['Estradiol'] > 150) score += 3;
        else if (values['Estradiol'] < 50 || values['Estradiol'] > 130) score += 1;
      } else {
        if (values['Estradiol'] < 100 || values['Estradiol'] > 400) score += 3;
        else if (values['Estradiol'] < 150 || values['Estradiol'] > 350) score += 1;
      }
    }
  
    // Normalize score to 100
    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  };