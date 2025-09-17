'use client';

import React from 'react';
import DeleteSongButton from "@/components/buttons/DeleteSongButton";
import EditSetListButton from "./buttons/EditSetListButton";
import EditSongForm from "@/components/forms/EditSongForm";
import { Song } from "@prisma/client";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { reorderSetListSongs } from '@/utils/serverActions';
import { useTransition } from 'react';
import { copySongToBand, getUserBands } from "@/utils/serverActions";
import toast from 'react-hot-toast';
import { formatKeyLabel } from '../utils/formatKeyLabel';

export type SetListSongWithSong = {
    id: number;
    setListId: number;
    songId: number;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    song: Song;
};

export type SongListProps = {
    songList: Song[] | SetListSongWithSong[],
    add?: boolean,
    setId?: number,
    bandId: number,
}

// Helper to get tags as array of strings
function getTags(tags: any): string[] {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags.map(String);
    if (typeof tags === 'string') {
        try {
            const parsed = JSON.parse(tags);
            if (Array.isArray(parsed)) return parsed.map(String);
        } catch {}
    }
    return [];
}

const SongList = ({songList, add, setId, bandId}: SongListProps) => {
    const [isPending, startTransition] = useTransition();
    
    // Convert Song[] to SetListSongWithSong[] format if needed
    const normalizedSongs: SetListSongWithSong[] = React.useMemo(() => {
        if (songList.length === 0) return [];
        
        // Check if it's already in SetListSongWithSong format
        if ('song' in songList[0]) {
            return songList as SetListSongWithSong[];
        }
        
        // Convert Song[] to SetListSongWithSong[] format
        return (songList as Song[]).map((song, index) => ({
            id: song.id, // Use song.id as the join ID for repertoire
            setListId: setId || 0,
            songId: song.id,
            order: index + 1,
            createdAt: song.createdAt,
            updatedAt: song.updatedAt,
            song: song
        }));
    }, [songList, setId]);

    const [localSongs, setLocalSongs] = React.useState(normalizedSongs);

    React.useEffect(() => {
        setLocalSongs(normalizedSongs);
    }, [normalizedSongs]);

    // Sort alphabetically by song title for repertoire (non-setlist)
    const sortedLocalSongs = React.useMemo(() => {
        return [...localSongs].sort((a, b) =>
            a.song.title.localeCompare(b.song.title, undefined, { sensitivity: 'base' })
        );
    }, [localSongs]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const reordered = Array.from(localSongs);
        const [removed] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, removed);
        setLocalSongs(reordered);
        // Persist new order if setId is present and this is a set (not repertoire)
        if (setId && !add) {
            startTransition(() => {
                reorderSetListSongs(setId, reordered.map(s => s.id));
            });
        }
    };

    // State for copy modal
    const [copyModalOpen, setCopyModalOpen] = React.useState<number | null>(null); // songId or null
    const [bands, setBands] = React.useState<{id: number, name: string}[]>([]);
    const [selectedBandId, setSelectedBandId] = React.useState<number | null>(null);
    const [loadingBands, setLoadingBands] = React.useState(false);
    const [copying, setCopying] = React.useState(false);
    // Fetch bands when modal opens
    React.useEffect(() => {
        if (copyModalOpen !== null) {
            setLoadingBands(true);
            getUserBands()
                .then(data => {
                    if (Array.isArray(data)) {
                        setBands(data.filter((b: any) => b.id !== bandId));
                    }
                })
                .finally(() => setLoadingBands(false));
        }
    }, [copyModalOpen, bandId]);

    const [showRenameModal, setShowRenameModal] = React.useState(false);
    const [renameTitle, setRenameTitle] = React.useState("");
    const [renameTarget, setRenameTarget] = React.useState<{ songId: number, bandId: number } | null>(null);

    // Bulk selection state
    const [selectedSongIds, setSelectedSongIds] = React.useState<number[]>([]);
    const [bulkCopyMode, setBulkCopyMode] = React.useState(false);

    // Helper for toggling selection
    const toggleSongSelection = (songId: number) => {
        setSelectedSongIds(prev => prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]);
    };
    const selectAll = () => setSelectedSongIds(sortedLocalSongs.map(s => s.song.id));
    const clearSelection = () => setSelectedSongIds([]);

    if (!localSongs.length) {
        return (
            <div className="text-center py-12">
                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No songs</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new song.</p>
            </div>
        )
    }

    if (setId && !add) {
        return (
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="setlist-songs">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                            {localSongs.map((setListSong, idx) => (
                                <Draggable key={setListSong.id} draggableId={setListSong.id.toString()} index={idx}>
                                    {(provided, snapshot) => (
                                        <div 
                                            ref={provided.innerRef} 
                                            {...provided.draggableProps} 
                                            {...provided.dragHandleProps} 
                                            className={`bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors ${snapshot.isDragging ? 'bg-indigo-50 shadow-lg' : ''}`}
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                                            {setListSong.song.title}
                                                        </h3>
                                                        {setListSong.song.spotifyPerfectMatch && (
                                                            <span title="Perfect Spotify match" className="inline-block align-middle flex-shrink-0" aria-label="Spotify perfect match">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
                                                                    <circle cx="12" cy="12" r="12" fill="#1ED760"/>
                                                                    <path d="M17.25 16.13a.75.75 0 0 1-1.03.23c-2.82-1.73-6.39-2.12-10.6-1.17a.75.75 0 1 1-.32-1.47c4.6-1.01 8.56-.57 11.7 1.27.36.22.47.69.25 1.03zm1.47-2.93a.94.94 0 0 1-1.29.29c-3.23-2-8.16-2.59-11.98-1.52a.94.94 0 1 1-.53-1.81c4.23-1.23 9.6-.59 13.3 1.7.44.27.58.85.3 1.34zm.16-3.02c-3.7-2.21-9.81-2.42-13.19-1.42a1.13 1.13 0 1 1-.64-2.18c3.85-1.13 10.54-.89 14.7 1.6a1.13 1.13 0 0 1-1.17 1.99z" fill="#fff"/>
                                                                </svg>
                                                            </span>
                                                        )}
                                                        {/* Tags display */}
                                                        {getTags(setListSong.song.tags).length > 0 && (
                                                            <div className="flex flex-wrap gap-1">
                                                                {getTags(setListSong.song.tags).map((tag, i) => (
                                                                    <span key={i} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                                        <span className="truncate">
                                                            {setListSong.song.artist || '—'}
                                                        </span>
                                                        <span className="flex-shrink-0">
                                                            Key: {formatKeyLabel(setListSong.song.key)}
                                                        </span>
                                                    </div>
                                                    {setListSong.song.chart && (
                                                        <div className="mt-2">
                                                            <a href={setListSong.song.chart} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline text-xs">
                                                                View Chart
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-end space-x-2 flex-shrink-0">
                                                    <EditSongForm song={setListSong.song} />
                                                    <EditSetListButton song={setListSong.song} add={add || false} setId={setId} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }

    // Fallback: list layout for non-setlist (repertoire)
    if (!setId || add) {
        return (
            <div className="space-y-2">
                {/* Bulk Copy Controls */}
                <div className="flex items-center mb-2 gap-2">
                    <button
                        type="button"
                        className="px-2 py-1 text-xs rounded border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 mb-1 mt-1 ml-2"
                        disabled={selectedSongIds.length === 0}
                        onClick={() => { setBulkCopyMode(true); setCopyModalOpen(-1); setSelectedBandId(null); }}
                    >
                        <svg className="h-4 w-4 mr-1 inline-block align-text-bottom" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16h8M8 12h8m-8-4h8M4 6h16M4 18h16" />
                        </svg>
                        Copy Selected to Band
                    </button>
                    <button
                        type="button"
                        className="px-2 py-1 bg-gray-200 rounded text-xs"
                        onClick={selectAll}
                    >
                        Select All
                    </button>
                    <button
                        type="button"
                        className="px-2 py-1 bg-gray-200 rounded text-xs"
                        onClick={clearSelection}
                    >
                        Clear
                    </button>
                    <span className="text-xs text-gray-500 ml-2">{selectedSongIds.length} selected</span>
                </div>
                {sortedLocalSongs.map((setListSong) => (
                    <div
                        key={setListSong.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors flex items-center cursor-pointer max-sm:flex-col"
                        onClick={e => {
                            // Only toggle if not clicking on a button or input
                            if (
                                e.target instanceof HTMLElement &&
                                !['INPUT', 'BUTTON', 'SVG', 'A'].includes(e.target.tagName)
                            ) {
                                toggleSongSelection(setListSong.song.id);
                            }
                        }}
                    >
                        {/* Checkbox for bulk selection */}
                        <input
                            type="checkbox"
                            className="mr-3  max-sm:mr-0  max-sm:mb-2"
                            checked={selectedSongIds.includes(setListSong.song.id)}
                            onChange={() => toggleSongSelection(setListSong.song.id)}
                            onClick={e => e.stopPropagation()}
                        />
                        <div className="flex-1 min-w-1/3 max-sm:min-w-full">
                            <div className="flex items-center gap-2 mb-1 max-sm:flex-col">
                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                    {setListSong.song.title}
                                </h3>
                                {setListSong.song.spotifyPerfectMatch && (
                                    <span title="Perfect Spotify match" className="inline-block align-middle flex-shrink-0" aria-label="Spotify perfect match">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
                                            <circle cx="12" cy="12" r="12" fill="#1ED760"/>
                                            <path d="M17.25 16.13a.75.75 0 0 1-1.03.23c-2.82-1.73-6.39-2.12-10.6-1.17a.75.75 0 1 1-.32-1.47c4.6-1.01 8.56-.57 11.7 1.27.36.22.47.69.25 1.03zm1.47-2.93a.94.94 0 0 1-1.29.29c-3.23-2-8.16-2.59-11.98-1.52a.94.94 0 1 1-.53-1.81c4.23-1.23 9.6-.59 13.3 1.7.44.27.58.85.3 1.34zm.16-3.02c-3.7-2.21-9.81-2.42-13.19-1.42a1.13 1.13 0 1 1-.64-2.18c3.85-1.13 10.54-.89 14.7 1.6a1.13 1.13 0 0 1-1.17 1.99z" fill="#fff"/>
                                        </svg>
                                    </span>
                                )}
                                {/* Tags display */}
                                {getTags(setListSong.song.tags).length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {getTags(setListSong.song.tags).map((tag, i) => (
                                            <span key={i} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 max-sm:justify-center">
                                <span className="truncate">
                                    {setListSong.song.artist || '—'}
                                </span>
                                <span className="flex-shrink-0">
                                    Key: {formatKeyLabel(setListSong.song.key)}
                                </span>
                            </div>
                            {setListSong.song.chart && (
                                <div className="mt-2  max-sm:justify-center  max-sm:flex">
                                    <a href={setListSong.song.chart} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline text-xs">
                                        View Chart
                                    </a>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-end space-x-2 flex-shrink-0  max-sm:mt-2">
                            <EditSongForm song={setListSong.song} />
                            {!setId && <DeleteSongButton id={setListSong.song.id} />}
                            {/* Removed per-row Copy to Band button for a cleaner UI */}
                        </div>
                    </div>
                ))}
                {/* Copy to Band Modal (single or bulk) */}
                {copyModalOpen !== null && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-2">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Copy Song{bulkCopyMode ? 's' : ''} to Another Band</h3>
                            {loadingBands ? (
                                <div className="text-center py-4">Loading bands...</div>
                            ) : (
                                <form onSubmit={async e => {
                                    e.preventDefault();
                                    if (!selectedBandId || copyModalOpen === null) return;
                                    setCopying(true);
                                    try {
                                        if (bulkCopyMode) {
                                            // Bulk copy
                                            let success = 0, duplicate = 0, fail = 0;
                                            for (const songId of selectedSongIds) {
                                                try {
                                                    await copySongToBand(songId, selectedBandId);
                                                    success++;
                                                } catch (err: any) {
                                                    if (err?.message === 'DUPLICATE_SONG' || err?.code === 'DUPLICATE_SONG') {
                                                        duplicate++;
                                                    } else {
                                                        fail++;
                                                    }
                                                }
                                            }
                                            toast.success(`${success} copied, ${duplicate} duplicate${duplicate !== 1 ? 's' : ''}${fail ? `, ${fail} failed` : ''}`);
                                            setBulkCopyMode(false);
                                            setSelectedSongIds([]);
                                        } else {
                                            await copySongToBand(copyModalOpen, selectedBandId);
                                            toast.success('Song copied successfully!');
                                        }
                                        setCopyModalOpen(null);
                                    } catch (err: any) {
                                        if (!bulkCopyMode && (err?.message === 'DUPLICATE_SONG' || err?.code === 'DUPLICATE_SONG')) {
                                            // Show rename modal (single only)
                                            const song = localSongs.find(s => s.song.id === copyModalOpen)?.song;
                                            setRenameTitle(song?.title || "");
                                            setRenameTarget({ songId: copyModalOpen, bandId: selectedBandId });
                                            setShowRenameModal(true);
                                        } else {
                                            toast.error('Failed to copy song(s).');
                                        }
                                    } finally {
                                        setCopying(false);
                                    }
                                }}>
                                    <label htmlFor="band-select" className="block text-sm font-medium text-gray-700 mb-2">Select Band</label>
                                    <select
                                        id="band-select"
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-4"
                                        value={selectedBandId ?? ''}
                                        onChange={e => setSelectedBandId(Number(e.target.value))}
                                        required
                                    >
                                        <option value="" disabled>Select a band</option>
                                        {bands.map(band => (
                                            <option key={band.id} value={band.id}>{band.name}</option>
                                        ))}
                                    </select>
                                    <div className="flex justify-end space-x-3 mt-4">
                                        <button
                                            type="button"
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                                            onClick={() => { setCopyModalOpen(null); setBulkCopyMode(false); }}
                                            disabled={copying}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
                                            disabled={!selectedBandId || copying}
                                        >
                                            {copying ? 'Copying...' : (bulkCopyMode ? `Copy ${selectedSongIds.length} Songs` : 'Copy')}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
                {/* Rename Modal for duplicate song (single only) */}
                {showRenameModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-2">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Duplicate Song</h3>
                            <p className="mb-2 text-sm text-gray-700">A song with this title and artist already exists in the target band. Please enter a new title to copy the song, or cancel.</p>
                            <input
                                type="text"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-4"
                                value={renameTitle}
                                onChange={e => setRenameTitle(e.target.value)}
                                autoFocus
                            />
                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                                    onClick={() => { setShowRenameModal(false); setRenameTarget(null); }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
                                    onClick={async () => {
                                        if (!renameTarget || !renameTitle.trim()) return;
                                        setCopying(true);
                                        try {
                                            await copySongToBand(renameTarget.songId, renameTarget.bandId, renameTitle.trim());
                                            toast.success('Song copied successfully!');
                                            setShowRenameModal(false);
                                            setRenameTarget(null);
                                            setCopyModalOpen(null);
                                        } catch (err) {
                                            toast.error('Failed to copy song.');
                                        } finally {
                                            setCopying(false);
                                        }
                                    }}
                                    disabled={!renameTitle.trim() || copying}
                                >
                                    {copying ? 'Copying...' : 'Copy'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default SongList;