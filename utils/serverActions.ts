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

    if (!userToShareWith) return

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

export const addSetList = async (bandId: number, songs: Song[], formData: FormData) => {
    const newSetList = await prisma.setList.create({
        data: {
            name: formData.get('name') as string,
            songs: {
                connect: createSetList(songs, Number(formData.get('number'))),
            },
            bandId: Number(bandId)
        },
    })

    return redirect(`/bands/${bandId}/setlist/${newSetList.id}`)
}

export const deleteSetList = async (setListId: number) => {
    await prisma.setList.delete({
        where: {
            id: setListId,
        },
    })

    return revalidatePath('/bands')
}

export const editSetList = async (setList: SetList, song: Song, add: boolean) => {

    const setListWithSongs = await prisma.setList.findUnique({
        where: {
            id: Number(setList.id),
        },
        include: {
            songs: true
        }
    })
    
    if (!setListWithSongs) return 

    const songList = add ? [...setListWithSongs.songs, song] : setListWithSongs.songs.filter(setListItem => setListItem.id !== song.id);

    await prisma.setList.update({
        where: {
          id: setList.id,
        },
        data: {
            songs: {
                set: songList.map(song => ({ id: song.id })),
            }
        },
    })

    return revalidatePath('/')
}

export const addSong = async (bandId: number, formData: FormData) => {
    const song = {
        title: formData.get('title') as string,
        artist: formData.get('artist') as string,
        key: formData.get('key') as string,
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

export async function createSpotifyPlaylistFromSetlist(setListId: number) {
    const setList = await prisma.setList.findUnique({
        where: { id: setListId },
        include: {
            songs: true,
            band: true
        }
    });

    if (!setList) {
        throw new Error('Setlist not found');
    }

    const accessToken = await getSpotifyAccessToken();
    if (!accessToken) {
        throw new Error('No valid Spotify access token found. Please reconnect your Spotify account by signing out and signing back in with Spotify.');
    }

    const trackUris: string[] = [];
    for (const song of setList.songs) {
        const spotifyTrack = await searchSpotifyTrack(
            `${song.title} ${song.artist}`,
            accessToken
        );
        if (spotifyTrack) {
            trackUris.push(spotifyTrack.uri);
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