// @ts-ignore
import formidable, { File as FormidableFile } from 'formidable';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs'; // Required for formidable

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Allowed mime types
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

export async function POST(req: NextRequest) {
  return new Promise(async (resolve) => {
    const form = formidable({
      multiples: false,
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filter: ({ mimetype }: { mimetype?: string }) => {
        return mimetype ? ALLOWED_MIME.includes(mimetype) : false;
      },
    });

    // formidable expects a Node.js IncomingMessage, not a web stream
    // Next.js API routes (app router) provide a web stream, so we need to convert
    // See: https://github.com/node-formidable/formidable/issues/937
    const buffers = [];
    for await (const chunk of req.body as any) {
      buffers.push(chunk);
    }
    const buffer = Buffer.concat(buffers);
    const mockReq: any = new (require('stream').Readable)();
    mockReq.push(buffer);
    mockReq.push(null);
    mockReq.headers = req.headers;

    form.parse(mockReq, (err: Error | null, fields: any, files: any) => {
      if (err) {
        resolve(NextResponse.json({ error: 'File upload error', details: err.message }, { status: 400 }));
        return;
      }
      const file = files.file as FormidableFile | FormidableFile[] | undefined;
      if (!file) {
        resolve(NextResponse.json({ error: 'No file uploaded' }, { status: 400 }));
        return;
      }
      const uploadedFile = Array.isArray(file) ? file[0] : file;
      if (!uploadedFile) {
        resolve(NextResponse.json({ error: 'No file uploaded' }, { status: 400 }));
        return;
      }
      // Return the relative file path
      const relativePath = `/uploads/${path.basename(uploadedFile.filepath)}`;
      resolve(NextResponse.json({ filePath: relativePath, originalFilename: uploadedFile.originalFilename }));
    });
  });
}

export function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}

export function PUT() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}

export function DELETE() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
} 