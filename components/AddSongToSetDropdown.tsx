'use client';

import { useState } from 'react';
import { Song } from '@prisma/client';
import { editSetList } from '@/utils/serverActions';

interface AddSongToSetDropdownProps {
  setId: number;
  repertoire: Song[];
}

const AddSongToSetDropdown = ({ setId, repertoire }: AddSongToSetDropdownProps) => {
  const [selectedSongId, setSelectedSongId] = useState<number | undefined>();
  const [isPending, setIsPending] = useState(false);

  const handleAdd = async () => {
    if (!selectedSongId) return;
    setIsPending(true);
    const song = repertoire.find(s => s.id === selectedSongId);
    if (song) {
      await editSetList(setId, song, true);
      setSelectedSongId(undefined);
    }
    setIsPending(false);
  };

  // Sort repertoire alphabetically by title
  const sortedRepertoire = [...repertoire].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));

  if (repertoire.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 ml-4 mr-4 w-full sm:w-auto">
      <select
        className="border rounded px-2 py-1 text-sm w-full sm:w-auto"
        value={selectedSongId ?? ''}
        onChange={e => setSelectedSongId(Number(e.target.value))}
        disabled={isPending}
      >
        <option value="" disabled>Select song to add</option>
        {sortedRepertoire.map(song => (
          <option key={song.id} value={song.id}>{song.title}{song.artist ? ` – ${song.artist}` : ''}</option>
        ))}
      </select>
      <button
        className="px-2 py-1 bg-green-600 text-white rounded text-sm disabled:opacity-50 w-full sm:w-auto"
        onClick={handleAdd}
        disabled={!selectedSongId || isPending}
      >
        Add
      </button>
    </div>
  );
};

export default AddSongToSetDropdown; 