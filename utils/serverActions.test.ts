import * as serverActions from './serverActions';
import prisma from './db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as spotify from './spotify';

jest.mock('./db', () => ({
  __esModule: true,
  default: {
    band: { create: jest.fn(), delete: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    user: { findUnique: jest.fn() },
    setList: { create: jest.fn(), delete: jest.fn(), findUnique: jest.fn() },
    setListSong: { aggregate: jest.fn(), create: jest.fn(), deleteMany: jest.fn(), update: jest.fn() },
    song: { create: jest.fn(), delete: jest.fn(), update: jest.fn() },
  },
}));
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));
jest.mock('next/navigation', () => ({ redirect: jest.fn() }));
jest.mock('./spotify', () => ({
  searchSpotifyTrack: jest.fn(),
  createSpotifyPlaylist: jest.fn(),
  getSpotifyAccessToken: jest.fn(),
}));

describe('serverActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addBand', () => {
    it('creates a band and revalidates path', async () => {
      const user = { id: '1', name: null, email: null, emailVerified: null, image: null, password: null, createdAt: new Date(), updatedAt: new Date() };
      const formData = { get: jest.fn().mockReturnValue('Test Band') };
      await serverActions.addBand(user, formData as any);
      expect(prisma.band.create).toHaveBeenCalledWith({
        data: { name: 'Test Band', users: { connect: [{ id: '1' }] } },
      });
      expect(revalidatePath).toHaveBeenCalledWith('/bands');
    });
    it('throws if no user', async () => {
      await expect(serverActions.addBand(null, {} as any)).rejects.toThrow();
    });
  });

  describe('deleteBand', () => {
    it('deletes a band and revalidates path', async () => {
      await serverActions.deleteBand(2);
      expect(prisma.band.delete).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(revalidatePath).toHaveBeenCalledWith('/bands');
    });
  });

  describe('shareBand', () => {
    it('does nothing if band not found', async () => {
      (prisma.band.findUnique as jest.Mock).mockResolvedValueOnce(null);
      const result = await serverActions.shareBand(1, { get: jest.fn() } as any);
      expect(result).toBeUndefined();
    });
    it('throws if user to share with not found', async () => {
      (prisma.band.findUnique as jest.Mock).mockResolvedValueOnce({ id: 1, users: [] });
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
      const formData = { get: jest.fn().mockReturnValue('test@example.com') };
      await expect(serverActions.shareBand(1, formData as any)).rejects.toThrow();
    });
    it('updates band users and revalidates path', async () => {
      (prisma.band.findUnique as jest.Mock).mockResolvedValueOnce({ id: 1, users: [{ id: 1 }] });
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: 2 });
      const formData = { get: jest.fn().mockReturnValue('test@example.com') };
      await serverActions.shareBand(1, formData as any);
      expect(prisma.band.update).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith('/bands');
    });
  });

  describe('removeUserFromBand', () => {
    it('removes user from band and revalidates path', async () => {
      await serverActions.removeUserFromBand(1, '2');
      expect(prisma.band.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { users: { disconnect: [{ id: '2' }] } },
      });
      expect(revalidatePath).toHaveBeenCalledWith('/bands');
    });
  });

  describe('addSetList', () => {
    it('creates setlist and redirects', async () => {
      (prisma.setList.create as jest.Mock).mockResolvedValueOnce({ id: 5 });
      const formData = { get: jest.fn().mockImplementation((k) => (k === 'name' ? 'Setlist' : 1)) };
      await serverActions.addSetList(1, [], formData as any);
      expect(prisma.setList.create).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith('/bands/1/setlist/5');
    });
  });

  describe('deleteSetList', () => {
    it('deletes setlist and revalidates path', async () => {
      await serverActions.deleteSetList(3);
      expect(prisma.setList.delete).toHaveBeenCalledWith({ where: { id: 3 } });
      expect(revalidatePath).toHaveBeenCalledWith('/bands');
    });
  });

  describe('editSetList', () => {
    it('adds a song to setlist and revalidates', async () => {
      (prisma.setList.findUnique as jest.Mock).mockResolvedValueOnce({ bandId: 1 });
      (prisma.setListSong.aggregate as jest.Mock).mockResolvedValueOnce({ _max: { order: 2 } });
      await serverActions.editSetList({ id: 1 } as any, { id: 2 } as any, true);
      expect(prisma.setListSong.create).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith('/bands/1/setlist/1');
    });
    it('removes a song from setlist and revalidates', async () => {
      (prisma.setList.findUnique as jest.Mock).mockResolvedValueOnce({ bandId: 1 });
      await serverActions.editSetList({ id: 1 } as any, { id: 2 } as any, false);
      expect(prisma.setListSong.deleteMany).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith('/bands/1/setlist/1');
    });
    it('falls back to root revalidation if no bandId', async () => {
      (prisma.setList.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await serverActions.editSetList({ id: 1 } as any, { id: 2 } as any, false);
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });
  });

  describe('addSong', () => {
    it('creates a song and revalidates path', async () => {
      (spotify.getSpotifyAccessToken as jest.Mock).mockResolvedValueOnce(null);
      const formData = { get: jest.fn().mockImplementation((k) => {
        if (k === 'title') return 'Song';
        if (k === 'artist') return 'Artist';
        if (k === 'key') return 'C';
        return undefined;
      }) };
      await serverActions.addSong(1, formData as any);
      expect(prisma.song.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ title: 'Song', artist: 'Artist', key: 'C', bandId: 1, spotifyPerfectMatch: false })
      });
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });
  });

  describe('deleteSong', () => {
    it('deletes a song and revalidates path', async () => {
      await serverActions.deleteSong(2);
      expect(prisma.song.delete).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });
  });

  describe('editSong', () => {
    it('updates a song and revalidates path', async () => {
      (spotify.getSpotifyAccessToken as jest.Mock).mockResolvedValueOnce(null);
      const formData = { get: jest.fn().mockImplementation((k) => {
        if (k === 'title') return 'Song';
        if (k === 'artist') return 'Artist';
        if (k === 'key') return 'C';
        return undefined;
      }) };
      await serverActions.editSong(1, formData as any);
      expect(prisma.song.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({ title: 'Song', artist: 'Artist', key: 'C', spotifyPerfectMatch: false })
      });
      expect(revalidatePath).toHaveBeenCalledWith('/');
    });
  });

  describe('createSpotifyPlaylistFromSetlist', () => {
    it('throws if setlist not found', async () => {
      (prisma.setList.findUnique as jest.Mock).mockResolvedValueOnce(null);
      await expect(serverActions.createSpotifyPlaylistFromSetlist(1)).rejects.toThrow('Setlist not found');
    });
    it('throws if no access token', async () => {
      (prisma.setList.findUnique as jest.Mock).mockResolvedValueOnce({ songs: [], band: {}, name: 'Set', id: 1 });
      (spotify.getSpotifyAccessToken as jest.Mock).mockResolvedValueOnce(null);
      await expect(serverActions.createSpotifyPlaylistFromSetlist(1)).rejects.toThrow('No valid Spotify access token found');
    });
    it('throws if no matching tracks', async () => {
      (prisma.setList.findUnique as jest.Mock).mockResolvedValueOnce({ songs: [{ song: { spotifyPerfectMatch: true, title: 'Song', artist: 'Artist' } }], band: { name: 'Band' }, name: 'Set', id: 1 });
      (spotify.getSpotifyAccessToken as jest.Mock).mockResolvedValueOnce('token');
      (spotify.searchSpotifyTrack as jest.Mock).mockResolvedValueOnce(null);
      await expect(serverActions.createSpotifyPlaylistFromSetlist(1)).rejects.toThrow('No matching tracks found on Spotify');
    });
    it('throws if playlist creation fails', async () => {
      (prisma.setList.findUnique as jest.Mock).mockResolvedValueOnce({ songs: [{ song: { spotifyPerfectMatch: true, title: 'Song', artist: 'Artist' } }], band: { name: 'Band' }, name: 'Set', id: 1 });
      (spotify.getSpotifyAccessToken as jest.Mock).mockResolvedValueOnce('token');
      (spotify.searchSpotifyTrack as jest.Mock).mockResolvedValueOnce({ uri: 'spotify:track:123', name: 'Song', artists: [{ name: 'Artist' }] });
      (spotify.createSpotifyPlaylist as jest.Mock).mockResolvedValueOnce(null);
      await expect(serverActions.createSpotifyPlaylistFromSetlist(1)).rejects.toThrow('Failed to create Spotify playlist');
    });
    it('returns playlist url on success', async () => {
      (prisma.setList.findUnique as jest.Mock).mockResolvedValueOnce({ songs: [{ song: { spotifyPerfectMatch: true, title: 'Song', artist: 'Artist' } }], band: { name: 'Band' }, name: 'Set', id: 1 });
      (spotify.getSpotifyAccessToken as jest.Mock).mockResolvedValueOnce('token');
      (spotify.searchSpotifyTrack as jest.Mock).mockResolvedValueOnce({ uri: 'spotify:track:123', name: 'Song', artists: [{ name: 'Artist' }] });
      (spotify.createSpotifyPlaylist as jest.Mock).mockResolvedValueOnce('http://playlist.url');
      const url = await serverActions.createSpotifyPlaylistFromSetlist(1);
      expect(url).toBe('http://playlist.url');
    });
  });

  describe('reorderSetListSongs', () => {
    it('updates order for each song and revalidates', async () => {
      (prisma.setListSong.update as jest.Mock).mockResolvedValue({});
      await serverActions.reorderSetListSongs(1, [10, 20, 30]);
      expect(prisma.setListSong.update).toHaveBeenCalledTimes(3);
      expect(prisma.setListSong.update).toHaveBeenCalledWith({ where: { id: 10 }, data: { order: 1 } });
      expect(prisma.setListSong.update).toHaveBeenCalledWith({ where: { id: 20 }, data: { order: 2 } });
      expect(prisma.setListSong.update).toHaveBeenCalledWith({ where: { id: 30 }, data: { order: 3 } });
      expect(revalidatePath).toHaveBeenCalledWith('/bands/1');
    });
  });

  describe('updateSetListField', () => {
    it('updates setlist name field', async () => {
      await serverActions.updateSetListField(1, 'name', 'New Setlist Name');
      expect(prisma.setList.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'New Setlist Name' },
      });
    });

    it('updates setlist time field', async () => {
      const timeValue = '2024-01-01T10:00';
      await serverActions.updateSetListField(1, 'time', timeValue);
      expect(prisma.setList.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { time: new Date(timeValue) },
      });
    });

    it('updates setlist location field', async () => {
      await serverActions.updateSetListField(1, 'location', 'New Venue');
      expect(prisma.setList.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { location: 'New Venue' },
      });
    });

    it('throws error for unknown field', async () => {
      await expect(serverActions.updateSetListField(1, 'unknown', 'value')).rejects.toThrow('Unknown field: unknown');
    });
  });
}); 