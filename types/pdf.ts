import { SetList, Song, Band } from '@prisma/client';

export type SetListWithSongsAndBand = SetList & {
  songs: Song[];
  bandName: string;
};

export interface PDFExportOptions {
  includeArtist?: boolean;
  includeKey?: boolean;
  includeDate?: boolean;
  pageSize?: 'A4' | 'Letter';
  orientation?: 'portrait' | 'landscape';
}

export interface PDFExportResult {
  filename: string;
  success: boolean;
  error?: string;
} 