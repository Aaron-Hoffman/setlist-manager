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

  if (repertoire.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 ml-4">
      <select
        className="border rounded px-2 py-1 text-sm"
        value={selectedSongId ?? ''}
        onChange={e => setSelectedSongId(Number(e.target.value))}
        disabled={isPending}
      >
        <option value="" disabled>Select song to add</option>
        {repertoire.map(song => (
          <option key={song.id} value={song.id}>{song.title}{song.artist ? ` – ${song.artist}` : ''}</option>
        ))}
      </select>
      <button
        className="px-2 py-1 bg-green-600 text-white rounded text-sm disabled:opacity-50"
        onClick={handleAdd}
        disabled={!selectedSongId || isPending}
      >
        Add
      </button>
    </div>
  );
};

export default AddSongToSetDropdown; 