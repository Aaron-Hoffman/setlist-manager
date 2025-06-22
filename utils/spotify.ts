import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

interface SpotifyTrack {
    uri: string;
    name: string;
    artists: { name: string }[];
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
        console.error('Spotify search failed:', await response.text());
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
        console.error('Failed to get Spotify user:', await userResponse.text());
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
        console.error('Failed to create playlist:', await createResponse.text());
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
        console.error('Failed to add tracks to playlist:', await addTracksResponse.text());
        return null;
    }

    return playlist.external_urls.spotify;
}

export async function getSpotifyAccessToken(): Promise<string | null> {
    const session = await getServerSession(authOptions);
    return session?.accessToken as string | null;
} 