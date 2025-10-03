import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2 } from 'lucide-react';
import { generatePDFFromElement, generateMultiPagePDF, PDFOptions } from '@/lib/pdf-utils';
import { toast } from '@/hooks/use-toast';

interface PDFDownloadButtonProps {
  elementId?: string;
  sections?: Array<{ elementId: string; title: string }>;
  filename?: string;
  buttonText?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  disabled?: boolean;
  pdfOptions?: PDFOptions;
}

export function PDFDownloadButton({
  elementId,
  sections,
  filename,
  buttonText = 'Download PDF',
  variant = 'outline',
  size = 'default',
  className,
  disabled = false,
  pdfOptions = {}
}: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    
    try {
      const defaultFilename = filename || `cast-dashboard-${new Date().toISOString().split('T')[0]}.pdf`;
      const options = { filename: defaultFilename, ...pdfOptions };

      if (sections && sections.length > 0) {
        // Multi-page PDF generation
        await generateMultiPagePDF(sections, options);
        toast({
          title: "PDF Generated Successfully",
          description: `Multi-page report "${defaultFilename}" has been downloaded.`,
        });
      } else if (elementId) {
        // Single page PDF generation
        await generatePDFFromElement(elementId, options);
        toast({
          title: "PDF Generated Successfully", 
          description: `Report "${defaultFilename}" has been downloaded.`,
        });
      } else {
        throw new Error('Either elementId or sections must be provided');
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast({
        title: "PDF Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={disabled || isGenerating}
      variant={variant}
      size={size}
      className={className}
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          {buttonText}
        </>
      )}
    </Button>
  );
}

interface DashboardExportButtonProps {
  dashboardName: string;
  elementId: string;
  className?: string;
}

export function DashboardExportButton({ 
  dashboardName, 
  elementId, 
  className 
}: DashboardExportButtonProps) {
  return (
    <PDFDownloadButton
      elementId={elementId}
      filename={`${dashboardName.toLowerCase().replace(/\s+/g, '-')}-report-${new Date().toISOString().split('T')[0]}.pdf`}
      buttonText={`Export ${dashboardName}`}
      variant="outline"
      size="sm"
      className={className}
      pdfOptions={{
        format: 'a4',
        orientation: 'portrait',
        quality: 0.95,
        scale: 1.5
      }}
    />
  );
}

interface MultiDashboardExportButtonProps {
  sections: Array<{ elementId: string; title: string }>;
  filename?: string;
  className?: string;
}

export function MultiDashboardExportButton({ 
  sections, 
  filename,
  className 
}: MultiDashboardExportButtonProps) {
  const defaultFilename = filename || `cast-comprehensive-report-${new Date().toISOString().split('T')[0]}.pdf`;
  
  return (
    <PDFDownloadButton
      sections={sections}
      filename={defaultFilename}
      buttonText="Export All Dashboards"
      variant="default"
      size="default"
      className={className}
      pdfOptions={{
        format: 'a4',
        orientation: 'portrait',
        quality: 0.9,
        scale: 1.2
      }}
    />
  );
}