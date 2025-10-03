import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFOptions {
  filename?: string;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
  scale?: number;
}

export const generatePDFFromElement = async (
  elementId: string, 
  options: PDFOptions = {}
): Promise<void> => {
  const {
    filename = 'dashboard-report.pdf',
    format = 'a4',
    orientation = 'portrait',
    quality = 1.0,
    scale = 2
  } = options;

  try {
    // Get the element to convert
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Show loading state
    const originalCursor = document.body.style.cursor;
    document.body.style.cursor = 'wait';

    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      height: element.scrollHeight,
      width: element.scrollWidth
    });

    // Calculate PDF dimensions
    const imgData = canvas.toDataURL('image/png', quality);
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 10; // Small top margin

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

    // Add header
    pdf.setFontSize(16);
    pdf.setTextColor(60, 60, 60);
    pdf.text('CAST Dashboard Report', 20, 10);

    // Add footer with timestamp
    const now = new Date();
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    pdf.text(
      `Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, 
      20, 
      pdfHeight - 10
    );

    // Save the PDF
    pdf.save(filename);

    // Restore cursor
    document.body.style.cursor = originalCursor;

  } catch (error) {
    console.error('Error generating PDF:', error);
    document.body.style.cursor = 'default';
    throw error;
  }
};

export const generateMultiPagePDF = async (
  sections: Array<{ elementId: string; title: string }>,
  options: PDFOptions = {}
): Promise<void> => {
  const {
    filename = 'dashboard-report.pdf',
    format = 'a4',
    orientation = 'portrait',
    quality = 1.0,
    scale = 1.5
  } = options;

  try {
    document.body.style.cursor = 'wait';

    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Add title page
    pdf.setFontSize(24);
    pdf.setTextColor(40, 40, 40);
    pdf.text('CAST Dashboard Report', pdfWidth / 2, 50, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.setTextColor(80, 80, 80);
    const now = new Date();
    pdf.text(
      `Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, 
      pdfWidth / 2, 
      70, 
      { align: 'center' }
    );

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const element = document.getElementById(section.elementId);
      
      if (!element) {
        console.warn(`Element with ID "${section.elementId}" not found, skipping...`);
        continue;
      }

      // Add new page for each section (except first)
      if (i > 0) {
        pdf.addPage();
      } else {
        pdf.addPage(); // Add page after title page
      }

      // Add section title
      pdf.setFontSize(16);
      pdf.setTextColor(60, 60, 60);
      pdf.text(section.title, 20, 20);

      // Create canvas from the element
      const canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        height: element.scrollHeight,
        width: element.scrollWidth
      });

      const imgData = canvas.toDataURL('image/png', quality);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min((pdfWidth - 40) / imgWidth, (pdfHeight - 60) / imgHeight);
      const imgX = 20;
      const imgY = 30;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      // Add page footer
      pdf.setFontSize(8);
      pdf.setTextColor(120, 120, 120);
      pdf.text(`Page ${i + 1}`, pdfWidth - 30, pdfHeight - 10);
    }

    pdf.save(filename);
    document.body.style.cursor = 'default';

  } catch (error) {
    console.error('Error generating multi-page PDF:', error);
    document.body.style.cursor = 'default';
    throw error;
  }
};