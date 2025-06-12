import { sampleSize } from "lodash";
import { Song } from "@prisma/client";

const createSetList = (repertoire: Song[], numberOfSongs: number = 1) => {
    const selectedSongs = sampleSize(repertoire, numberOfSongs);
    return selectedSongs.map(song => ({ id: song.id }));
}

export default createSetList;