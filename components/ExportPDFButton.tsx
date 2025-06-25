'use client';

import { SetListWithSongsAndBand } from '@/types/pdf';
import { exportSetListToPDF } from '@/utils/pdfExport';

interface ExportPDFButtonProps {
  setList: SetListWithSongsAndBand;
}

const ExportPDFButton = ({ setList }: ExportPDFButtonProps) => {
  const handleExport = () => {
    try {
      const result = exportSetListToPDF(setList);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to export PDF');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      title="Export setlist to PDF"
    >
      <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export PDF
    </button>
  );
};

export default ExportPDFButton; 