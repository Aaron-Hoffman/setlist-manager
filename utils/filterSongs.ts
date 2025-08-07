import { filter, isEmpty } from "lodash";
import { Song } from "@prisma/client";

// Define a type for the filters
export type SongFilter =
  | { key: "tags"; value: string[] }
  | { key: keyof Omit<Song, "tags">; value: string };

const filterSongs = (songs: Song[], filters: SongFilter[]): Song[] => {
  if (isEmpty(filters)) return songs;

  const filteredSongs = filter(songs, (song) => {
    return filters.every((filter) => {
      if (filter.key === "tags") {
        // song.tags can be JsonValue, so handle string[], string, or null
        const tags = Array.isArray(song.tags)
          ? song.tags
          : typeof song.tags === "string"
          ? (() => {
              try {
                const parsed = JSON.parse(song.tags);
                return Array.isArray(parsed) ? parsed : [];
              } catch {
                return [];
              }
            })()
          : [];
        return (
          Array.isArray(tags) &&
          filter.value.every((tag) => tags.includes(tag))
        );
      } else {
        // TypeScript: filter.key is keyof Omit<Song, "tags">
        return song[filter.key] === filter.value;
      }
    });
  });

  return filteredSongs;
};

export default filterSongs;