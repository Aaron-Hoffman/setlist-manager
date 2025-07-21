import prisma from '@/utils/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bandId = searchParams.get('bandId');
  if (!bandId) {
    return NextResponse.json({ error: 'Missing bandId' }, { status: 400 });
  }
  const songs = await prisma.song.findMany({
    where: { bandId: Number(bandId) },
    select: { tags: true },
  });
  const tagSet = new Set<string>();
  for (const song of songs) {
    let tags: string[] = [];
    if (Array.isArray(song.tags)) {
      tags = song.tags.map(String);
    } else if (typeof song.tags === 'string') {
      try {
        const parsed = JSON.parse(song.tags);
        if (Array.isArray(parsed)) tags = parsed.map(String);
      } catch {}
    }
    for (const tag of tags) {
      tagSet.add(tag);
    }
  }
  return NextResponse.json(Array.from(tagSet));
} 