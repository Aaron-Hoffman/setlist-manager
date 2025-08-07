"use client";
import React, { useMemo, useState } from "react";
import { Song } from "@prisma/client";
import SongList from "./SongList";
import getBandFilters from "@/utils/getBandFilters";
import filterSongs, { SongFilter } from "@/utils/filterSongs";

interface FilteredRepertoireProps {
  songs: Song[];
  bandId: number;
}

const FilteredRepertoire: React.FC<FilteredRepertoireProps> = ({ songs, bandId }) => {
  const filters = useMemo(() => getBandFilters({ songs } as any), [songs]);
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Build filter array for filterSongs
  const activeFilters: SongFilter[] = useMemo(() => {
    const arr: SongFilter[] = [];
    if (selectedKey) arr.push({ key: "key", value: selectedKey });
    if (selectedTags.length > 0) arr.push({ key: "tags", value: selectedTags });
    return arr;
  }, [selectedKey, selectedTags]);

  // Apply filters first, then search
  const filteredSongs = useMemo(() => {
    let result = filterSongs(songs, activeFilters);
    
    // Apply search filter if search term exists
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(song => 
        song.title.toLowerCase().includes(searchLower) ||
        (song.artist && song.artist.toLowerCase().includes(searchLower))
      );
    }
    
    return result;
  }, [songs, activeFilters, searchTerm]);

  const hasActiveFilters = selectedKey || selectedTags.length > 0 || searchTerm.trim();

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4 items-end ml-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search songs, artists..."
            className="block w-64 rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Key</label>
          <select
            className="block w-32 rounded border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            value={selectedKey}
            onChange={e => setSelectedKey(e.target.value)}
          >
            <option value="">All</option>
            {filters.keys?.map((key: string) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <div className="flex flex-wrap gap-2">
            {filters.tags?.map((tag: string) => (
              <label key={tag} className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-1 accent-indigo-500"
                  checked={selectedTags.includes(tag)}
                  onChange={e => {
                    setSelectedTags(prev =>
                      e.target.checked
                        ? [...prev, tag]
                        : prev.filter(t => t !== tag)
                    );
                  }}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>
        {hasActiveFilters && (
          <button
            className="ml-4 px-3 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300"
            onClick={() => { 
              setSelectedKey(""); 
              setSelectedTags([]); 
              setSearchTerm("");
            }}
          >
            Clear All
          </button>
        )}
      </div>
      <SongList songList={filteredSongs} bandId={bandId} />
    </div>
  );
};

export default FilteredRepertoire;