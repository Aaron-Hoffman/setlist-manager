import jsPDF from 'jspdf';
import { SetListWithSongsAndBand, PDFExportOptions, PDFExportResult } from '@/types/pdf';

export const exportSetListToPDF = (
  setList: any, // Accepts sets for multi-set support
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
    doc.setFont('helvetica');

    // Detect if this is a full repertoire export
    const isFullRepertoire = setList.name === 'Full Repertoire';

    // Always include artist for full repertoire unless explicitly overridden
    const effectiveIncludeArtist =
      typeof options.includeArtist === 'boolean'
        ? options.includeArtist
        : isFullRepertoire;

    // Helper to render a set (with optional heading)
    const renderSet = (songs: any[], setHeading?: string, startY?: number) => {
      let yPosition = startY ?? (isFullRepertoire ? 38 : 60);
      if (setHeading) {
        doc.setFontSize(isFullRepertoire ? 13 : 20);
        doc.setFont('helvetica', 'bold');
        doc.text(setHeading, doc.internal.pageSize.width / 2, yPosition - (isFullRepertoire ? 6 : 10), { align: 'center' });
        yPosition += isFullRepertoire ? 6 : 10;
      }
      songs.forEach((song, index) => {
        if (yPosition > doc.internal.pageSize.height - (isFullRepertoire ? 18 : 40)) {
          doc.addPage();
          yPosition = setHeading ? (isFullRepertoire ? 18 : 40) : (isFullRepertoire ? 10 : 30);
        }
        const songNumber = index + 1;
        doc.setFontSize(isFullRepertoire ? 12 : 18);
        doc.setFont('helvetica', 'bold');
        doc.text(`${songNumber}.`, 20, yPosition);
        doc.setFontSize(isFullRepertoire ? 11 : 16);
        doc.setFont('helvetica', 'normal');
        let songText = song.title;
        if (includeKey || effectiveIncludeArtist) {
          const details = [];
          if (includeKey && song.key) details.push(song.key);
          if (effectiveIncludeArtist && song.artist) details.push(`Artist: ${song.artist}`);
          if (details.length > 0) {
            songText += ` (${details.join(' | ')})`;
          }
        }
        doc.text(songText, 35, yPosition);
        yPosition += isFullRepertoire ? 10 : 20;
      });
    };

    // Band name - large and prominent (only on first page)
    doc.setFontSize(isFullRepertoire ? 16 : 24);
    doc.setFont('helvetica', 'bold');
    doc.text(setList.band.name, doc.internal.pageSize.width / 2, isFullRepertoire ? 18 : 25, { align: 'center' });
    // Set list name (only on first page)
    doc.setFontSize(isFullRepertoire ? 13 : 18);
    doc.text(setList.name, doc.internal.pageSize.width / 2, isFullRepertoire ? 28 : 40, { align: 'center' });

    // Multi-set support
    if (setList.sets && setList.sets.length > 1) {
      setList.sets.forEach((set: any, idx: number) => {
        if (idx > 0) doc.addPage();
        // On first page, headings already rendered
        if (idx === 0) {
          renderSet(set.setSongs.map((s: any) => s.song), set.name || `Set ${idx + 1}`);
        } else {
          // On subsequent pages, set heading at top
          let yPosition = 20;
          doc.setFontSize(20);
          doc.setFont('helvetica', 'bold');
          doc.text(set.name || `Set ${idx + 1}`, doc.internal.pageSize.width / 2, yPosition, { align: 'center' });
          renderSet(set.setSongs.map((s: any) => s.song), undefined, yPosition + 15);
        }
      });
    } else if (setList.sets && setList.sets.length === 1) {
      renderSet(setList.sets[0].setSongs.map((s: any) => s.song));
    } else {
      // Fallback: flat songs array (legacy)
      let songsToRender = setList.songs;
      if (isFullRepertoire) {
        songsToRender = [...setList.songs].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
      }
      renderSet(songsToRender);
    }

    // Footer - simple page numbering
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(isFullRepertoire ? 8 : 10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Page ${i} of ${totalPages}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - (isFullRepertoire ? 8 : 15), { align: 'center' });
    }

    // Generate filename
    const filename = `${setList.band.name.replace(/[^a-zA-Z0-9]/g, '_')}_${setList.name.replace(/[^a-zA-Z0-9]/g, '_')}_setlist.pdf`;
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