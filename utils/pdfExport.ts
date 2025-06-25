import jsPDF from 'jspdf';
import { SetListWithSongsAndBand, PDFExportOptions, PDFExportResult } from '@/types/pdf';

export const exportSetListToPDF = (
  setList: SetListWithSongsAndBand, 
  options: PDFExportOptions = {}
): PDFExportResult => {
  try {
    const {
      includeArtist = true,
      includeKey = true,
      includeDate = true,
      pageSize = 'A4',
      orientation = 'portrait'
    } = options;

    const doc = new jsPDF({
      orientation,
      unit: 'mm',
      format: pageSize
    });
    
    // Set up fonts and styling
    doc.setFont('helvetica');
    doc.setFontSize(20);
    
    // Header
    doc.setFillColor(59, 130, 246); // Indigo color
    doc.rect(0, 0, doc.internal.pageSize.width, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.text('SETLIST', doc.internal.pageSize.width / 2, 15, { align: 'center' });
    
    // Band name
    doc.setFontSize(16);
    doc.text(setList.band.name, doc.internal.pageSize.width / 2, 25, { align: 'center' });
    
    // Reset text color for content
    doc.setTextColor(0, 0, 0);
    
    // Set list name
    doc.setFontSize(14);
    doc.text(`Set List: ${setList.name}`, 20, 45);
    
    // Date
    if (includeDate) {
      const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.setFontSize(10);
      doc.text(`Generated: ${currentDate}`, 20, 55);
    }
    
    // Songs list
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Songs:', 20, includeDate ? 75 : 65);
    
    doc.setFont('helvetica', 'normal');
    let yPosition = includeDate ? 85 : 75;
    
    setList.songs.forEach((song, index) => {
      // Check if we need a new page
      if (yPosition > doc.internal.pageSize.height - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      const songNumber = index + 1;
      const songText = `${songNumber}. ${song.title}`;
      
      // Song title
      doc.setFont('helvetica', 'bold');
      doc.text(songText, 20, yPosition);
      
      // Song details (key and artist)
      if (includeKey || includeArtist) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const details = [];
        if (includeKey && song.key) details.push(`Key: ${song.key}`);
        if (includeArtist && song.artist) details.push(`Artist: ${song.artist}`);
        
        if (details.length > 0) {
          doc.text(details.join(' | '), 25, yPosition + 5);
          yPosition += 15;
        } else {
          yPosition += 10;
        }
        
        doc.setFontSize(12);
      } else {
        yPosition += 10;
      }
    });
    
    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${totalPages}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }
    
    // Generate filename
    const filename = `${setList.band.name.replace(/[^a-zA-Z0-9]/g, '_')}_${setList.name.replace(/[^a-zA-Z0-9]/g, '_')}_setlist.pdf`;
    
    // Save the PDF
    doc.save(filename);
    
    return {
      filename,
      success: true
    };
  } catch (error) {
    return {
      filename: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}; 