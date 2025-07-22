import { NextResponse } from 'next/server';
import { createSpotifyPlaylistFromBand,createSpotifyPlaylistFromSetlist } from '@/utils/serverActions';

export async function POST(req: Request) {

  try {
    const { setListId, isBand } = await req.json();
    if (!setListId) {
      return NextResponse.json({ error: 'Missing setListId' }, { status: 400 });
    }

    const url = isBand ? await createSpotifyPlaylistFromBand(Number(setListId)) : await createSpotifyPlaylistFromSetlist(Number(setListId));
   
    if (!url) {
      return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 });
    }
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 });
  }
} 