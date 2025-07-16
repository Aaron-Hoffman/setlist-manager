import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  const { filePath } = req.body;
  if (!filePath || typeof filePath !== 'string') {
    res.status(400).json({ error: 'Missing filePath' });
    return;
  }
  // Only allow deletion within public/uploads
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const fullPath = path.join(process.cwd(), 'public', filePath.replace(/^\/+/, ''));
  if (!fullPath.startsWith(uploadsDir)) {
    res.status(400).json({ error: 'Invalid filePath' });
    return;
  }
  fs.unlink(fullPath, (err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to delete file', details: err.message });
      return;
    }
    res.status(200).json({ success: true });
  });
} 