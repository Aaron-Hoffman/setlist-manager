import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import prisma from "./db";

interface SpotifyTrack {
    uri: string;
    name: string;
    artists: { name: string }[];
}

interface TokenResponse {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
}

async function refreshSpotifyToken(refreshToken: string): Promise<TokenResponse | null> {
    const basic = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
    
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basic}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }),
        });

        if (!response.ok) {
            console.error('Failed to refresh Spotify token:', await response.text());
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error refreshing Spotify token:', error);
        return null;
    }
}

async function getValidSpotifyAccessToken(userId: string): Promise<string | null> {
    // Get the user's Spotify account
    const account = await prisma.account.findFirst({
        where: {
            userId: userId,
            provider: 'spotify',
        },
    });

    if (!account || !account.access_token) {
        console.log('No Spotify account found for user:', userId);
        return null;
    }

    // Check if token is expired (with 5 minute buffer)
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = account.expires_at || 0;
    
    console.log(`Token expires at: ${new Date(expiresAt * 1000).toISOString()}, current time: ${new Date(now * 1000).toISOString()}`);
    
    if (now >= expiresAt - 300) { // 5 minute buffer
        console.log('Token is expired or will expire soon, attempting refresh...');
        // Token is expired or will expire soon, try to refresh
        if (account.refresh_token) {
            const refreshResult = await refreshSpotifyToken(account.refresh_token);
            
            if (refreshResult) {
                console.log('Token refresh successful');
                // Update the account with new tokens
                await prisma.account.update({
                    where: {
                        provider_providerAccountId: {
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                        },
                    },
                    data: {
                        access_token: refreshResult.access_token,
                        refresh_token: refreshResult.refresh_token || account.refresh_token,
                        expires_at: Math.floor(Date.now() / 1000) + refreshResult.expires_in,
                    },
                });
                
                return refreshResult.access_token;
            } else {
                console.log('Token refresh failed, removing account');
                // Refresh failed, remove the account
                await prisma.account.delete({
                    where: {
                        provider_providerAccountId: {
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                        },
                    },
                });
                return null;
            }
        } else {
            console.log('No refresh token available, removing account');
            // No refresh token, remove the account
            await prisma.account.delete({
                where: {
                    provider_providerAccountId: {
                        provider: account.provider,
                        providerAccountId: account.providerAccountId,
                    },
                },
            });
            return null;
        }
    }

    console.log('Using existing valid token');
    return account.access_token;
}

export async function searchSpotifyTrack(query: string, accessToken: string): Promise<SpotifyTrack | null> {
    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Spotify search failed:', errorText);
        
        // If token is expired, return null to trigger re-authentication
        if (response.status === 401) {
            console.error('Spotify token expired');
        }
        return null;
    }

    const data = await response.json();
    const track = data.tracks?.items[0];
    
    if (!track) return null;

    return {
        uri: track.uri,
        name: track.name,
        artists: track.artists.map((artist: any) => ({ name: artist.name }))
    };
}

export async function createSpotifyPlaylist(
    name: string,
    description: string,
    trackUris: string[],
    accessToken: string
): Promise<string | null> {
    // Get user's Spotify ID
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!userResponse.ok) {
        const errorText = await userResponse.text();
        console.error('Failed to get Spotify user:', errorText);
        
        if (userResponse.status === 401) {
            console.error('Spotify token expired during user fetch');
        }
        return null;
    }

    const userData = await userResponse.json();
    const userId = userData.id;

    // Create playlist
    const createResponse = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                description,
                public: false,
            }),
        }
    );

    if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error('Failed to create playlist:', errorText);
        
        if (createResponse.status === 401) {
            console.error('Spotify token expired during playlist creation');
        }
        return null;
    }

    const playlist = await createResponse.json();
    const playlistId = playlist.id;

    // Add tracks to playlist
    const addTracksResponse = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uris: trackUris,
            }),
        }
    );

    if (!addTracksResponse.ok) {
        const errorText = await addTracksResponse.text();
        console.error('Failed to add tracks to playlist:', errorText);
        
        if (addTracksResponse.status === 401) {
            console.error('Spotify token expired during track addition');
        }
        return null;
    }

    return playlist.external_urls.spotify;
}

export async function getSpotifyAccessToken(): Promise<string | null> {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
        return null;
    }

    return await getValidSpotifyAccessToken(session.user.id);
}

// Utility to normalize strings for loose matching (duplicated from serverActions for script use)
export function normalizeForSpotifyMatch(str: string): string {
    return str
        .toLowerCase()
        .replace(/\s*\(live\)$/i, '')    // Remove ' (Live)'
        .replace(/\s*\(remastered(\s*\d{4})?\)$/i, '')    // Remove ' (Remastered)' or ' (Remastered 2011)'
        .replace(/\s*[-–—]\s*.*$/i, '') // Remove any suffix starting with ' - '
        .replace(/[^a-z0-9]/gi, '')        // Remove punctuation and spaces
        .trim();
}

// Utility to update all songs' spotifyPerfectMatch field
export async function updateAllSpotifyPerfectMatches() {
    const songs = await prisma.song.findMany();
    const accessToken = await getSpotifyAccessToken();
    if (!accessToken) {
        throw new Error('No valid Spotify access token found.');
    }
    for (const song of songs) {
        let spotifyPerfectMatch = false;
        try {
            const spotifyTrack = await searchSpotifyTrack(
                `${song.title} ${song.artist ?? ''}`.trim(),
                accessToken
            );
            if (spotifyTrack) {
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
        } catch (e) {
            // Ignore errors, just fallback to false
        }
        await prisma.song.update({
            where: { id: song.id },
            data: { spotifyPerfectMatch },
        });
    }
    return true;
} 