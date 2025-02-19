import { pdf } from '@react-pdf/renderer';
import PDFDocument from './PDFDocument';

export default async function generatePDF(data, imageUrl) {
  const blob = await pdf(
    <PDFDocument 
      data={data} 
      imageUrl={imageUrl}
    />
  ).toBlob();
  return URL.createObjectURL(blob);
}