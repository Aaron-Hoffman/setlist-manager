import jsPDF from 'jspdf';
import { SetListWithSongsAndBand, PDFExportOptions, PDFExportResult } from '@/types/pdf';

export const exportSetListToPDF = (
  setList: SetListWithSongsAndBand, 
  options: PDFExportOptions = {}
): PDFExportResult => {
  try {
    const {
      includeArtist = false,
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
    
    // Set up fonts and styling for stage visibility
    doc.setFont('helvetica');
    
    // Band name - large and prominent
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(setList.band.name, doc.internal.pageSize.width / 2, 25, { align: 'center' });
    
    // Set list name
    doc.setFontSize(18);
    doc.text(setList.name, doc.internal.pageSize.width / 2, 40, { align: 'center' });
    
    // Songs list - start position
    let yPosition = 60;
    
    setList.songs.forEach((song, index) => {
      // Check if we need a new page
      if (yPosition > doc.internal.pageSize.height - 40) {
        doc.addPage();
        yPosition = 30;
      }
      
      const songNumber = index + 1;
      
      // Song number - large and bold
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(`${songNumber}.`, 20, yPosition);
      
      // Song title and details on same line
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      
      let songText = song.title;
      
      // Add key and artist info on same line if available
      if (includeKey || includeArtist) {
        const details = [];
        if (includeKey && song.key) details.push(song.key);
        if (includeArtist && song.artist) details.push(`Artist: ${song.artist}`);
        
        if (details.length > 0) {
          songText += ` (${details.join(' | ')})`;
        }
      }
      
      doc.text(songText, 35, yPosition);
      
      // Move to next song position
      yPosition += 20;
    });
    
    // Footer - simple page numbering
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${totalPages}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 15, { align: 'center' });
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