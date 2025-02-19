import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Open Sans',
  src: 'https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0C4nY1M2xLER.ttf',
});

const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' },
  section: { marginTop: 15, marginBottom: 15 },
  sectionHeader: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  gridContainer: { flexDirection: 'row', marginBottom: 20 },
  leftColumn: { flex: 1 },
  rightColumn: { flex: 1, alignItems: 'center' },
  image: { width: 200, height: 200 },
  text: { fontSize: 12, marginBottom: 5 },
  table: { marginTop: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E5E7EB', padding: 8 },
  tableHeader: { fontWeight: 'bold' },
  tableCell: { flex: 1 },
  riskHigh: { color: '#DC2626' },
  riskMedium: { color: '#F59E0B' },
  riskLow: { color: '#10B981' },
  recommendations: { marginTop: 20, padding: 10, backgroundColor: '#F3F4F6' }
});

const BIOMARKER_CATEGORIES = {
    Demographics: ['Age', 'Gender'],
    Cardiovascular: ['Systolic Blood Pressure', 'Diastolic Blood Pressure', 'Total Cholesterol', 'HDL-Cholesterol', 'LDL-Cholesterol', 'Triglyceride'],
    Metabolic: ['Glucose', 'HbA1c', 'Insulin'],
    Hematological: ['Hematocrit', 'Hemoglobin', 'Red Blood Cell', 'Creatinine'],
    Hormonal: ['SHBG', 'Estradiol', 'Testosterone']
  };

const PDFDocument = ({ data }) => {
  const getRiskLevel = (score) => {
    if (score >= 80) return { text: 'High Risk', style: styles.riskHigh };
    if (score >= 50) return { text: 'Moderate Risk', style: styles.riskMedium };
    return { text: 'Low Risk', style: styles.riskLow };
  };

  const calculateRiskScore = () => 75; // Implement actual risk calculation

  const risk = getRiskLevel(calculateRiskScore());

  return (
    <Document>
      {data.map((imageData, index) => (
        <Page key={index} size="A4" style={styles.page} wrap>
          <Text style={styles.header}>Biomarker Assessment Report</Text>
          <Text style={styles.text}>Image {index + 1}</Text>

          <View style={styles.gridContainer}>
            {/* Left column with assessments */}
            <View style={styles.leftColumn}>
              <Text style={styles.text}>Assessment Date: {new Date().toLocaleDateString()}</Text>
              <Text style={styles.text}>Patient ID: {imageData.id || 'N/A'}</Text>
              
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Overall Risk Assessment</Text>
                <Text style={risk.style}>{risk.text}</Text>
                <Text style={[styles.text, { fontSize: 24 }]}>{calculateRiskScore(imageData.predictions)}%</Text>
              </View>
            </View>
            
            {/* Right column with image */}
            <View style={styles.rightColumn}>
              <Image style={styles.image} src={imageData.imageUrl} />
            </View>
          </View>

          {/* Biomarker categories */}
          {Object.entries(BIOMARKER_CATEGORIES).map(([category, biomarkers]) => (
            <View key={category} style={styles.section}>
              <Text style={styles.sectionHeader}>{category}</Text>
              
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.tableCell}>Biomarker</Text>
                  <Text style={styles.tableCell}>Value</Text>
                  <Text style={styles.tableCell}>Status</Text>
                </View>
                
                {biomarkers.map(biomarker => {
                  const value = imageData.predictions[biomarker];
                  const config = BIOMARKER_CONFIG[biomarker];
                  return (
                    <View key={biomarker} style={styles.tableRow}>
                      <Text style={styles.tableCell}>{biomarker}</Text>
                      <Text style={styles.tableCell}>
                        {value}{config?.unit || ''}
                      </Text>
                      <Text style={styles.tableCell}>
                        {getBiomarkerStatus(biomarker, value, imageData.predictions.Gender)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}

          <View style={styles.recommendations}>
            <Text style={styles.sectionHeader}>Recommendations</Text>
            {generateRecommendations(imageData.predictions).map((rec, index) => (
              <Text key={index} style={[styles.text, { color: rec.color }]}>
                • {rec.text}
              </Text>
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default PDFDocument;