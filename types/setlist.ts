import { Band, SetList, Song } from "@prisma/client";

export interface SetSongWithSong {
    id: number;
    songId: number;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    song: Song;
}

export interface SetWithSongs {
    id: number;
    setListId: number;
    name: string;
    order: number;
    setSongs: SetSongWithSong[];
    createdAt: Date;
    updatedAt: Date;
}

// Matches the include used in app/bands/[id]/setlist/[setId]/page.tsx
export type SetListWithBandAndSets = SetList & {
    band: Band;
    sets: SetWithSongs[];
};


