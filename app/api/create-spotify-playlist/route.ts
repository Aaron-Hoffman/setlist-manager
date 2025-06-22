import { NextResponse } from 'next/server';
import { createSpotifyPlaylistFromSetlist } from '@/utils/serverActions';

export async function POST(req: Request) {
  try {
    const { setListId } = await req.json();
    if (!setListId) {
      return NextResponse.json({ error: 'Missing setListId' }, { status: 400 });
    }
    const url = await createSpotifyPlaylistFromSetlist(Number(setListId));
    if (!url) {
      return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 });
    }
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 });
  }
} 