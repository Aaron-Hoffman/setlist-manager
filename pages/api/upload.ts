// @ts-ignore
import formidable, { File as FormidableFile } from 'formidable';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const ALLOWED_MIME = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'text/plain',
  'text/csv',
  'text/markdown',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const form = formidable({
    multiples: false,
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    filter: ({ mimetype }: { mimetype?: string }) => (mimetype ? ALLOWED_MIME.includes(mimetype) : false),
  });

  form.parse(req, (err: Error | null, fields: any, files: any) => {
    if (err) {
      res.status(400).json({ error: 'File upload error', details: err.message });
      return;
    }
    const file = files.file as FormidableFile | FormidableFile[] | undefined;
    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    const uploadedFile = Array.isArray(file) ? file[0] : file;
    if (!uploadedFile) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    const relativePath = `/uploads/${path.basename(uploadedFile.filepath)}`;
    res.status(200).json({ filePath: relativePath, originalFilename: uploadedFile.originalFilename });
  });
} 