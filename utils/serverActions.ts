'use server'

import { SetList, Song, User } from "@prisma/client";
import createSetList from "./createSetList";
import prisma from "./db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { searchSpotifyTrack, createSpotifyPlaylist, getSpotifyAccessToken } from './spotify';

// Utility to normalize strings for loose matching
function normalizeForSpotifyMatch(str: string): string {
    return str
        .toLowerCase()
        .replace(/\s*\(live\)$/i, '')    // Remove ' (Live)'
        .replace(/\s*\(remastered(\s*\d{4})?\)$/i, '')    // Remove ' (Remastered)' or ' (Remastered 2011)'
        .replace(/\s*\(album version\)$/i, '')    // Remove ' (Album Version)'
        .replace(/\s*[-–—]\s*.*$/i, '') // Remove any suffix starting with ' - '
        .replace(/\band\b|\&/gi, ' and ') // Treat 'and' and '&' as equivalent
        .replace(/[^a-z0-9]/gi, '')        // Remove punctuation and spaces
        .trim();
}

export const addBand = async (user: User | null, formData: FormData) => {
    if (!user) {
        throw new Error("Error must sign in to create a band");
    }

   await prisma.band.create({
        data: {
            name: formData.get('name') as string,
            users: {
                connect: [{ id: user.id }]
            }
        },
    })

    return revalidatePath('/bands')
}

export const deleteBand = async (bandId: number) => {
    await prisma.band.delete({
        where: {
          id: bandId,
        },
    })

    return revalidatePath('/bands')
}

export const shareBand = async (bandId: number, formData: FormData) => {
    const bandWithUsers = await prisma.band.findUnique({
        where: {
            id: bandId,
        },
        include: {
            users: true
        }
    })

    if (!bandWithUsers) return

    const emailToShareWith: string = formData.get('email') as string

    const userToShareWith: User | null = await prisma.user.findUnique({
        where: {
            email: emailToShareWith
        },
    })

    if (!userToShareWith) throw new Error('User with that email does not exist.');

    const userList: User[] = [...bandWithUsers.users, userToShareWith]
    
    await prisma.band.update({
        where: {
          id: bandWithUsers.id,
        },
        data: {
            users: {
                set: userList.map(u => ({ id: u.id }))
            }
        },
    })

    return revalidatePath('/bands')
}

export const removeUserFromBand = async (bandId: number, userId: string) => {
    await prisma.band.update({
        where: {
            id: bandId,
        },
        data: {
            users: {
                disconnect: [{ id: userId }]
            }
        },
    })

    return revalidatePath('/bands')
}

// Type for new set input
export type SetInput = {
  name: string;
  songIds: number[];
};

// Updated addSetList to support multiple sets
export const addSetList = async (
  bandId: number,
  sets: SetInput[] | undefined,
  formData: FormData,
  allSongs?: Song[] // for backward compatibility if sets not provided
) => {
  // If sets not provided, fallback to one set with all songs
  let setsToCreate: SetInput[];
  if (!sets || sets.length === 0) {
    setsToCreate = [
      {
        name: 'Set 1',
        songIds: (allSongs || []).map((s) => s.id),
      },
    ];
  } else {
    setsToCreate = sets;
  }

  // Create the SetList
  const newSetList = await prisma.setList.create({
    data: {
      name: formData.get('name') as string,
      bandId: Number(bandId),
    },
  });

  // For each set, create the Set and its SetSongs
  for (let i = 0; i < setsToCreate.length; i++) {
    const setInput = setsToCreate[i];
    const set = await prisma.set.create({
      data: {
        setListId: newSetList.id,
        name: setInput.name,
        order: i + 1,
      },
    });
    // Create SetSong entries for this set
    for (let j = 0; j < setInput.songIds.length; j++) {
      await prisma.setSong.create({
        data: {
          setId: set.id,
          songId: setInput.songIds[j],
          order: j + 1,
        },
      });
    }
  }

  return redirect(`/bands/${bandId}/setlist/${newSetList.id}`);
};

export const deleteSetList = async (setListId: number) => {
    await prisma.setList.delete({
        where: {
            id: setListId,
        },
    })

    return revalidatePath('/bands')
}

// Updated editSetList to work with Set/SetSong
export const editSetList = async (
  setId: number,
  song: Song,
  add: boolean
) => {
  // Find the set and its setListId for revalidation
  const set = await prisma.set.findUnique({
    where: { id: setId },
    select: { setListId: true }
  });
  const setListId = set?.setListId;

  // Fetch the bandId for the setList
  let bandId: number | undefined = undefined;
  if (setListId) {
    const setList = await prisma.setList.findUnique({
      where: { id: setListId },
      select: { bandId: true }
    });
    bandId = setList?.bandId;
  }

  if (add) {
    // Find the current max order for this set
    const maxOrder = await prisma.setSong.aggregate({
      where: { setId },
      _max: { order: true }
    });
    const nextOrder = (maxOrder._max.order ?? 0) + 1;
    await prisma.setSong.create({
      data: {
        setId,
        songId: song.id,
        order: nextOrder,
      },
    });
  } else {
    await prisma.setSong.deleteMany({
      where: {
        setId,
        songId: song.id,
      },
    });
  }

  // Revalidate the setlist page
  if (setListId && bandId) {
    return revalidatePath(`/bands/${bandId}/setlist/${setListId}`);
  }
  return revalidatePath('/');
};

export const addSong = async (bandId: number, formData: FormData) => {
    const song = {
        title: formData.get('title') as string,
        artist: formData.get('artist') as string,
        key: formData.get('key') as string,
        chart: formData.get('chart') as string | undefined,
        bandId: Number(bandId)
    }

    let spotifyPerfectMatch = false;
    try {
        const accessToken = await getSpotifyAccessToken();
        if (accessToken) {
            const spotifyTrack = await searchSpotifyTrack(
                `${song.title} ${song.artist ?? ''}`.trim(),
                accessToken
            );
            if (spotifyTrack) {
                // Loosened perfect match: ignore case, punctuation, and ' - Live'/' (Live)'
                const normTitle = normalizeForSpotifyMatch(song.title);
                const normSpotifyTitle = normalizeForSpotifyMatch(spotifyTrack.name);
                const titleMatch = normTitle === normSpotifyTitle;
                const normArtist = song.artist ? normalizeForSpotifyMatch(song.artist) : '';
                const artistMatch = song.artist
                    ? spotifyTrack.artists.some(a => normalizeForSpotifyMatch(a.name) === normArtist)
                    : true;
                if (titleMatch && artistMatch) {
                    spotifyPerfectMatch = true;
                }
            }
        }
    } catch (e) {
        // Ignore errors, just fallback to false
    }

    await prisma.song.create({
        data: {
            ...song,
            spotifyPerfectMatch,
        },
    })

    return revalidatePath('/')
}

export const deleteSong = async (songId: number) => {
    await prisma.song.delete({
        where: {
          id: songId,
        },
    })

    return revalidatePath('/')
}

export const editSong = async (songId: number, formData: FormData) => {
    const song = {
        title: formData.get('title') as string,
        artist: formData.get('artist') as string,
        key: formData.get('key') as string,
        chart: formData.get('chart') as string | undefined,
    }

    let spotifyPerfectMatch = false;
    try {
        const accessToken = await getSpotifyAccessToken();
        if (accessToken) {
            const spotifyTrack = await searchSpotifyTrack(
                `${song.title} ${song.artist ?? ''}`.trim(),
                accessToken
            );
            if (spotifyTrack) {
                // Loosened perfect match: ignore case, punctuation, and ' - Live'/' (Live)'
                const normTitle = normalizeForSpotifyMatch(song.title);
                const normSpotifyTitle = normalizeForSpotifyMatch(spotifyTrack.name);
                const titleMatch = normTitle === normSpotifyTitle;
                const normArtist = song.artist ? normalizeForSpotifyMatch(song.artist) : '';
                const artistMatch = song.artist
                    ? spotifyTrack.artists.some(a => normalizeForSpotifyMatch(a.name) === normArtist)
                    : true;
                if (titleMatch && artistMatch) {
                    spotifyPerfectMatch = true;
                }
            }
        }
    } catch (e) {
        // Ignore errors, just fallback to false
    }

    await prisma.song.update({
        where: {
          id: songId,
        },
        data: {
            ...song,
            spotifyPerfectMatch,
        },
    })

    return revalidatePath('/')
}

// Updated createSpotifyPlaylistFromSetlist to use Sets and SetSongs
export async function createSpotifyPlaylistFromSetlist(setListId: number) {
  const setList = await prisma.setList.findUnique({
    where: { id: setListId },
    include: {
      sets: {
        orderBy: { order: 'asc' },
        include: {
          setSongs: {
            orderBy: { order: 'asc' },
            include: { song: true },
          },
        },
      },
      band: true,
    },
  }) as any;

  if (!setList) {
    throw new Error('Setlist not found');
  }

  const accessToken = await getSpotifyAccessToken();
  if (!accessToken) {
    throw new Error('No valid Spotify access token found. Please reconnect your Spotify account by signing out and signing back in with Spotify.');
  }

  // Flatten all songs in order across all sets
  const trackUris: string[] = [];
  for (const set of setList.sets) {
    for (const setSong of set.setSongs) {
      const song = setSong.song;
      if (!song.spotifyPerfectMatch) continue; // Only include perfect matches
      const spotifyTrack = await searchSpotifyTrack(
        `${song.title} ${song.artist}`,
        accessToken
      );
      if (spotifyTrack) {
        trackUris.push(spotifyTrack.uri);
      }
    }
  }

  if (trackUris.length === 0) {
    throw new Error('No matching tracks found on Spotify');
  }

  const playlistUrl = await createSpotifyPlaylist(
    `${setList.name} - ${setList.band.name}`,
    `Setlist created from Setlist Manager`,
    trackUris,
    accessToken
  );

  if (!playlistUrl) {
    throw new Error('Failed to create Spotify playlist. Please try again or reconnect your Spotify account.');
  }

  return playlistUrl;
}

// Updated reorderSetListSongs to work with Set/SetSong
export const reorderSetListSongs = async (setId: number, orderedSetSongIds: number[]) => {
  // Update the order field for each SetSong in the set
  await Promise.all(
    orderedSetSongIds.map((id, idx) =>
      prisma.setSong.update({
        where: { id },
        data: { order: idx + 1 },
      })
    )
  );
  return revalidatePath(`/bands/set/${setId}`);
};